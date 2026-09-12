// ===== SCROLL ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.specialty, .service-section');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    animatedElements.forEach(el => observer.observe(el));
  }

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ===== MOBILE NAV TOGGLE (hamburger) =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('open')) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== LANGUAGE TOGGLE =====
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('site-lang');
  const browserLang = (navigator.language || navigator.languages[0] || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const initialLang = savedLang || browserLang;
  applyLanguage(initialLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      localStorage.setItem('site-lang', lang);
      applyLanguage(lang);
    });
  });

  function applyLanguage(lang) {
    langBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('[data-en]').forEach(el => {
      el.innerHTML = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    });
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
  }

  // ===== FORM SUBMIT: clear fields + redirect home =====
  document.querySelectorAll('form[data-ajax-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;

      let statusEl = form.querySelector('.form-status');
      if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.className = 'form-status';
        statusEl.style.cssText = 'text-align:center;margin-top:14px;font-size:14px;display:none;';
        btn.insertAdjacentElement('afterend', statusEl);
      }

      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        // Bot detected: show the SAME success message as a real submission
        // (never reveal the trap), reset the form, but do NOT actually send anything.
        form.reset();
        btn.textContent = '✓';
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.textContent = (document.documentElement.lang === 'fr')
          ? 'Message envoyé ! Redirection en cours...'
          : 'Message sent! Redirecting...';
        setTimeout(() => { window.location.href = '/merci.html'; }, 1500);
        return;
      }

      btn.disabled = true;
      btn.textContent = '...';

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          form.reset();
          btn.textContent = '✓';
          statusEl.style.display = 'block';
          statusEl.style.color = '#10b981';
          statusEl.textContent = (document.documentElement.lang === 'fr')
            ? "Message envoyé ! Un acompte de 30 à 50 % vous sera demandé pour démarrer l'audit, solde à la livraison. Redirection en cours..."
            : 'Message sent! A 30-50% deposit will be requested to start the audit, balance due on delivery. Redirecting...';
          setTimeout(() => { window.location.href = '/merci.html'; }, 2200);
        } else {
          const errData = await response.json().catch(() => ({}));
          btn.textContent = originalText;
          btn.disabled = false;
          statusEl.style.display = 'block';
          statusEl.style.color = '#dc2626';
          statusEl.textContent = (document.documentElement.lang === 'fr')
            ? 'Erreur lors de l\'envoi. Veuillez réessayer.'
            : 'Error sending message. Please try again.';
        }
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = (document.documentElement.lang === 'fr')
          ? 'Erreur réseau. Vérifiez votre connexion.'
          : 'Network error. Check your connection.';
      }
    });
  });

  // ===== PRE-FILL AUDIT TYPE FROM URL PARAM =====
  const urlParams = new URLSearchParams(window.location.search);
  const auditType = urlParams.get('type');
  if (auditType) {
    const select = document.getElementById('type_audit');
    if (select) {
      const typeMap = {
        'technique': 'Technique - $49',
        'onpage': 'On-page - $79',
        'offpage': 'Off-page - $79',
        'local': 'Local/GBP - $59',
        'aeo-geo': 'GEO/AEO - $59',
        'complet': 'Complet - $199'
      };
      const value = typeMap[auditType.toLowerCase()] || '';
      if (value) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  // ===== STICKY BOTTOM BAR DISMISS =====
  const stickyClose = document.querySelector('.sticky-bar-close');
  if (stickyClose) {
    stickyClose.addEventListener('click', () => {
      const bar = document.querySelector('.sticky-bottom-bar');
      if (bar) bar.style.display = 'none';
    });
  }
});
