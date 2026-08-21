document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  toggle.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Smooth scroll offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+0-9()\s-]{6,20}$/;

  function setError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById('err-' + fieldId);
    var row = field.closest('.form-row') || field.closest('div');
    if (message) {
      if (errorEl) errorEl.textContent = message;
      if (row) row.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
    } else {
      if (errorEl) errorEl.textContent = '';
      if (row) row.classList.remove('error');
      field.removeAttribute('aria-invalid');
    }
  }

  function validateForm() {
    var valid = true;

    var ime = document.getElementById('ime');
    if (!ime.value.trim()) {
      setError('ime', 'Ве молиме внесете име и презиме.');
      valid = false;
    } else {
      setError('ime', '');
    }

    var telefon = document.getElementById('telefon');
    if (!telefon.value.trim()) {
      setError('telefon', 'Ве молиме внесете телефонски број.');
      valid = false;
    } else if (!PHONE_RE.test(telefon.value.trim())) {
      setError('telefon', 'Внесете валиден телефонски број.');
      valid = false;
    } else {
      setError('telefon', '');
    }

    var email = document.getElementById('email');
    if (!email.value.trim()) {
      setError('email', 'Ве молиме внесете е-пошта.');
      valid = false;
    } else if (!EMAIL_RE.test(email.value.trim())) {
      setError('email', 'Внесете валидна е-пошта.');
      valid = false;
    } else {
      setError('email', '');
    }

    var tip = document.getElementById('tip');
    if (!tip.value) {
      setError('tip', 'Ве молиме изберете тип на проценка.');
      valid = false;
    } else {
      setError('tip', '');
    }

    var poraka = document.getElementById('poraka');
    if (!poraka.value.trim()) {
      setError('poraka', 'Ве молиме внесете порака.');
      valid = false;
    } else if (poraka.value.trim().length < 10) {
      setError('poraka', 'Пораката треба да содржи барем 10 карактери.');
      valid = false;
    } else {
      setError('poraka', '');
    }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.classList.remove('success', 'error');

      if (!validateForm()) {
        status.textContent = 'Ве молиме исправете ги означените полиња.';
        status.classList.add('error');
        return;
      }

      var subject = 'Барање за проценка од ' + document.getElementById('ime').value.trim();
      var body = [
        'Име и презиме: ' + document.getElementById('ime').value.trim(),
        'Телефон: ' + document.getElementById('telefon').value.trim(),
        'E-mail: ' + document.getElementById('email').value.trim(),
        'Тип на проценка: ' + document.getElementById('tip').value,
        '',
        'Порака:',
        document.getElementById('poraka').value.trim()
      ].join('\n');

      window.location.href = 'mailto:jovandzimrevski@yahoo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', validateForm);
    });
  }

});