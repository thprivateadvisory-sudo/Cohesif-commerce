#!/usr/bin/env python3
"""Crée dans Stripe les produits, prix et liens de paiement de la boutique.

    STRIPE_SECRET_KEY=sk_test_... python3 tools/stripe_setup.py
    STRIPE_SECRET_KEY=sk_live_... python3 tools/stripe_setup.py   # passage en production

Lit les catalogues de data/catalogues/*.json et écrit les liens obtenus dans
data/paiements.json. Les références qui ont déjà un lien dans le même mode
(test ou live) sont ignorées ; --force recrée tout.

Chaque lien de paiement :
  - demande l'adresse de livraison (France) et le téléphone ;
  - permet de saisir un numéro de TVA (clients professionnels) ;
  - génère automatiquement une facture envoyée par e-mail ;
  - renvoie vers commande-confirmee.html après le paiement.

La clé secrète n'est lue que depuis la variable d'environnement : ne jamais
l'écrire dans un fichier du dépôt.
"""
import base64
import hashlib
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAIEMENTS = ROOT / "data" / "paiements.json"
SITE = "https://cohesifcommerce.fr"
TVA = 0.20
API = "https://api.stripe.com/v1/"


def flatten(data, prefix=""):
    out = []
    if isinstance(data, dict):
        for k, v in data.items():
            out += flatten(v, f"{prefix}[{k}]" if prefix else k)
    elif isinstance(data, list):
        for i, v in enumerate(data):
            out += flatten(v, f"{prefix}[{i}]")
    elif isinstance(data, bool):
        out.append((prefix, "true" if data else "false"))
    else:
        out.append((prefix, str(data)))
    return out


def stripe(key, path, data):
    body = urllib.parse.urlencode(flatten(data)).encode()
    req = urllib.request.Request(API + path, data=body, method="POST")
    req.add_header("Authorization", "Basic " + base64.b64encode(f"{key}:".encode()).decode())
    req.add_header("Idempotency-Key", hashlib.sha256(path.encode() + body).hexdigest())
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as err:
        msg = json.loads(err.read()).get("error", {}).get("message", "")
        sys.exit(f"Erreur Stripe sur {path} : {msg}")


def main():
    key = os.environ.get("STRIPE_SECRET_KEY", "")
    if not key.startswith(("sk_test_", "sk_live_", "rk_test_", "rk_live_")):
        sys.exit("Définissez STRIPE_SECRET_KEY (sk_test_... pour tester).")
    mode = "live" if "_live_" in key else "test"
    force = "--force" in sys.argv

    pay = json.loads(PAIEMENTS.read_text(encoding="utf-8"))
    if pay.get("mode") != mode:
        force = True  # changement test <-> live : tous les liens sont à recréer
    liens = pay.setdefault("liens", {})

    rates = {}

    def shipping_rate(nom, unit, mini, maxi):
        k = (nom, unit, mini, maxi)
        if k not in rates:
            rates[k] = stripe(key, "shipping_rates", {
                "display_name": nom, "type": "fixed_amount",
                "fixed_amount": {"amount": 0, "currency": "eur"},
                "delivery_estimate": {"minimum": {"unit": unit, "value": mini},
                                      "maximum": {"unit": unit, "value": maxi}},
            })["id"]
        return rates[k]

    for cat_file in sorted((ROOT / "data" / "catalogues").glob("*.json")):
        cat = json.loads(cat_file.read_text(encoding="utf-8"))
        for p in cat["produits"]:
            for v in p["variantes"]:
                ref = v["id"]
                if liens.get(ref) and not force:
                    print(f"= {ref} (déjà configuré)")
                    continue
                ttc = v["prix"] * (1 + TVA) if p["affichage"] == "HT" else v["prix"]
                acompte = p.get("paiement") == "acompte"
                montant = round(ttc * p["acomptePct"]) if acompte else round(ttc * 100)
                nom = p["nom"] + (f" — {v['label']}" if len(p["variantes"]) > 1 else "")
                if acompte:
                    nom = f"Acompte {p['acomptePct']} % — {nom}"
                product = stripe(key, "products", {
                    "name": nom,
                    "description": v["detail"],
                    "images": [f"{cat['site']}/img/boutique/stripe/{Path(p['image']).stem}.jpg"],
                    "metadata": {"ref": ref, "marque": cat["marque"]},
                    "default_price_data": {"currency": "eur", "unit_amount": montant},
                })
                if p["gamme"] == "dc":
                    rate = shipping_rate("Livraison sur palette incluse — France métropolitaine", "week", 6, 8)
                elif p["gamme"] == "batterie":
                    rate = shipping_rate("Livraison offerte — France métropolitaine", "business_day", 7, 10)
                else:
                    rate = shipping_rate("Livraison offerte — France métropolitaine", "business_day", 7, 12)
                message = ("Acompte de réservation. Le solde est réglé par virement avant expédition. "
                           if acompte else "")
                link = stripe(key, "payment_links", {
                    "line_items": [{
                        "price": product["default_price"], "quantity": 1,
                        "adjustable_quantity": {"enabled": True, "minimum": 1, "maximum": 20},
                    }],
                    "shipping_address_collection": {"allowed_countries": ["FR"]},
                    "shipping_options": [{"shipping_rate": rate}],
                    "billing_address_collection": "required",
                    "phone_number_collection": {"enabled": True},
                    "tax_id_collection": {"enabled": True},
                    "invoice_creation": {"enabled": True, "invoice_data": {
                        "description": nom, "metadata": {"ref": ref},
                        "footer": "Groupe Cohesif — Cohesif Commerce · 200 rue de la Croix Nivert, 75015 Paris · SIRET 889 287 462 00036",
                    }},
                    "allow_promotion_codes": True,
                    "custom_text": {"submit": {"message": message +
                                               f"En payant, vous acceptez nos CGV : {SITE}/cgv-vente.html"}},
                    "after_completion": {"type": "redirect", "redirect": {
                        "url": f"{SITE}/commande-confirmee.html?produit={ref}"}},
                    "metadata": {"ref": ref, "marque": cat["marque"]},
                })
                liens[ref] = link["url"]
                print(f"+ {ref} : {link['url']}")

    pay["mode"] = mode
    PAIEMENTS.write_text(json.dumps(pay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\n{PAIEMENTS} mis à jour (mode {mode}).")


if __name__ == "__main__":
    main()
