/* ===========================================================
   EMIL AMRIEV — Photographer Portfolio
   Carousel behaviour:
   - desktop: continuous slow left-scroll, pauses + enlarges on hover,
     reveals a caption beneath the hovered photo
   - mobile: keeps spinning on its own; tapping a photo pauses the
     spin, highlights that photo and reveals its caption; tapping
     again (or tapping elsewhere) hides the caption and resumes
   =========================================================== */

(function () {
  'use strict';

  function initCarousel(root) {
    const track = root.querySelector('.carousel__track');
    if (!track) return;

    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    // Duplicate the set once so the marquee can loop seamlessly.
    originalItems.forEach((item) => {
      track.appendChild(item.cloneNode(true));
    });

    const isCoarsePointer = window.matchMedia('(hover: none)').matches;

    function measureAndSetLoop() {
      // Width of one full, un-duplicated set of items (+ the gaps between them).
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      let setWidth = 0;
      originalItems.forEach((item, i) => {
        setWidth += item.getBoundingClientRect().width;
        if (i > 0) setWidth += gap;
      });
      root.style.setProperty('--carousel-set-width', setWidth + 'px');
    }

    measureAndSetLoop();
    window.addEventListener('resize', measureAndSetLoop);

    const allItems = Array.from(track.children);

    if (!isCoarsePointer) {
      /* ---------- Desktop / mouse behaviour ---------- */
      allItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          track.classList.add('is-paused');
          item.classList.add('is-hovered');
        });
        item.addEventListener('mouseleave', () => {
          item.classList.remove('is-hovered');
          track.classList.remove('is-paused');
        });
      });

      // Pausing on focus too, for keyboard users tabbing through captions.
      allItems.forEach((item) => {
        const img = item.querySelector('img');
        if (!img) return;
        img.setAttribute('tabindex', '0');
        img.addEventListener('focus', () => {
          track.classList.add('is-paused');
          item.classList.add('is-hovered');
        });
        img.addEventListener('blur', () => {
          item.classList.remove('is-hovered');
          track.classList.remove('is-paused');
        });
      });
    } else {
      /* ---------- Touch / mobile behaviour ----------
         The strip keeps auto-scrolling, just like on desktop.
         Tapping a photo pauses the spin and reveals its caption;
         tapping it again (or tapping any other photo) hides the
         caption and lets the strip continue spinning. */
      let openItem = null;

      function closeOpenItem() {
        if (openItem) {
          openItem.classList.remove('is-tapped');
          openItem = null;
        }
        track.classList.remove('is-paused');
      }

      function openItemFn(item) {
        if (openItem && openItem !== item) {
          openItem.classList.remove('is-tapped');
        }
        item.classList.add('is-tapped');
        openItem = item;
        track.classList.add('is-paused');
      }

      allItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          if (item.classList.contains('is-tapped')) {
            closeOpenItem();
          } else {
            openItemFn(item);
          }
        });
      });

      // Tapping outside any photo (elsewhere on the page) closes the caption too.
      document.addEventListener('click', (e) => {
        if (openItem && !openItem.contains(e.target)) {
          closeOpenItem();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(initCarousel);
  });
})();