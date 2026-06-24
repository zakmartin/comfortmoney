/* Comfort Money – UI interakce (nav toggle, FAQ accordion). Čistý vanilla JS. */
(function () {
  'use strict';

  /* ---- mobilní navigace ---- */
  var nav = document.querySelector('.cm-nav');
  var burger = nav && nav.querySelector('.cm-nav__burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      burger.setAttribute('aria-expanded', String(!open));
    });
    // zavřít po kliknutí na odkaz v mobilním menu
    nav.querySelectorAll('.cm-nav__mobile a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- desktop dropdowny („Půjčky“, „O nás“) – hover je v CSS; JS pro dotyk + klávesnici ---- */
  document.querySelectorAll('.cm-nav__dd').forEach(function (dd) {
    var ddToggle = dd.querySelector('.cm-nav__dd-toggle');
    if (!ddToggle) return;
    var closeDd = function () { dd.setAttribute('data-open', 'false'); ddToggle.setAttribute('aria-expanded', 'false'); };
    // toggle odkazuje na stránku; rozbalení na hover/focus řeší CSS.
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDd(); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) closeDd(); });
    dd.querySelectorAll('.cm-nav__dd-item').forEach(function (a) { a.addEventListener('click', closeDd); });
  });

  /* ---- FAQ accordion (progresivní; funguje i bez JS přes <details>) ----
     Necháváme nativní <details>/<summary>, JS jen zavírá ostatní pro přehlednost. */
  var faq = document.querySelector('[data-faq]');
  if (faq) {
    var items = faq.querySelectorAll('details');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          items.forEach(function (o) { if (o !== d) o.open = false; });
        }
      });
    });
  }

  /* ---- plovoucí kontakt (FAB) ---- */
  var fab = document.getElementById('cmFab');
  var fabToggle = document.getElementById('cmFabToggle');
  var fabPanel = document.getElementById('cmFabPanel');
  var fabClose = document.getElementById('cmFabClose');
  function showFab() { if (fab) fab.hidden = false; }
  function setFabOpen(open) {
    if (!fabPanel || !fabToggle) return;
    fabPanel.hidden = !open;
    fabToggle.setAttribute('aria-expanded', String(open));
  }
  if (fab && fabToggle) {
    fabToggle.addEventListener('click', function () { setFabOpen(fabPanel.hidden); });
    if (fabClose) fabClose.addEventListener('click', function () { setFabOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setFabOpen(false); });
    document.addEventListener('click', function (e) { if (!fab.contains(e.target)) setFabOpen(false); });
  }

  /* ---- cookies lišta ----
     Ukládá volbu do localStorage. FAB ukážeme až po vyřízení lišty, ať se nepřekrývají. */
  var KEY = 'cm-cookie-consent';
  var bar = document.getElementById('cmCookies');
  function setConsent(val) {
    try { localStorage.setItem(KEY, val); } catch (e) { /* noop */ }
    if (bar) bar.hidden = true;
    showFab();
    // window.cmConsent = { analytics: val === 'accept' }; // místo pro budoucí analytiku
  }
  if (bar) {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* noop */ }
    if (!saved) { bar.hidden = false; } else { showFab(); }
    bar.querySelectorAll('[data-cookie]').forEach(function (btn) {
      btn.addEventListener('click', function () { setConsent(btn.getAttribute('data-cookie')); });
    });
  } else {
    showFab();
  }
  // tlačítko „Změnit nastavení cookies“ na stránce /cookies/
  document.querySelectorAll('[data-cookie="reset"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
      if (bar) bar.hidden = false;
    });
  });

  /* ---- tabová kalkulačka (přepínání produktů) ---- */
  document.querySelectorAll('.cm-calctabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.cm-calctabs__tab');
    var panels = tabs.querySelectorAll('.cm-calctabs__panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-tab');
        btns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', String(on));
        });
        panels.forEach(function (pn) { pn.hidden = pn.getAttribute('data-panel') !== t; });
        // změna textu hero podle vybraného tabu (jen je-li kalkulačka v heru)
        var hero = tabs.closest('.cm-hero');
        if (hero) {
          var ttl = hero.querySelector('.cm-hero__title');
          var kick = hero.querySelector('.cm-hero__kicker');
          var sub = hero.querySelector('.cm-hero__sub');
          if (ttl && btn.dataset.title) ttl.innerHTML = btn.dataset.title;
          if (kick && btn.dataset.kicker) kick.textContent = btn.dataset.kicker;
          if (sub && btn.dataset.sub) sub.textContent = btn.dataset.sub;
        }
      });
    });
  });

  /* ---- scroll-reveal (postupné odhalení prvků s [data-reveal]) ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            if (e.target.hasAttribute('data-celebrate')) { celebrate(e.target); }
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- decentní výtrysk konfet (jednorázově u prvku s [data-celebrate]) ---- */
  function celebrate(el) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var anchor = el.querySelector('.cm-step__num') || el;
    var colors = ['var(--cm-accent)', 'var(--cm-accent-d)', '#F8A05A'];
    var count = 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'cm-confetti';
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      var dist = 70 + Math.random() * 55;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--rot', Math.round(Math.random() * 220 - 110) + 'deg');
      p.style.setProperty('--p-color', colors[i % colors.length]);
      p.style.animationDelay = (Math.random() * 80) + 'ms';
      anchor.appendChild(p);
    }
    setTimeout(function () {
      var bits = anchor.querySelectorAll('.cm-confetti');
      for (var j = 0; j < bits.length; j++) { bits[j].remove(); }
    }, 2000);
  }
})();
