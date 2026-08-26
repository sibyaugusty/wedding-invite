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

  /* Phase 1 elements */
  const phase1 = $('#phase1');

  /* Phase 2 elements */
  const phase2         = $('#phase2');
  const nameGroomFirst = $('#nameGroomFirst');
  const nameGroomRest  = $('#nameGroomRest');
  const nameWeds       = $('#nameWeds');
  const nameBrideFirst = $('#nameBrideFirst');
  const nameBrideRest  = $('#nameBrideRest');
  const nameDate       = $('#nameDate');

  /* Countdown elements */
  const cdDays    = $('#cdDays');
  const cdHours   = $('#cdHours');
  const cdMinutes = $('#cdMinutes');
  const cdSeconds = $('#cdSeconds');

  /* ═══════════════════════════════════════════════════════════
     1. CINEMATIC INTRO SEQUENCE (3-phase, auto-playing)
     ═══════════════════════════════════════════════════════════

     Phase 1 (0s–2.5s):   Loader rings spin, "A & A" initials inside the rings
     Phase 2 (2.5s–5.5s): Phase1 fades out → Phase2 fades in:
                           - First letters "A" appear (one above, one below)
                           - "Weds" fades in center
                           - Letters expand to full names
                           - Date fades in
     Phase 3 (5.5s–7s):   Bg fades to white, then loader hides, main content shows
  */
  function runIntroSequence() {
    if (typeof gsap === 'undefined') {
      setTimeout(runIntroSequence, 100);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        loader.classList.add('is-hidden');
        document.body.classList.remove('no-scroll');
        initScrollAnimations();
        initLenis();
      }
    });

    /* ── Phase 1: Wait for CSS ring + initials animations to play ── */
    tl.to({}, { duration: 2.2 });

    /* ── Phase 2: Crossfade from Phase1 to Phase2 ── */

    /* 2a: Fade out entire Phase 1 (rings + initials + tagline) */
    tl.to(phase1, {
      opacity: 0,
      scale: 0.85,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        phase1.style.display = 'none'; /* Remove from layout */
      }
    });

    /* 2b: Show Phase 2 container */
    tl.to(phase2, {
      opacity: 1,
      duration: 0.1,
      onStart: () => {
        phase2.style.pointerEvents = 'auto';
      }
    });

    /* 2c: Animate in the first letters "A" (groom) and "A" (bride) */
    tl.fromTo([nameGroomFirst, nameBrideFirst], {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.15
    });

    /* 2d: Fade in "Weds" in the center */
    tl.fromTo(nameWeds, {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.15');

    /* 2e: Expand the rest of the names — "dharsh" and "nekha" slide in */
    tl.to([nameGroomRest, nameBrideRest], {
      width: 'auto',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12
    }, '+=0.3');

    /* 2f: Fade in the date */
    tl.fromTo(nameDate, {
      opacity: 0,
      y: 15
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');

    /* ── Phase 3: Hold, then smoothly transition into main content ── */
    tl.to({}, { duration: 1.0 }); /* Hold on the names */

    /* 3a: Show main content behind */
    tl.call(() => {
      mainContent.classList.add('is-visible');
    });

    /* 3b: Fade out name-reveal content */
    tl.to(phase2, {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.2');

    /* 3c: Smoothly fade out the loader overlay into the hero section */
    tl.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.4');

    /* onComplete (from timeline config above) hides the loader completely */
  }

  /* ═══════════════════════════════════════════════════════════
     2. LENIS SMOOTH SCROLL
     ═══════════════════════════════════════════════════════════ */
  let lenis;

  /* ── Header visibility on scroll ── */
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
    });

    window.addEventListener('scroll', () => {
      updateHeaderVisibility();
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

    /* ── Hero content stagger reveal ── */
    gsap.from('.hero .reveal-item', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
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
      x: (i, el) => el.classList.contains('timeline__event--left') ? -60 : 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
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
     INITIALIZATION
     ═══════════════════════════════════════════════════════════ */
  function init() {
    document.body.classList.add('no-scroll');
    startCountdown();
    setupNavigation();
    setupCalendar();
    setupShare();
    setupMagneticEffects();

    /* Run the cinematic intro (auto, no click needed) */
    runIntroSequence();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
