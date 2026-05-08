/* ============================================================
   LUMORA — script.js
   Interações, animações e efeitos da landing page
   ============================================================ */

// ─── STARFIELD CANVAS ──────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 160;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed:   Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.twinkle += 0.02;
      const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 220, ${alpha})`;
      ctx.fill();

      // Slow drift
      s.y += s.speed * 0.1;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
})();

// ─── NAV SCROLL ────────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger (mobile)
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav__links');
  const navActions = document.querySelector('.nav__actions');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      if (navLinks)  navLinks.style.display  = open ? 'flex' : '';
      if (navActions) navActions.style.display = open ? 'flex' : '';
    });
  }
})();

// ─── COUNTER ANIMATION ──────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ─── SCROLL REVEAL ──────────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.pillar, .step, .plan, .perk, .edu-module, .cta-final__box'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

// ─── SMOOTH ANCHOR SCROLLING ────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// ─── PILLAR HOVER GLOW EFFECT ───────────────────────────────
(function initPillarGlow() {
  document.querySelectorAll('.pillar, .plan').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();

// ─── TECH BADGE HOVER PAUSE ─────────────────────────────────
(function initLogosPause() {
  const track = document.querySelector('.logos__track');
  if (!track) return;
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

// ─── EDUCATION XP BAR ANIMATION ─────────────────────────────
(function initXPBar() {
  const fill = document.querySelector('.xp-bar__fill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.style.animation = 'fillBar 1.8s ease both';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(fill);
})();

// ─── CONSOLE EASTER EGG ─────────────────────────────────────
console.log(
  '%cLumora 🌟',
  'font-size: 24px; font-weight: bold; color: #f0a030; font-family: Georgia, serif;'
);
console.log(
  '%cInteligência financeira completa. Quer fazer parte do time? hello@lumora.com.br',
  'color: #7a82a0; font-size: 13px;'
);