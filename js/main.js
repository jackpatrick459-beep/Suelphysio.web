/* ==========================================================================
   SUEL PHYSIOTHERAPY — Site behavior
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
   var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navClose = document.getElementById('navClose');
    var navBackdrop = document.getElementById('navBackdrop');

    function openNav() {
      navLinks.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      if (navBackdrop) navBackdrop.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navBackdrop) navBackdrop.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        navLinks.classList.contains('is-open') ? closeNav() : openNav();
      });
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });
      if (navClose) navClose.addEventListener('click', closeNav);
      if (navBackdrop) navBackdrop.addEventListener('click', closeNav);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 480) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var accItems = document.querySelectorAll('.acc-item');
  accItems.forEach(function (item) {
    var trigger = item.querySelector('.acc-trigger');
    var panel = item.querySelector('.acc-panel');
    if (!trigger || !panel) return;

    // set initial state
    if (item.classList.contains('is-open')) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // close all
      accItems.forEach(function (other) {
        other.classList.remove('is-open');
        var otherTrigger = other.querySelector('.acc-trigger');
        var otherPanel = other.querySelector('.acc-panel');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.style.maxHeight = '0px';
      });

      // open clicked one if it wasn't already open
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Booking form -> WhatsApp handoff ---------- */
  var bookingForm = document.getElementById('bookingForm');
  var formStatus = document.getElementById('formStatus');
  var WHATSAPP_NUMBER = '254755921732'; // Airtel number, international format, no + or leading 0

  function setFieldError(fieldEl, hasError) {
    var wrapper = fieldEl.closest('.field');
    if (!wrapper) return;
    wrapper.classList.toggle('has-error', hasError);
  }

  function validatePhone(value) {
    var digits = value.replace(/[\s\-()]/g, '');
    return /^(\+?254|0)[17]\d{8}$/.test(digits);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('fullName');
      var phoneInput = document.getElementById('phone');
      var serviceInput = document.getElementById('service');
      var dateInput = document.getElementById('preferredDate');
      var messageInput = document.getElementById('message');

      var isValid = true;

      if (!nameInput.value.trim()) {
        setFieldError(nameInput, true);
        isValid = false;
      } else {
        setFieldError(nameInput, false);
      }

      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) {
        setFieldError(phoneInput, true);
        isValid = false;
      } else {
        setFieldError(phoneInput, false);
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in your name and a valid phone number.';
          formStatus.className = 'form-status is-visible error';
        }
        return;
      }

      var lines = [
        'New appointment request — Suel Physiotherapy website',
        '',
        'Name: ' + nameInput.value.trim(),
        'Phone: ' + phoneInput.value.trim(),
        'Service: ' + (serviceInput ? serviceInput.value : 'Not specified'),
        'Preferred date: ' + (dateInput && dateInput.value ? dateInput.value : 'Not specified'),
        'Details: ' + (messageInput && messageInput.value.trim() ? messageInput.value.trim() : 'None provided')
      ];

      var text = encodeURIComponent(lines.join('\n'));
      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

      if (formStatus) {
        formStatus.textContent = 'Opening WhatsApp with your request pre-filled — just hit send there to confirm.';
        formStatus.className = 'form-status is-visible success';
      }

      window.open(waUrl, '_blank', 'noopener');
      bookingForm.reset();
    });

    // clear error state as user types
    ['fullName', 'phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { setFieldError(el, false); });
      }
    });
  }
})();