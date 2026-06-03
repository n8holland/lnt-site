const header = document.querySelector('.site-header');
const yearEl = document.getElementById('year');
const menuBtn = document.getElementById('nav-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
/* TEMP — theme preview for team review. Delete this block when a palette is chosen. */
const THEME_KEY = 'lnt-theme';
const VALID_THEMES = ['grunge', 'neon', 'brass'];
const themeInputs = document.querySelectorAll('.theme-switcher input[name="theme"]');

function isThemePreview() {
  return window.location.search.includes('preview-themes');
}

function getThemeFromUrl() {
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  return VALID_THEMES.includes(fromUrl) ? fromUrl : null;
}

function getStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return VALID_THEMES.includes(saved) ? saved : 'grunge';
}

function applyTheme(theme) {
  const next = VALID_THEMES.includes(theme) ? theme : 'grunge';
  if (next === 'grunge') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', next);
  }
  localStorage.setItem(THEME_KEY, next);
  themeInputs.forEach((input) => {
    input.checked = input.value === next;
  });
}

function initThemePreview() {
  if (!isThemePreview()) return;

  document.documentElement.setAttribute('data-theme-preview', '');

  const current = getThemeFromUrl() || getStoredTheme();
  applyTheme(current);

  themeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) applyTheme(input.value);
    });
  });
}

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

initThemePreview();
