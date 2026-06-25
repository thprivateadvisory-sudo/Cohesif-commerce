(function() {
  'use strict';

  /* ==========================================================
     1. NAV — scroll state
     ========================================================== */
  const nav = document.getElementById('nav');
  const updateNavState = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  /* ==========================================================
     2. SMOOTH SCROLL — tous les liens [data-scroll]
     Gère le décalage de la nav fixe + mise à jour URL
     ========================================================== */
  const NAV_OFFSET = 100;

  function smoothScrollTo(targetId, updateHash) {
    if (!targetId || targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (updateHash) history.replaceState(null, '', window.location.pathname);
      return;
    }

    // #top → haut de page
    if (targetId === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (updateHash) history.replaceState(null, '', window.location.pathname);
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    if (updateHash) history.replaceState(null, '', targetId);
  }

  // Attache le comportement à TOUS les liens internes
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.length < 1) return;

      // Skip si le lien n'est pas interne valide
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }

      // Vérifie que la cible existe
      const isTop = href === '#top';
      const target = isTop ? document.body : document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      smoothScrollTo(href, true);

      // Ferme le menu mobile si ouvert
      closeMobileMenu();
    });
  });

  // Si chargement direct avec un hash (#services par ex)
  if (window.location.hash) {
    setTimeout(() => {
      smoothScrollTo(window.location.hash, false);
    }, 100);
  }

  /* ==========================================================
     3. MOBILE MENU
     ========================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  function openMobileMenu() {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navMobile.classList.add('open');
    navMobile.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!navMobile.classList.contains('open')) {
        navMobile.style.display = 'none';
      }
    }, 300);
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navMobile.classList.contains('open')) closeMobileMenu();
      else openMobileMenu();
    });
  }

  // Fermer le menu mobile au redimensionnement en desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && navMobile.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================
     4. FADE-IN au scroll
     ========================================================== */
  const fadeIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => fadeIO.observe(el));

  /* ==========================================================
     5. STATS — compteurs animés
     ========================================================== */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const sup = el.querySelector('sup');
    const supHTML = sup ? sup.outerHTML : '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(target * eased) + supHTML;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        statsIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-num').forEach(el => statsIO.observe(el));

  /* ==========================================================
     6. NAV — highlight du lien actif
     ========================================================== */
  const sections = ['solution','services','approche','presence','equipe','avis','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks = document.querySelectorAll('.nav-links a[data-scroll]');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + NAV_OFFSET + 50;
    let currentId = null;

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) link.classList.add('active');
      else link.classList.remove('active');
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ==========================================================
     7. MODAL CONTACT — ouverture, fermeture, formulaire
     ========================================================== */
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const modalFormView = document.getElementById('modalFormView');
  const modalSuccess = document.getElementById('modalSuccess');
  const contactForm = document.getElementById('contactForm');
  const cfSubmit = document.getElementById('cfSubmit');
  const copyEmailBtn = document.getElementById('copyEmail');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Reset affichage
    modalFormView.style.display = 'block';
    modalSuccess.classList.remove('show');
    setTimeout(() => {
      const firstInput = document.getElementById('cf-name');
      if (firstInput) firstInput.focus();
    }, 350);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Ouverture : tous les boutons data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
      // Ferme le menu mobile si ouvert
      const navMobile = document.getElementById('navMobile');
      if (navMobile && navMobile.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  });

  // Fermeture : croix
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Fermeture : clic sur l'overlay
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Fermeture : touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Soumission du formulaire → construit un mailto avec toutes les infos
  // ==========================================================
  // CONFIGURATION FORMSPREE
  // Remplace YOUR_FORMSPREE_ENDPOINT par ton URL Formspree
  // Ex : https://formspree.io/f/xabcdefg
  // ==========================================================
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT';

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const company = document.getElementById('cf-company').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !email || !message) {
        return;
      }

      cfSubmit.disabled = true;
      cfSubmit.innerHTML = 'Envoi en cours...';

      // Vérifie si Formspree est configuré
      const isConfigured = !FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ENDPOINT');
      let success = false;

      if (isConfigured) {
        // Envoi réel via Formspree
        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              company: company || 'Non renseigné',
              message: message,
              _subject: 'Nouveau contact — Cohesif Commerce : ' + name
            })
          });

          if (response.ok) {
            success = true;
          }
        } catch (err) {
          console.error('Erreur envoi Formspree :', err);
        }
      }

      // Fallback : si Formspree n'est pas configuré ou a échoué, on ouvre le client mail
      if (!success) {
        const subject = 'Prise de rendez-vous — Cohesif Commerce';
        const body =
          'Bonjour,\n\n' +
          'Je souhaite réserver un appel avec votre équipe.\n\n' +
          '— Nom : ' + name + '\n' +
          '— Email : ' + email + '\n' +
          (company ? '— Entreprise : ' + company + '\n' : '') +
          '\nProjet :\n' + message + '\n\n' +
          'Cordialement,\n' + name;

        const mailtoUrl = 'mailto:cohesifcommerce@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);

        try {
          window.location.href = mailtoUrl;
        } catch (err) {
          // silencieux
        }
      }

      // Affiche l'écran de succès
      setTimeout(() => {
        modalFormView.style.display = 'none';
        modalSuccess.classList.add('show');
        contactForm.reset();
        cfSubmit.disabled = false;
        cfSubmit.innerHTML = 'Réserver mon appel <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }, 600);
    });
  }

  // Copie de l'email dans le presse-papier
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.copy;
      const copyLabel = copyEmailBtn.querySelector('.alt-copy');

      try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.classList.add('copied');
        if (copyLabel) copyLabel.textContent = 'Copié ✓';
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyLabel) copyLabel.textContent = 'Copier';
        }, 2000);
      } catch (err) {
        // Fallback : sélection manuelle si clipboard API échoue
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          copyEmailBtn.classList.add('copied');
          if (copyLabel) copyLabel.textContent = 'Copié ✓';
          setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            if (copyLabel) copyLabel.textContent = 'Copier';
          }, 2000);
        } catch (e) {
          // Dernier fallback : ouvre le mailto
          window.location.href = 'mailto:' + email;
        }
        document.body.removeChild(tempInput);
      }
    });
  }

  /* ==========================================================
     8. MODALE LÉGALE (Mentions, Confidentialité, CGV)
     ========================================================== */
  const legalModal = document.getElementById('legalModal');
  const legalClose = document.getElementById('legalClose');
  const legalSections = {
    mentions: document.getElementById('legal-mentions'),
    privacy: document.getElementById('legal-privacy'),
    cgv: document.getElementById('legal-cgv')
  };

  function openLegalModal(type) {
    // Cacher toutes les sections
    Object.values(legalSections).forEach(el => {
      if (el) el.style.display = 'none';
    });
    // Afficher la bonne section
    if (legalSections[type]) {
      legalSections[type].style.display = 'block';
      legalSections[type].scrollTop = 0;
    }
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Ouverture : tous les boutons data-open-legal
  document.querySelectorAll('[data-open-legal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.dataset.openLegal;
      openLegalModal(type);
    });
  });

  // Fermeture
  if (legalClose) legalClose.addEventListener('click', closeLegalModal);
  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegalModal();
    });
  }

  // Échap ferme la modale légale aussi
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && legalModal.classList.contains('open')) {
      closeLegalModal();
    }
  });
})();