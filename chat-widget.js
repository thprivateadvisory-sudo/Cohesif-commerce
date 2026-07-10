/**
 * Cohesif Commerce - Assistant "Léa"
 * Structure inspirée de Cohesif Energy
 */
(function () {
  'use strict';

  const BRAND_BLACK = '#111111';
  const BRAND_SOFT  = '#f5f5f5';

  // ─── FAQ avec suggestions de navigation ───────────────────────────────────
  const faqData = [
    {
      id: 'sourcing',
      question: 'Sourcing Chine',
      answer: 'Nos équipes sont physiquement présentes à Shenzhen. Elles négocient directement avec les fournisseurs, contrôlent la qualité sur place et sécurisent vos délais. Pas d\'intermédiaires, pas de surprises — vous recevez exactement ce que vous avez commandé. 🇨🇳',
      suggestions: ['Contrôle qualité', 'Logistique internationale', 'Devis gratuit']
    },
    {
      id: 'qualite',
      question: 'Contrôle qualité',
      answer: 'Nos inspecteurs sur place en Chine contrôlent chaque commande avant expédition : conformité du produit, emballage, étiquetage. Vous recevez un rapport photo complet. Zéro mauvaise surprise à la réception. ✅',
      suggestions: ['Sourcing Chine', 'Logistique internationale', 'Private label']
    },
    {
      id: 'logistique',
      question: 'Logistique internationale',
      answer: 'Nous gérons l\'ensemble de la chaîne logistique : fret maritime ou aérien, dédouanement, livraison entrepôt ou client final. Notre entrepôt en Chine permet le groupage de commandes pour réduire vos coûts. 🚢',
      suggestions: ['Sourcing Chine', 'Dropshipping', 'Devis gratuit']
    },
    {
      id: 'ecommerce',
      question: 'Accompagnement e-commerce',
      answer: 'De l\'idée à l\'exécution : nous vous accompagnons sur la stratégie produit, le positionnement, la création de votre boutique, et la montée en charge. +240 entrepreneurs accompagnés depuis 2021, 98% de satisfaction. 🛒',
      suggestions: ['Lancer mon business', 'Scaling', 'Devis gratuit']
    },
    {
      id: 'lancer',
      question: 'Lancer mon business',
      answer: 'Vous avez une idée de produit ? Nous l\'analysons avec vous : étude de marché, sourcing fournisseur, test produit, lancement boutique. Un parcours complet de A à Z pour éviter les erreurs classiques des débutants. 🚀',
      suggestions: ['Sourcing Chine', 'Accompagnement e-commerce', 'Devis gratuit']
    },
    {
      id: 'scaling',
      question: 'Scaling',
      answer: 'Votre boutique tourne mais vous voulez passer au niveau supérieur ? Nous structurons votre croissance : nouveaux marchés, optimisation des marges, automatisation logistique, nouvelles gammes de produits. 📈',
      suggestions: ['Accompagnement e-commerce', 'Logistique internationale', 'Devis gratuit']
    },
    {
      id: 'private_label',
      question: 'Private label',
      answer: 'Créez votre propre marque avec nos fournisseurs partenaires en Chine. Personnalisation du produit, packaging sur mesure, étiquetage à votre marque. Commandes minimales adaptées aux entrepreneurs. 🏷️',
      suggestions: ['Sourcing Chine', 'Contrôle qualité', 'Devis gratuit']
    },
    {
      id: 'dropshipping',
      question: 'Dropshipping',
      answer: 'Nous pouvons vous accompagner sur un modèle dropshipping avec des fournisseurs fiables en Chine : sélection des produits, intégration catalogue, suivi des expéditions. Idéal pour tester un marché sans stock. 📦',
      suggestions: ['Sourcing Chine', 'Logistique internationale', 'Lancer mon business']
    },
    {
      id: 'delai',
      question: 'Délais de livraison',
      answer: 'Fret maritime : 25 à 35 jours. Fret aérien : 5 à 10 jours. Express (DHL/FedEx) : 3 à 5 jours. Nous choisissons avec vous le meilleur équilibre coût/délai selon vos contraintes commerciales. ⏱️',
      suggestions: ['Logistique internationale', 'Sourcing Chine', 'Devis gratuit']
    },
    {
      id: 'tarifs',
      question: 'Tarifs',
      answer: 'Nos tarifs dépendent du volume et du type d\'accompagnement souhaité. Nous proposons des forfaits sourcing, des commissions sur achat, et des formules d\'accompagnement mensuel. Demandez un devis gratuit pour une proposition personnalisée ! 💰',
      suggestions: ['Devis gratuit', 'Accompagnement e-commerce', 'Contact']
    },
    {
      id: 'bureaux',
      question: 'Bureaux',
      answer: 'Cohesif Commerce dispose de deux bureaux opérationnels : siège européen à Paris (75008) et bureau Asie à Shenzhen (Chine), plus un entrepôt logistique en Chine. Un ancrage local pour vous protéger. 🌍',
      suggestions: ['Sourcing Chine', 'Contact', 'Groupe Cohesif']
    },
    {
      id: 'devis',
      question: 'Devis gratuit',
      answer: 'Notre premier échange est 100% gratuit et sans engagement. Décrivez votre projet, on vous rappelle sous 24h pour analyser ensemble la meilleure stratégie. Aucun engagement avant que vous soyez convaincu. 📞',
      suggestions: ['Sourcing Chine', 'Accompagnement e-commerce', 'Logistique internationale']
    },
    {
      id: 'contact',
      question: 'Contact',
      answer: 'Contactez-nous par email : cohesifcommerce@gmail.com ou via notre <a href="#contact" style="color:#111;font-weight:600;text-decoration:underline">formulaire de contact</a>. On vous répond sous 24h ! 📩',
      suggestions: ['Devis gratuit', 'Sourcing Chine', 'Accompagnement e-commerce']
    },
    {
      id: 'groupe',
      question: 'Groupe Cohesif',
      answer: 'Le Groupe Cohesif est un groupe français multi-métiers avec 8 pôles : Cohesif Energy (solaire, bornes, PAC), Cohesif BTP (rénovation), Cohesif Auto, Cohesif Commerce (sourcing, e-commerce), Cohesif Sport, Cohesif Agro, Cohesif Négoce et Cohesif Access. Un groupe, toutes les expertises ! 🏗️',
      suggestions: ['Contact', 'Devis gratuit', 'Accompagnement e-commerce']
    },
  ];

  const INITIAL_SUGGESTIONS = [
    '🇨🇳 Sourcing Chine',
    '📦 Logistique internationale',
    '🛒 Accompagnement e-commerce',
    '🚀 Lancer mon business',
    '📋 Devis gratuit',
  ];

  // ─── Avatar SVG (Léa, conseillère Cohesif Commerce) ───────────────────────
  const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="#111111"/>
    <path d="M8 44c0-8.8 6.3-16 14-16s14 7.2 14 16" fill="#0a0a0a"/>
    <path d="M14 30 L22 28 L30 30 L30 44 L14 44Z" fill="#2a2a2a"/>
    <path d="M19 29 L22 32 L25 29 L22 28Z" fill="#fff"/>
    <rect x="21" y="29" width="2" height="5" rx="1" fill="#aaaaaa" opacity="0.8"/>
    <circle cx="22" cy="16" r="9" fill="#f5c5a0"/>
    <path d="M13 12c0-5 4-8 9-8s9 3 9 8v2c-1-2-3-4-9-4s-8 2-9 4z" fill="#2d1b00"/>
    <path d="M13 13c0 0 2-2 9-2s9 2 9 2" stroke="#2d1b00" stroke-width="2" fill="none"/>
    <circle cx="18.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="25.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="19" cy="15.5" r="0.4" fill="#fff"/>
    <circle cx="26" cy="15.5" r="0.4" fill="#fff"/>
    <path d="M18.5 19.5 Q22 22 25.5 19.5" stroke="#c47a4a" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  </svg>`;

  // ─── CSS ───────────────────────────────────────────────────────────────────
  const CSS = `
    /* ──────────── ASSISTANT IA COHESIF COMMERCE */
    .cohesif-ai-assistant {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    /* Bulle d'invitation */
    .cohesif-ai-bubble {
      position: absolute;
      bottom: 88px;
      right: 0;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 18px 18px 4px 18px;
      padding: 16px 20px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      width: 260px;
      opacity: 0;
      transform: translateY(10px) scale(0.95);
      transition: opacity 0.4s, transform 0.4s;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .cohesif-ai-bubble.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .cohesif-ai-bubble-close {
      position: absolute;
      top: 8px; right: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: #6b7280;
      border: none;
      transition: background 0.15s;
      line-height: 1;
    }
    .cohesif-ai-bubble-close:hover { background: #e5e7eb; }
    .cohesif-ai-bubble-name {
      font-size: 12px; font-weight: 700;
      color: ${BRAND_BLACK};
      letter-spacing: 1px; text-transform: uppercase;
      margin-bottom: 4px;
    }
    .cohesif-ai-bubble-text {
      font-size: 14px;
      color: #111;
      line-height: 1.45;
    }

    /* Avatar bouton */
    .cohesif-ai-avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      border: 3px solid #fff;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 28px rgba(0,0,0,0.2),
                  0 0 0 1px rgba(0,0,0,0.1);
      transition: transform 0.25s, box-shadow 0.25s;
      position: relative;
      overflow: hidden;
      padding: 0;
    }
    .cohesif-ai-avatar:hover {
      transform: scale(1.08) rotate(-3deg);
      box-shadow: 0 14px 36px rgba(0,0,0,0.35),
                  0 0 0 1px rgba(0,0,0,0.2);
    }
    .cohesif-ai-avatar svg { width: 90%; height: auto; }
    .cohesif-ai-avatar-status {
      position: absolute;
      bottom: 4px; right: 4px;
      width: 16px; height: 16px;
      background: #16a34a;
      border: 3px solid #fff;
      border-radius: 50%;
      animation: cohesif-ai-pulse 2s infinite;
      z-index: 2;
    }
    @keyframes cohesif-ai-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.5); }
      70%  { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
      100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
    }

    /* Fenêtre de chat */
    .cohesif-ai-chat {
      position: absolute;
      bottom: 88px;
      right: 0;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 120px);
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .cohesif-ai-chat.open {
      display: flex;
      animation: cohesif-ai-chat-open 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes cohesif-ai-chat-open {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header */
    .cohesif-ai-chat-header {
      background: #111;
      color: #fff;
      padding: 18px 20px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .cohesif-ai-chat-mini-avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      flex-shrink: 0;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .cohesif-ai-chat-mini-avatar svg { width: 90%; height: auto; }
    .cohesif-ai-chat-info { flex: 1; line-height: 1.2; }
    .cohesif-ai-chat-name { font-size: 15px; font-weight: 700; color: #fff; }
    .cohesif-ai-chat-status {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      display: flex; align-items: center; gap: 6px;
      margin-top: 2px;
    }
    .cohesif-ai-chat-status::before {
      content: '';
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
    }
    .cohesif-ai-chat-close {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 18px;
      border: none;
      transition: background 0.15s;
      line-height: 1;
    }
    .cohesif-ai-chat-close:hover { background: rgba(255,255,255,0.2); }

    /* Body */
    .cohesif-ai-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex; flex-direction: column;
      gap: 14px;
      background: #f9fafb;
    }
    .cohesif-ai-chat-body::-webkit-scrollbar { width: 6px; }
    .cohesif-ai-chat-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

    /* Messages */
    .cohesif-ai-msg {
      max-width: 85%;
      padding: 11px 15px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: cohesif-ai-msg-in 0.3s ease both;
    }
    @keyframes cohesif-ai-msg-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cohesif-ai-msg-bot {
      background: #fff;
      border: 1px solid #e5e7eb;
      color: #111;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .cohesif-ai-msg-user {
      background: ${BRAND_BLACK};
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .cohesif-ai-msg-bot a {
      color: ${BRAND_BLACK};
      text-decoration: underline;
      font-weight: 600;
    }

    /* Indicateur de frappe */
    .cohesif-ai-typing {
      display: inline-flex;
      gap: 4px;
      padding: 4px 0;
    }
    .cohesif-ai-typing span {
      width: 7px; height: 7px;
      background: #9ca3af;
      border-radius: 50%;
      animation: cohesif-ai-typing-anim 1.2s infinite;
    }
    .cohesif-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cohesif-ai-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cohesif-ai-typing-anim {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-3px); }
    }

    /* Suggestions */
    .cohesif-ai-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 4px;
    }
    .cohesif-ai-suggestion {
      background: #fff;
      border: 1px solid #d1d5db;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 13px;
      color: #111;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, transform 0.15s;
      font-family: inherit;
    }
    .cohesif-ai-suggestion:hover {
      border-color: ${BRAND_BLACK};
      background: ${BRAND_SOFT};
      transform: translateY(-1px);
    }

    /* Footer */
    .cohesif-ai-chat-footer {
      padding: 14px 16px;
      border-top: 1px solid #e5e7eb;
      background: #fff;
      flex-shrink: 0;
    }
    .cohesif-ai-chat-footer-text {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      letter-spacing: 0.3px;
    }
    .cohesif-ai-chat-footer-cta {
      display: block;
      background: #111;
      color: #fff;
      text-align: center;
      padding: 12px;
      border-radius: 999px;
      font-weight: 600; font-size: 14px;
      margin-top: 8px;
      transition: background 0.15s, opacity 0.15s;
      text-decoration: none;
    }
    .cohesif-ai-chat-footer-cta:hover { opacity: 0.85; color: #fff; }

    /* Mobile sticky CTA */
    .cohesif-mobile-sticky-cta { display: none; }

    @media (max-width: 768px) {
      .cohesif-ai-assistant { bottom: 90px; right: 16px; }
      .cohesif-ai-avatar { width: 56px; height: 56px; }
      .cohesif-ai-bubble { bottom: 72px; width: 240px; }
      .cohesif-ai-chat { bottom: 72px; width: calc(100vw - 32px); height: 70vh; }

      .cohesif-mobile-sticky-cta {
        display: flex;
        position: fixed;
        bottom: 16px; left: 16px; right: 16px;
        z-index: 9998;
        background: #111;
        border-radius: 999px;
        padding: 4px 4px 4px 20px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.25),
                    0 0 0 1px rgba(255,255,255,0.05);
        transform: translateY(120%);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        text-decoration: none;
      }
      .cohesif-mobile-sticky-cta.visible { transform: translateY(0); }
      .cohesif-mobile-sticky-cta-text {
        color: #fff;
        font-size: 14px; font-weight: 600;
        line-height: 1.2;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .cohesif-mobile-sticky-cta-text small {
        display: block;
        color: rgba(255,255,255,0.6);
        font-size: 11px; font-weight: 500;
        margin-top: 2px; letter-spacing: 0.5px;
      }
      .cohesif-mobile-sticky-cta-btn {
        background: #333;
        color: #fff;
        font-size: 13px; font-weight: 700;
        padding: 12px 18px;
        border-radius: 999px;
        white-space: nowrap; flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
    }
  `;

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('cohesif-ai-widget')) return;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'cohesif-ai-widget';
    widget.innerHTML = `
      <div class="cohesif-ai-assistant">

        <div class="cohesif-ai-bubble">
          <button class="cohesif-ai-bubble-close" title="Fermer">&#x2715;</button>
          <div class="cohesif-ai-bubble-name">COHESIF COMMERCE</div>
          <div class="cohesif-ai-bubble-text">Besoin d'aide ? Posez vos questions !</div>
        </div>

        <button class="cohesif-ai-avatar" title="Parler à Léa">
          ${AVATAR_SVG}
          <div class="cohesif-ai-avatar-status"></div>
        </button>

        <div class="cohesif-ai-chat">
          <div class="cohesif-ai-chat-header">
            <div class="cohesif-ai-chat-mini-avatar">${AVATAR_SVG}</div>
            <div class="cohesif-ai-chat-info">
              <div class="cohesif-ai-chat-name">Léa &mdash; Conseillère Cohesif Commerce</div>
              <div class="cohesif-ai-chat-status">En ligne &middot; R&eacute;pond instantan&eacute;ment</div>
            </div>
            <button class="cohesif-ai-chat-close" title="Fermer">&#x2715;</button>
          </div>

          <div class="cohesif-ai-chat-body"></div>

          <div class="cohesif-ai-chat-footer">
            <div class="cohesif-ai-chat-footer-text">Propuls&eacute; par IA &middot; Cohesif Commerce</div>
            <a href="#contact" class="cohesif-ai-chat-footer-cta">Nous contacter</a>
          </div>
        </div>

      </div>

      <a href="#contact" class="cohesif-mobile-sticky-cta">
        <div class="cohesif-mobile-sticky-cta-text">
          Prêt à vous lancer ?
          <small>Cliquez ici</small>
        </div>
        <div class="cohesif-mobile-sticky-cta-btn">Contact gratuit</div>
      </a>
    `;
    document.body.appendChild(widget);

    const bubble      = widget.querySelector('.cohesif-ai-bubble');
    const bubbleClose = widget.querySelector('.cohesif-ai-bubble-close');
    const avatar      = widget.querySelector('.cohesif-ai-avatar');
    const chatWindow  = widget.querySelector('.cohesif-ai-chat');
    const chatClose   = widget.querySelector('.cohesif-ai-chat-close');
    const chatBody    = widget.querySelector('.cohesif-ai-chat-body');
    const mobileCta   = widget.querySelector('.cohesif-mobile-sticky-cta');

    let chatOpen = false;

    setTimeout(function () {
      if (!chatOpen) bubble.classList.add('show');
    }, 3000);

    bubbleClose.addEventListener('click', function (e) {
      e.stopPropagation();
      bubble.classList.remove('show');
    });

    avatar.addEventListener('click', function () {
      chatOpen = !chatOpen;
      if (chatOpen) {
        chatWindow.classList.add('open');
        bubble.classList.remove('show');
        initChat();
      } else {
        chatWindow.classList.remove('open');
      }
    });

    chatClose.addEventListener('click', function () {
      chatOpen = false;
      chatWindow.classList.remove('open');
    });

    function initChat() {
      if (chatBody.children.length === 0) {
        addBotMsg('Bonjour ! 👋 Je suis Léa, votre conseillère Cohesif Commerce. Je peux vous aider sur le sourcing en Chine, la logistique ou votre projet e-commerce. Comment puis-je vous aider ?');
        setTimeout(function () { showSuggestions(INITIAL_SUGGESTIONS); }, 400);
      }
    }

    function addBotMsg(html) {
      var el = document.createElement('div');
      el.className = 'cohesif-ai-msg cohesif-ai-msg-bot';
      el.innerHTML = html;
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addUserMsg(text) {
      var el = document.createElement('div');
      el.className = 'cohesif-ai-msg cohesif-ai-msg-user';
      el.textContent = text;
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
      var el = document.createElement('div');
      el.id = 'cohesif-typing-indicator';
      el.className = 'cohesif-ai-msg cohesif-ai-msg-bot';
      el.innerHTML = '<div class="cohesif-ai-typing"><span></span><span></span><span></span></div>';
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTyping() {
      var el = document.getElementById('cohesif-typing-indicator');
      if (el) el.remove();
    }

    function showSuggestions(list) {
      var container = document.createElement('div');
      container.className = 'cohesif-ai-suggestions';
      list.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'cohesif-ai-suggestion';
        btn.textContent = text;
        btn.addEventListener('click', function () { handleInput(text); });
        container.appendChild(btn);
      });
      chatBody.appendChild(container);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleInput(text) {
      addUserMsg(text);
      showTyping();

      var clean = text.replace(/[\u{1F300}-\u{1FFFF}]|\p{Emoji}/gu, '').trim().toLowerCase();
      var faq = null;
      for (var i = 0; i < faqData.length; i++) {
        var q = faqData[i].question.toLowerCase();
        if (clean.includes(q) || q.includes(clean)) { faq = faqData[i]; break; }
      }

      setTimeout(function () {
        hideTyping();
        if (faq) {
          addBotMsg(faq.answer);
          setTimeout(function () { showSuggestions(faq.suggestions); }, 300);
        } else {
          addBotMsg('Je ne suis pas sûre de comprendre. Voici les sujets sur lesquels je peux vous aider :');
          setTimeout(function () { showSuggestions(INITIAL_SUGGESTIONS); }, 300);
        }
      }, 700 + Math.random() * 300);
    }

    function toggleMobileCta() {
      if (!mobileCta) return;
      if (window.scrollY > 300) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleMobileCta, { passive: true });
    toggleMobileCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
