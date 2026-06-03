const header = document.querySelector('.site-header');
const yearEl = document.getElementById('year');
const menuBtn = document.getElementById('nav-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

const BURGER_SETTLE_MS = 2400;
const mobileMq = window.matchMedia('(max-width: 768px)');
const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

function playBurgerSettleAnimation() {
  if (!menuBtn || menuBtn.getAttribute('aria-expanded') === 'true') return;
  if (!mobileMq.matches || reducedMotionMq.matches) {
    menuBtn.classList.remove('is-burger-settling');
    return;
  }

  menuBtn.classList.remove('is-burger-settling');
  void menuBtn.offsetWidth;
  menuBtn.classList.add('is-burger-settling');
  window.setTimeout(() => {
    menuBtn.classList.remove('is-burger-settling');
  }, BURGER_SETTLE_MS);
}

function setMobileNavOpen(open) {
  if (!menuBtn || !mobileNav || !header) return;
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  header.classList.toggle('is-menu-open', open);

  if (open) {
    menuBtn.classList.remove('is-burger-settling');
    mobileNav.removeAttribute('hidden');
  } else {
    menuBtn.classList.remove('is-burger-settling');
    mobileNav.setAttribute('hidden', '');
  }
}

function toggleMobileNav() {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  setMobileNavOpen(!isOpen);
}

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMobileNav();
  });

  mobileNav.querySelectorAll('.mobile-nav__link').forEach((link) => {
    link.addEventListener('click', () => setMobileNavOpen(false));
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileNavOpen(false);
});

if (menuBtn) {
  playBurgerSettleAnimation();
}
