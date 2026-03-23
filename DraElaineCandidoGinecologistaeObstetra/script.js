/* =============================================
   DRA. ELAINE CANDIDO — JAVASCRIPT
   ============================================= */

// ---- NAV: scroll state ----
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- NAV: mobile toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- REVEAL on scroll (IntersectionObserver) ----
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// ---- ACTIVE NAV LINK on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

// ---- SMOOTH SCROLL for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- VISUAL CARDS: subtle parallax on mouse move ----
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    document.querySelectorAll('.hero-blob-1').forEach(el => {
      el.style.transform = `translate(${dx * 18}px, ${dy * 18}px)`;
    });
    document.querySelectorAll('.hero-blob-2').forEach(el => {
      el.style.transform = `translate(${-dx * 12}px, ${-dy * 12}px)`;
    });
  });
}

// ---- COUNTER animation for stats ----
function animateCounter(el, target, duration = 1200) {
  const isText = isNaN(parseInt(target));
  if (isText) return; // skip non-numeric

  const num = parseInt(target.replace(/[^0-9]/g, ''));
  const prefix = target.match(/^\D+/)?.[0] || '';
  const suffix = target.replace(/^[\d+\s]+/, '');
  let start = null;

  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(ease * num);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };

  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target.querySelector('.stat-num');
        if (el && !el.dataset.animated) {
          el.dataset.animated = true;
          const original = el.textContent.trim();
          animateCounter(el, original);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat').forEach(s => statObserver.observe(s));
