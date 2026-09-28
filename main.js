/* ===========================================================
   EMIL AMRIEV — Photographer Portfolio
   Shared site behaviour: mobile nav toggle, active link state
   =========================================================== */

(function () {
  'use strict';

  // Intro preloader: lock scrolling while the name is showing, then
  // release it and remove the overlay once the curtain has risen.
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    document.body.classList.add('is-loading');

    preloader.addEventListener('animationend', (event) => {
      if (event.animationName === 'preloader-rise') {
        document.body.classList.remove('is-loading');
        preloader.remove();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close the menu after choosing a destination.
      links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          links.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Mark the current page's nav link as active.
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav__links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('is-active');
      }
    });
  });
})();


// Contact modal: opens on any [data-modal-open="contact-modal"] trigger,
// closes on the × button, overlay click, or Escape key.
(function () {
  'use strict';

  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-modal-open="contact-modal"]');
  const closeTriggers = modal.querySelectorAll('[data-modal-close]');
  let lastFocused = null;

  function openModal(e) {
    e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  openTriggers.forEach((btn) => btn.addEventListener('click', openModal));
  closeTriggers.forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

// Back to top: smooth-scrolls to the top of the page on click.
(function () {
  'use strict';

  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  backToTop.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();