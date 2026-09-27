# Boutique : paiement centralisé Cohesif Commerce

Les sites des marques (Cohesif Energy, puis BTP, Négoce…) présentent les produits.
Le bouton « Acheter » renvoie vers `commande.html?produit=REF` sur cohesifcommerce.fr,
qui affiche le récapitulatif puis redirige vers le lien de paiement Stripe.

| Fichier | Rôle |
|---|---|
| `commande.html` | Récapitulatif de la commande et bouton de paiement |
| `commande-confirmee.html` | Page de remerciement après le paiement Stripe |
| `cgv-vente.html` | CGV de vente des produits |
| `data/catalogues/*.json` | Copie des catalogues des marques (générée par le site de la marque) |
| `data/paiements.json` | Lien de paiement Stripe pour chaque référence |
| `tools/stripe_setup.py` | Crée les produits, prix et liens de paiement dans Stripe |

## Activer le paiement

1. Dans Stripe, compléter le profil de l'entreprise et activer les moyens de paiement
   (cartes, Apple Pay, Google Pay ; Klarna pour le paiement en plusieurs fois si souhaité).
2. Lancer le script avec la clé **test** :
   `STRIPE_SECRET_KEY=sk_test_... python3 tools/stripe_setup.py`
3. Tester un achat avec la carte `4242 4242 4242 4242`.
4. Relancer avec la clé **live** (`sk_live_...`) : tous les liens sont recréés en production.

Tant qu'une référence n'a pas de lien, la page propose une commande par e-mail.

## Changer un prix

1. Modifier le prix dans `data/boutique.json` du site de la marque.
2. Lancer `python3 tools/build_boutique.py` dans le dépôt de la marque
   (régénère les pages et recopie le catalogue ici).
3. Vider le lien de la référence dans `data/paiements.json`, puis relancer `tools/stripe_setup.py`.

Le montant réellement débité est celui du lien Stripe : les trois étapes doivent être faites ensemble.

## Ajouter une marque

Préfixe de référence par marque (`CE-` pour Cohesif Energy). Ajouter le catalogue dans
`data/catalogues/` et le préfixe dans la table `CATALOGUES` de `commande.html`.

## Avant la mise en ligne

- Compléter dans `cgv-vente.html` le numéro de TVA intracommunautaire et le médiateur de la consommation (obligatoire).
