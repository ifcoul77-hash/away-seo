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
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) { form.reset(); return; }
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
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
          setTimeout(() => { window.location.href = '/'; }, 1500);
        } else {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
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
