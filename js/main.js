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

  // ===== LANGUAGE =====
  // One URL per language: / (EN), /fr/ (FR), /es/ (ES). No text swapping, no auto-redirect.
  const PAGE_LANG = ['fr','es'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const T = (en, fr, es) => PAGE_LANG === 'fr' ? fr : (PAGE_LANG === 'es' ? es : en);

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
        // Something filled the hidden trap field (bot, or a browser autofill
        // mistake on a real visitor). Be honest: tell them to retry by typing
        // manually rather than falsely claiming success.
        btn.textContent = originalText;
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = T('The message could not be sent. Please fill in the form by typing each field manually (no autofill) and try again.', 'Le message n\u2019a pas pu être envoyé. Veuillez remplir le formulaire en tapant chaque champ manuellement (sans remplissage automatique) et réessayer.', "No se pudo enviar el mensaje. Rellena el formulario escribiendo cada campo manualmente (sin autocompletar) e inténtalo de nuevo.");
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
          statusEl.textContent = T('Message sent! Redirecting...', 'Message envoyé ! Redirection en cours...', "¡Mensaje enviado! Redirigiendo...");
          setTimeout(() => { window.location.href = T('/thank-you.html', '/fr/merci.html', '/es/gracias.html'); }, 1500);
        } else {
          const errData = await response.json().catch(() => ({}));
          btn.textContent = originalText;
          btn.disabled = false;
          statusEl.style.display = 'block';
          statusEl.style.color = '#dc2626';
          statusEl.textContent = T('Error sending message. Please try again.', 'Erreur lors de l\'envoi. Veuillez réessayer.', "Error al enviar el mensaje. Inténtalo de nuevo.");
        }
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = T('Network error. Check your connection.', 'Erreur réseau. Vérifiez votre connexion.', "Error de red. Comprueba tu conexión.");
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
