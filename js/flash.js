(function () {
  var form = document.getElementById("flashForm");
  if (!form) return;
  var lang = document.documentElement.lang;
  var MSG = {
    en: "Please enter 3 URLs at most, one per line.",
    fr: "Veuillez saisir 3 URLs au maximum, une par ligne.",
    es: "Introduce como máximo 3 URLs, una por línea."
  };
  form.addEventListener("submit", function (e) {
    var v = this.elements["urls"].value.split(/[\s,;]+/).filter(Boolean);
    var old = this.querySelector(".flash-err");
    if (old) old.remove();
    if (v.length > 3) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var p = document.createElement("p");
      p.className = "flash-err";
      p.style.cssText = "color:#dc2626;font-size:14px;text-align:center;margin-top:12px;";
      p.textContent = MSG[lang] || MSG.en;
      this.querySelector(".btn-submit").insertAdjacentElement("afterend", p);
    }
  });
})();
