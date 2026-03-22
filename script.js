/**
 * Gushwork — Shared JavaScript
 * Features: sticky header, dropdown, carousel+zoom, FAQ, modals, mobile menu
 */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     UTILS
  ----------------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* -----------------------------------------------------------------------
     STICKY HEADER BAND + NAVBAR HIDE/SHOW
     Two distinct behaviours governed by scroll position:

     sticky-header (blue bar ABOVE navbar):
       - Invisible at the top (transform: translateY(-100%))
       - Slides down (visible) when user scrolls past the first fold
       - Hides again when scrolling back above the first fold
       - Pushes the navbar down by --sticky-h via .sticky-pushed class

     navbar scroll behaviour:
       - Stays visible at default position until first fold is passed
       - When past the fold and scrolling DOWN → hides (hidden-up)
       - When past the fold and scrolling UP   → reappears (scrolled-visible)
       - Uses requestAnimationFrame for 60fps smoothness
  ----------------------------------------------------------------------- */
  function initStickyHeader() {
    const navbar     = $('.navbar');
    const stickyBar  = $('#sticky-header');
    if (!navbar) return;

    let lastY    = window.scrollY;
    let ticking  = false;

    /**
     * First fold threshold: below this the sticky band never shows.
     * We use 80% of the viewport height so it kicks in just after the hero.
     */
    const firstFold = () => window.innerHeight * 0.8;

    /**
     * Show/hide the sticky-header band and shift the navbar.
     */
    function setStickyBar(show) {
      if (!stickyBar) return;
      if (show) {
        stickyBar.classList.add('visible');
        stickyBar.setAttribute('aria-hidden', 'false');
        navbar.classList.add('sticky-pushed');      // shift navbar down
      } else {
        stickyBar.classList.remove('visible');
        stickyBar.setAttribute('aria-hidden', 'true');
        navbar.classList.remove('sticky-pushed');   // restore navbar position
      }
    }

    function handleScroll() {
      const currentY    = window.scrollY;
      const scrolledDown = currentY > lastY;        // true = moving down
      const pastFold    = currentY > firstFold();   // true = below hero

      /* ------- sticky blue band ------- */
      // Show the band whenever we are past the first fold (scrolling either direction)
      setStickyBar(pastFold);

      /* ------- main navbar behaviour ------- */
      if (pastFold && scrolledDown) {
        // Scrolling DOWN past first fold → hide navbar
        navbar.classList.add('hidden-up');
        navbar.classList.remove('scrolled-visible');
      } else if (!scrolledDown && pastFold) {
        // Scrolling UP anywhere past first fold → restore navbar
        navbar.classList.remove('hidden-up');
        navbar.classList.add('scrolled-visible');
      } else if (currentY <= firstFold()) {
        // Back at top → reset navbar to default state
        navbar.classList.remove('hidden-up', 'scrolled-visible');
      }

      lastY   = currentY;
      ticking = false;
    }

    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load in case page is already scrolled (e.g. browser back)
    handleScroll();
  }

  /* -----------------------------------------------------------------------
     PRODUCTS DROPDOWN
  ----------------------------------------------------------------------- */
  function initDropdown() {
    const dropdowns = $$('.nav-dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = $('.nav-link', dropdown);
      let closeTimer = null;

      // Open on click (toggle)
      on(trigger, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('active');
        dropdowns.forEach(d => d.classList.remove('active'));
        if (!isOpen) dropdown.classList.add('active');
      });

      // Open immediately on hover
      on(dropdown, 'mouseenter', () => {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
        dropdown.classList.add('active');
      });

      // Close after short delay so user can move mouse to menu items
      on(dropdown, 'mouseleave', () => {
        closeTimer = setTimeout(() => {
          dropdown.classList.remove('active');
        }, 150);
      });
    });

    // Close on outside click
    on(document, 'click', () => {
      dropdowns.forEach(d => d.classList.remove('active'));
    });
  }

  /* -----------------------------------------------------------------------
     MOBILE MENU
  ----------------------------------------------------------------------- */
  function initMobileMenu() {
    const btn = $('.hamburger');
    const mobileNav = $('.mobile-nav');
    if (!btn || !mobileNav) return;

    on(btn, 'click', () => {
      btn.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    // close on link click
    $$('a', mobileNav).forEach(a => {
      on(a, 'click', () => {
        btn.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* -----------------------------------------------------------------------
     IMAGE CAROUSEL
  ----------------------------------------------------------------------- */
  function initCarousels() {
    $$('.carousel').forEach(carousel => {
      const track = $('.carousel__track', carousel);
      const slides = $$('.carousel__slide', carousel);
      if (!track || slides.length === 0) return;

      const wrapper = carousel.closest('.carousel-wrapper');
      const dots = wrapper ? $$('.carousel__dot', wrapper) : [];
      const thumbs = wrapper ? $$('.carousel__thumb', wrapper) : [];
      const btnPrev = wrapper ? $('.carousel__btn--prev', wrapper) : null;
      const btnNext = wrapper ? $('.carousel__btn--next', wrapper) : null;

      let current = 0;
      const total = slides.length;

      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;

        // Add .active to current slide so zoom can find it
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
      }

      on(btnPrev, 'click', () => goTo(current - 1));
      on(btnNext, 'click', () => goTo(current + 1));

      dots.forEach((dot, i) => on(dot, 'click', () => goTo(i)));
      thumbs.forEach((thumb, i) => on(thumb, 'click', () => goTo(i)));

      // keyboard nav when focused
      on(carousel, 'keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
      });

      // touch / swipe
      let startX = 0;
      on(carousel, 'touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      on(carousel, 'touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });

      goTo(0);
    });
  }

  /* -----------------------------------------------------------------------
     ZOOM ON HOVER
     Shows a fixed-position zoom panel near the cursor.
     The zoom panel mirrors the currently active carousel slide at 2× scale,
     panning the zoomed image as the cursor moves over the carousel.
  ----------------------------------------------------------------------- */
  function initZoom() {
    const carousel = document.querySelector('.carousel[data-zoom]');
    if (!carousel) return;

    const wrapper   = carousel.closest('.carousel-wrapper');
    if (!wrapper) return;

    const zoomPanel = wrapper.querySelector('.zoom-panel');
    const zoomImg   = zoomPanel && zoomPanel.querySelector('img');
    const lens      = wrapper.querySelector('.zoom-lens');
    if (!zoomPanel || !zoomImg || !lens) return;

    const LW = 150;
    const LH = 150;
    const ZOOM = 2.5;
    const PW = 420;
    const PH = 420;

    function getActiveSrc() {
      const a = carousel.querySelector('.carousel__slide.active img');
      if (a) return a.src;
      const f = carousel.querySelector('.carousel__slide img');
      return f ? f.src : '';
    }

    function updateZoomImg() {
      const src = getActiveSrc();
      if (src) {
        zoomImg.src = src;
        zoomImg.style.width  = (PW * ZOOM) + 'px';
        zoomImg.style.height = (PH * ZOOM) + 'px';
      }
    }

    carousel.addEventListener('mouseenter', () => {
      updateZoomImg();
      lens.style.width  = LW + 'px';
      lens.style.height = LH + 'px';
      lens.style.display = 'block';
      zoomPanel.classList.add('visible');
    });

    carousel.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
      zoomPanel.classList.remove('visible');
    });

    carousel.addEventListener('mousemove', (e) => {
      const cRect = carousel.getBoundingClientRect();
      const wRect = wrapper.getBoundingClientRect();

      // Cursor position relative to carousel
      let cx = e.clientX - cRect.left;
      let cy = e.clientY - cRect.top;

      // Lens position clamped inside carousel, but relative to wrapper
      let lx = cx - LW / 2;
      let ly = cy - LH / 2;
      lx = Math.max(0, Math.min(lx, cRect.width  - LW));
      ly = Math.max(0, Math.min(ly, cRect.height - LH));

      // Offset from wrapper top-left
      lens.style.left = (cRect.left - wRect.left + lx) + 'px';
      lens.style.top  = (cRect.top  - wRect.top  + ly) + 'px';

      // Zoom panel: fixed, to the right of carousel
      zoomPanel.style.left = (cRect.right + 16) + 'px';
      zoomPanel.style.top  = cRect.top + 'px';

      // Pan zoom image
      const iW = PW * ZOOM;
      const iH = PH * ZOOM;
      const rx = lx / Math.max(1, cRect.width  - LW);
      const ry = ly / Math.max(1, cRect.height - LH);
      zoomImg.style.left = -(rx * (iW - PW)) + 'px';
      zoomImg.style.top  = -(ry * (iH - PH)) + 'px';

      // Sync src
      updateZoomImg();
    });
  }

  /* -----------------------------------------------------------------------
     FAQ ACCORDION
  ----------------------------------------------------------------------- */
  function initFAQ() {
    $$('.faq-item').forEach(item => {
      const question = $('.faq-question', item);
      on(question, 'click', () => {
        const isOpen = item.classList.contains('open');
        // Close siblings in same list
        const list = item.closest('.faq-list');
        if (list) {
          $$('.faq-item', list).forEach(i => i.classList.remove('open'));
        }
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* -----------------------------------------------------------------------
     MODALS
  ----------------------------------------------------------------------- */
  function initModals() {
    // Generic open/close
    function openModal(id) {
      const backdrop = $(id);
      if (backdrop) {
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal(backdrop) {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Data-modal triggers
    $$('[data-modal]').forEach(trigger => {
      on(trigger, 'click', (e) => {
        e.preventDefault();
        openModal('#' + trigger.dataset.modal);
      });
    });

    // Close buttons
    $$('.modal-close').forEach(btn => {
      on(btn, 'click', () => {
        const backdrop = btn.closest('.modal-backdrop');
        if (backdrop) closeModal(backdrop);
      });
    });

    // Backdrop click close
    $$('.modal-backdrop').forEach(backdrop => {
      on(backdrop, 'click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });

    // ESC key close
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') {
        $$('.modal-backdrop.open').forEach(closeModal);
      }
    });
  }

  /* -----------------------------------------------------------------------
     INFO TABS (Product detail page)
  ----------------------------------------------------------------------- */
  function initInfoTabs() {
    const tabBars = $$('.info-tabs');
    tabBars.forEach(bar => {
      const tabs = $$('.info-tab', bar);
      tabs.forEach(tab => {
        on(tab, 'click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const targetId = tab.dataset.panel;
          const container = bar.nextElementSibling;
          if (container) {
            $$('.info-panel', container).forEach(p => p.classList.remove('active'));
            const panel = $('#' + targetId, container);
            if (panel) panel.classList.add('active');
          }
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     PROCESS TABS (Home page — Manufacturing Process section)
     Handles the row of pill-shaped .process-tab buttons. On click:
       1. Deactivate all tabs, activate the clicked one
       2. Hide all .process-panel elements, show the one matching
          the tab's data-process attribute
  ----------------------------------------------------------------------- */
  function initProcessTabs() {
    const tabs = $$('.process-tab');
    const panels = $$('.process-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
      on(tab, 'click', () => {
        // Deactivate all tabs
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        // Activate clicked tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Hide all panels, show target
        const targetId = tab.dataset.process;
        panels.forEach(p => p.classList.remove('active'));
        const target = $('#' + targetId);
        if (target) target.classList.add('active');
      });
    });
  }

  /* -----------------------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ----------------------------------------------------------------------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', (e) => {
        const target = $(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     FORM SUBMISSION (prevent default + show success)
  ----------------------------------------------------------------------- */
  function initForms() {
    $$('form[data-form]').forEach(form => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = '✓ Sent Successfully';
          btn.style.background = '#16a34a';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
            // close modal if inside one
            const modal = form.closest('.modal-backdrop');
            if (modal) {
              modal.classList.remove('open');
              document.body.style.overflow = '';
            }
          }, 2000);
        }, 1200);
      });
    });
  }

  /* -----------------------------------------------------------------------
     SCROLL REVEAL (simple fade-up on scroll)
  ----------------------------------------------------------------------- */
  function initScrollReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el, i) => {
      el.style.cssText += `
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s;
      `;
      el.classList.add('reveal-item');
      observer.observe(el);
    });

    // Add revealed class styles via JS
    const style = document.createElement('style');
    style.textContent = '.reveal-item.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

  /* -----------------------------------------------------------------------
     INIT ALL
  ----------------------------------------------------------------------- */
  function init() {
    initStickyHeader();
    initDropdown();
    initMobileMenu();
    initCarousels();
    initZoom();
    initFAQ();
    initModals();
    initInfoTabs();
    initProcessTabs();
    initSmoothScroll();
    initForms();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
