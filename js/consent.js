(function () {
  const GA_MEASUREMENT_ID = 'G-9WF0KPJ19F';
  const CONSENT_KEY = 'ga-consent';

  function currentLang() {
    const saved = localStorage.getItem('site-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    return navigator.language && navigator.language.startsWith('fr') ? 'fr' : 'en';
  }

  function loadGA4() {
    if (window.__ga4Loaded) return;
    window.__ga4Loaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function removeBanner() {
    const el = document.getElementById('cookieConsent');
    if (el) el.remove();
  }

  function showBanner() {
    const lang = currentLang();
    const texts = {
      en: {
        message: 'We use Google Analytics to understand how visitors use this site. Your data helps us improve it. See our',
        link: 'Privacy Policy',
        accept: 'Accept',
        decline: 'Decline'
      },
      fr: {
        message: "Nous utilisons Google Analytics pour comprendre comment les visiteurs utilisent ce site. Vos données nous aident à l'améliorer. Voir notre",
        link: 'Politique de confidentialité',
        accept: 'Accepter',
        decline: 'Refuser'
      }
    };
    const t = texts[lang];
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.id = 'cookieConsent';
    banner.innerHTML =
      '<p>' + t.message + ' <a href="/politique-de-confidentialite.html">' + t.link + '</a>.</p>' +
      '<div class="cookie-consent-actions">' +
        '<button type="button" class="cookie-btn cookie-btn-decline" id="cookieDecline">' + t.decline + '</button>' +
        '<button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept">' + t.accept + '</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      loadGA4();
      removeBanner();
    });
    document.getElementById('cookieDecline').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      removeBanner();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGA4();
    } else if (consent !== 'declined') {
      showBanner();
    }
  });
})();
