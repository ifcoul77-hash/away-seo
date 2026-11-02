(function () {
  var l = document.documentElement.lang;
  var home = l === 'fr' ? '/fr/' : (l === 'es' ? '/es/' : '/');
  setTimeout(function () { window.location.href = home; }, 5000);
})();
