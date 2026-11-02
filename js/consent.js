(function () {
  var GA_MEASUREMENT_ID = 'G-9WF0KPJ19F';
  var CONSENT_KEY = 'ga-consent';

  function store(action, value) {
    try {
      if (action === 'get') return localStorage.getItem(CONSENT_KEY);
      if (action === 'set') localStorage.setItem(CONSENT_KEY, value);
      if (action === 'del') localStorage.removeItem(CONSENT_KEY);
    } catch (e) {}
    return null;
  }

  function currentLang() {
    var l = document.documentElement.lang;
    return l === 'fr' || l === 'es' ? l : 'en';
  }

  var PRIVACY = {
    en: '/privacy-policy.html',
    fr: '/fr/politique-de-confidentialite.html',
    es: '/es/politica-de-privacidad.html'
  };

  var TEXTS = {
    en: {
      message: 'We use Google Analytics to understand how visitors use this site. Your data helps us improve it. See our',
      link: 'Privacy Policy', accept: 'Accept', decline: 'Decline', settings: 'Cookie settings'
    },
    es: {
      message: 'Usamos Google Analytics para entender cómo usan los visitantes este sitio. Tus datos nos ayudan a mejorarlo. Consulta nuestra',
      link: 'Política de privacidad', accept: 'Aceptar', decline: 'Rechazar', settings: 'Configuración de cookies'
    },
    fr: {
      message: "Nous utilisons Google Analytics pour comprendre comment les visiteurs utilisent ce site. Vos données nous aident à l'améliorer. Voir notre",
      link: 'Politique de confidentialité', accept: 'Accepter', decline: 'Refuser', settings: 'Paramètres des cookies'
    }
  };

  function clearGaCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid' || n.indexOf('_gat') === 0) {
        domains.forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function loadGA4() {
    if (window.__ga4Loaded) return;
    window.__ga4Loaded = true;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function removeBanner() {
    var el = document.getElementById('cookieConsent');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('cookieConsent')) return;
    var lang = currentLang();
    var t = TEXTS[lang];
    var banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.id = 'cookieConsent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(t.message + ' '));
    var a = document.createElement('a');
    a.href = PRIVACY[lang];
    a.textContent = t.link;
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    var actions = document.createElement('div');
    actions.className = 'cookie-consent-actions';
    var dec = document.createElement('button');
    dec.type = 'button'; dec.className = 'cookie-btn cookie-btn-decline'; dec.id = 'cookieDecline'; dec.textContent = t.decline;
    var acc = document.createElement('button');
    acc.type = 'button'; acc.className = 'cookie-btn cookie-btn-accept'; acc.id = 'cookieAccept'; acc.textContent = t.accept;
    actions.appendChild(dec); actions.appendChild(acc);
    banner.appendChild(p); banner.appendChild(actions);
    document.body.appendChild(banner);

    acc.addEventListener('click', function () {
      store('set', 'accepted');
      loadGA4();
      removeBanner();
    });
    dec.addEventListener('click', function () {
      store('set', 'declined');
      clearGaCookies();
      removeBanner();
    });
  }

  function addSettingsLink() {
    var holder = document.querySelector('.footer-links');
    if (!holder || document.getElementById('cookieSettings')) return;
    holder.appendChild(document.createTextNode(' · '));
    var a = document.createElement('a');
    a.href = '#';
    a.id = 'cookieSettings';
    a.textContent = TEXTS[currentLang()].settings;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      store('del');
      clearGaCookies();
      location.reload();
    });
    holder.appendChild(a);
  }

  document.addEventListener('DOMContentLoaded', function () {
    addSettingsLink();
    var consent = store('get');
    if (consent === 'accepted') {
      loadGA4();
    } else if (consent !== 'declined') {
      showBanner();
    }
  });
})();
