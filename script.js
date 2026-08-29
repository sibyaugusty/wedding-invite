/* ═══════════════════════════════════════════════════════════
   WEDDING INVITATION — INTERACTIONS & ANIMATIONS
   GSAP + ScrollTrigger + Lenis
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Constants ─── */
  const WEDDING_DATE = new Date('2026-12-22T10:00:00+05:30');

  /* ─── DOM Cache ─── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const loader       = $('#loader');
  const mainContent  = $('#mainContent');
  const siteHeader   = $('#siteHeader');
  const menuToggle   = $('#menuToggle');
  const mainNav      = $('#mainNav');
  const navLinks     = $$('.site-header__nav a');
  const backToTopBtn = $('#backToTop');

  /* Phase 1 elements */
  const phase1 = $('#phase1');

  /* Hero Handwriting Name elements */
  const heroGroom = $('#heroGroom');
  const heroWeds  = $('#heroWeds');
  const heroBride = $('#heroBride');

  /* Countdown elements */
  const cdDays    = $('#cdDays');
  const cdHours   = $('#cdHours');
  const cdMinutes = $('#cdMinutes');
  const cdSeconds = $('#cdSeconds');

  /* ─── Scroll Locking (Disabled during page loading and intro sequence) ─── */
  function preventScroll(e) {
    e.preventDefault();
  }

  function preventScrollKeys(e) {
    const keys = ['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (keys.includes(e.code) || [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
  }

  function lockScroll() {
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    window.scrollTo(0, 0);
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys, { passive: false });
  }

  function unlockScroll() {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventScrollKeys);
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }

  // Lock scrolling immediately on script evaluation
  lockScroll();

  /* ═══════════════════════════════════════════════════════════
     1. CINEMATIC INTRO SEQUENCE (Calligraphy Handwriting Signature)
     ═══════════════════════════════════════════════════════════

     Phase 1 (0s–1.6s): Loader rings spin with "A & A" monogram
     Phase 2 (1.6s–4.5s): Rings fade out, loader dissolves,
                          "Adharsh" writes in signature calligraphy,
                          "weds" writes in golden script,
                          "Anekha" writes in signature calligraphy.
     Phase 3 (4.5s+):     Names stay permanently visible in Island Moments font;
                          Eyebrow, divider, subtitle, date badge, and
                          scroll cue glide into place around the names.
  */
  function runIntroSequence() {
    if (typeof gsap === 'undefined') {
      setTimeout(runIntroSequence, 100);
      return;
    }

    // Prepare main content behind loader
    mainContent.classList.add('is-visible');

    // Initial states: names hidden behind clip-path, secondary hero elements hidden
    gsap.set(['.hero__eyebrow', '.hero__divider', '.hero__subtitle', '.hero__date-badge', '.hero__scroll-cue'], {
      opacity: 0,
      y: 25
    });
    if (heroGroom && heroBride && heroWeds) {
      gsap.set([heroGroom, heroWeds, heroBride], {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 1
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        loader.classList.add('is-hidden');
        unlockScroll();
        window.scrollTo(0, 0);
        initScrollAnimations();
        initLenis();
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
      }
    });

    /* ── Phase 1: Wait for CSS ring + initials animations to play (1.6s) ── */
    tl.to({}, { duration: 1.6 });

    /* ── Phase 2: Calligraphy Handwriting Animation ── */

    /* 2a: Fade out Phase 1 rings & monogram */
    tl.to(phase1, {
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        phase1.style.display = 'none';
      }
    });

    /* 2b: Smoothly dissolve the dark loader overlay to reveal the landing background */
    tl.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.2');

    /* 2c: Smoothly write "Adharsh" in signature calligraphy */
    if (heroGroom) {
      tl.to(heroGroom, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.35,
        ease: 'power1.inOut'
      }, '-=0.4');
    }

    /* 2d: Smoothly write "weds" in gold signature script */
    if (heroWeds) {
      tl.to(heroWeds, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.75,
        ease: 'power1.inOut'
      }, '-=0.15');
    }

    /* 2e: Smoothly write "Anekha" in signature calligraphy */
    if (heroBride) {
      tl.to(heroBride, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.35,
        ease: 'power1.inOut'
      }, '-=0.1');
    }

    /* ── Phase 3: Seamless Flow into Landing Page (NAMES REMAIN 100% VISIBLE) ── */
    tl.to('.hero__eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    }, '+=0.1');

    tl.to('.hero__divider', {
      opacity: 0.75,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    }, '-=0.45');

    tl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    }, '-=0.4');

    tl.to(['.hero__date-badge', '.hero__scroll-cue'], {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'all'
    }, '-=0.35');
  }

  /* ═══════════════════════════════════════════════════════════
     2. LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════════════════ */
  let lenis;

  /* ── Header & Back to Top visibility on scroll ── */
  function updateHeaderVisibility(scrollY) {
    const y = typeof scrollY === 'number' ? scrollY : (window.scrollY || window.pageYOffset || 0);
    if (y > 60) {
      siteHeader.classList.add('is-visible');
    } else {
      if (!mainNav.classList.contains('is-open')) {
        siteHeader.classList.remove('is-visible');
      }
    }
  }

  function updateBackToTopVisibility(scrollY) {
    const y = typeof scrollY === 'number' ? scrollY : (window.scrollY || window.pageYOffset || 0);
    if (!backToTopBtn) return;
    if (y > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }

  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      updateHeaderVisibility(e.scroll);
      updateBackToTopVisibility(e.scroll);
    });

    window.addEventListener('scroll', () => {
      updateHeaderVisibility();
      updateBackToTopVisibility();
    }, { passive: true });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ═══════════════════════════════════════════════════════════
     3. GSAP + SCROLLTRIGGER ANIMATIONS
     ═══════════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Hero parallax ── */
    gsap.to('.hero__parallax-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Section reveals ── */
    setupSectionReveals();

    /* ── Details parallax ── */
    gsap.to('.details__bg-image', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.details',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Countdown parallax ── */
    gsap.to('.countdown__bg-image', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.countdown',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Timeline parallax ── */
    gsap.to('.timeline__bg-image', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Save the Date parallax ── */
    gsap.to('.save-date__bg', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.save-date',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Closing parallax ── */
    gsap.to('.closing__bg-image', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.closing',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

    /* ── Timeline line draw ── */
    gsap.fromTo('.timeline__line', {
      scaleY: 0,
      transformOrigin: 'top center',
    }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline__track',
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
      }
    });

    /* ── Gallery stagger ── */
    gsap.from('.gallery__item', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: {
        each: 0.1,
        from: 'random',
      },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.gallery__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    /* ── Details cards reveal ── */
    const detailCards = $$('.details__card');
    detailCards.forEach((card) => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      });
    });

    /* ── Family cards stagger ── */
    gsap.from('.family__member', {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.family__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    /* ── Timeline events stagger ── */
    gsap.from('.timeline__event', {
      x: (i, el) => el.classList.contains('timeline__event--left') ? -40 : 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: '.timeline__track',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    /* ── Closing section ── */
    gsap.from('.closing .reveal-item', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.closing',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    /* ── Initial header scroll check ── */
    updateHeaderVisibility();
  }

  /* ── Generic section reveal ── */
  function setupSectionReveals() {
    const sections = ['.story', '.venue', '.directions'];

    sections.forEach((sec) => {
      const revealGroups = $$(sec + ' .reveal-group');
      revealGroups.forEach((group) => {
        const items = $$('.reveal-item', group);
        if (!items.length) return;

        gsap.from(items, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 82%',
            toggleActions: 'play none none none',
          }
        });
      });

      const standaloneItems = $$(`${sec} > .reveal-item, ${sec} > * > .reveal-item:not(.reveal-group .reveal-item)`);
      standaloneItems.forEach((item) => {
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        });
      });
    });

    /* Save the Date */
    gsap.from('.save-date .reveal-item', {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.save-date__container', start: 'top 80%', toggleActions: 'play none none none' }
    });

    /* Countdown */
    gsap.from('.countdown .reveal-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '.countdown__container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    gsap.from('.countdown__unit', {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '.countdown__timer',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    /* Directions info cards */
    gsap.from('.directions__info-card', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.directions__info', start: 'top 82%', toggleActions: 'play none none none' }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     4. COUNTDOWN TIMER (Ultra-Smooth Rolling Digit Animation)
     ═══════════════════════════════════════════════════════════ */
  function updateAnimatedUnit(el, newVal) {
    if (!el) return;
    const currentVal = el.getAttribute('data-value');
    if (currentVal === newVal) return;

    el.setAttribute('data-value', newVal);

    // Initial load: render without animation
    if (!el.classList.contains('is-initialized')) {
      el.textContent = newVal;
      el.classList.add('is-initialized');
      return;
    }

    const oldText = currentVal || el.textContent;

    // Create sliding roll elements
    const oldDigit = document.createElement('span');
    oldDigit.className = 'countdown__digit-old';
    oldDigit.textContent = oldText;

    const newDigit = document.createElement('span');
    newDigit.className = 'countdown__digit-new';
    newDigit.textContent = newVal;

    el.innerHTML = '';
    el.appendChild(oldDigit);
    el.appendChild(newDigit);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(oldDigit, {
        y: '0%',
        opacity: 1
      }, {
        y: '-100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          oldDigit.remove();
        }
      });

      gsap.fromTo(newDigit, {
        y: '100%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          if (el.getAttribute('data-value') === newVal) {
            el.textContent = newVal;
          }
        }
      });
    } else {
      el.textContent = newVal;
    }
  }

  function updateCountdown() {
    const now = new Date();
    // Dynamic countdown target (December 22)
    let target = WEDDING_DATE;
    if (target - now <= 0) {
      target = new Date(now.getFullYear() + 1, 11, 22, 10, 0, 0);
    }
    const diff = Math.max(0, target - now);

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateAnimatedUnit(cdDays, String(days).padStart(3, '0'));
    updateAnimatedUnit(cdHours, String(hours).padStart(2, '0'));
    updateAnimatedUnit(cdMinutes, String(minutes).padStart(2, '0'));
    updateAnimatedUnit(cdSeconds, String(seconds).padStart(2, '0'));
  }

  function startCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ═══════════════════════════════════════════════════════════
     5. NAVIGATION
     ═══════════════════════════════════════════════════════════ */
  function setupNavigation() {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        siteHeader.classList.add('is-visible');
      } else {
        updateHeaderVisibility();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');

        if (lenis) {
          lenis.scrollTo(target, { offset: -72, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     6. ADD TO CALENDAR (.ics)
     ═══════════════════════════════════════════════════════════ */
  function setupCalendar() {
    const calBtn = $('#addToCalendar');
    if (!calBtn) return;

    calBtn.addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN',
        'BEGIN:VEVENT', 'DTSTART:20261222T043000Z', 'DTEND:20261222T173000Z',
        'SUMMARY:Adharsh & Anekha Wedding',
        'DESCRIPTION:You are invited to the wedding celebration of Adharsh & Anekha.',
        'LOCATION:[Venue Name], [City]', 'STATUS:CONFIRMED',
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-invitation.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     7. SHARE INVITATION
     ═══════════════════════════════════════════════════════════ */
  function setupShare() {
    const shareBtn = $('#shareInvitation');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Adharsh & Anekha Wedding Invitation',
        text: 'You are cordially invited to the wedding of Adharsh & Anekha on December 22, 2026!',
        url: window.location.href,
      };

      if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { /* cancelled */ }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          const originalHTML = shareBtn.innerHTML;
          shareBtn.innerHTML = shareBtn.innerHTML.replace('Share Invitation', 'Link Copied!');
          setTimeout(() => { shareBtn.innerHTML = originalHTML; }, 2000);
        } catch (err) { /* fallback */ }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     8. MAGNETIC HOVER EFFECT
     ═══════════════════════════════════════════════════════════ */
  function setupMagneticEffects() {
    $$('.btn--primary').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     9. BACK TO TOP (Smooth Scroll)
     ═══════════════════════════════════════════════════════════ */
  function setupBackToTop() {
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════ */
  function init() {
    /* Prevent browser from restoring scroll position midway down */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    lockScroll();

    startCountdown();
    setupNavigation();
    setupCalendar();
    setupShare();
    setupMagneticEffects();
    setupBackToTop();

    /* Run the cinematic intro (auto, no click needed) */
    runIntroSequence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
