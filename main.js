/* ============================================================
   POLAR NET — MAIN JS
   ============================================================ */

'use strict';

/* ── MOBILE NAV ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}


/* ── FEATURE SCROLL EXPLORER ── */
(function () {
  const outer = document.getElementById('featScrollOuter');
  const navItems = document.querySelectorAll('.feat-nav-item[data-idx]');
  const panels = document.querySelectorAll('.feat-panel[data-panel]');
  const PANEL_COUNT = 11;

  if (!outer || !navItems.length) return;

  function setActive(idx) {
    navItems.forEach(el => {
      el.classList.toggle('feat-nav-item--active', parseInt(el.dataset.idx) === idx);
    });
    panels.forEach(el => {
      el.classList.toggle('feat-panel--active', parseInt(el.dataset.panel) === idx);
    });
    document.querySelectorAll('.fmt-btn[data-idx]').forEach(btn => {
      btn.classList.toggle('fmt-btn--active', parseInt(btn.dataset.idx) === idx);
    });
  }

  function update() {
    const rect = outer.getBoundingClientRect();
    const navH = 76; // var(--nav-h)
    const scrolledInto = -(rect.top - navH);
    const scrollRange = rect.height - (window.innerHeight - navH);

    if (scrollRange <= 0) return;

    if (scrolledInto < 0) { setActive(0); return; }
    if (scrolledInto >= scrollRange) { setActive(PANEL_COUNT - 1); return; }

    const idx = Math.min(Math.floor((scrolledInto / scrollRange) * PANEL_COUNT), PANEL_COUNT - 1);
    setActive(idx);
  }

  // Click sidebar item → scroll to the middle of its slot (avoids floating-point boundary issues)
  navItems.forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx);
      if (idx < 0) return;
      const outerRect = outer.getBoundingClientRect();
      const navH = 76;
      const scrollRange = outer.offsetHeight - (window.innerHeight - navH);
      const targetScroll = window.scrollY + outerRect.top - navH + ((idx + 0.5) / PANEL_COUNT) * scrollRange;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Mobile tabs → directly activate panel (no scroll needed)
  const mobileTabs = document.querySelectorAll('.fmt-btn[data-idx]');
  mobileTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      setActive(idx);
      mobileTabs.forEach(b => b.classList.toggle('fmt-btn--active', parseInt(b.dataset.idx) === idx));
      // scroll the active tab into view
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  window.addEventListener('scroll', update, { passive: true });
  setActive(0); // start with Customers highlighted
  update();
})();

/* ── SCROLL REVEAL ── */
const revealTargets = [
  '.step',
  '.hero-content',
  '.hero-dashboard',
  '.pricing-coming-soon',
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  observer.observe(el);
});

/* ── SMOOTH SCROLL for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── NAV ACTIVE STATE ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
