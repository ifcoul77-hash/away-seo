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
});
