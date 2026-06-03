try {
  localStorage.removeItem('lnt-theme');
} catch (_) {
  /* ignore */
}

const header = document.querySelector('.site-header');
const yearEl = document.getElementById('year');
const menuBtn = document.getElementById('nav-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const logoLink = document.querySelector('.logo');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

// Last line delay (600ms) + plop duration (800ms) + small buffer
const BURGER_SETTLE_MS = 1550;
const compactMq = window.matchMedia(
  '(max-width: 768px), ((max-height: 520px) and (max-width: 920px))'
);
const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

function playBurgerSettleAnimation() {
  if (!menuBtn || menuBtn.getAttribute('aria-expanded') === 'true') return;
  if (!compactMq.matches || reducedMotionMq.matches) {
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

if (logoLink) {
  logoLink.addEventListener('click', (event) => {
    event.preventDefault();
    setMobileNavOpen(false);
    window.scrollTo({
      top: 0,
      behavior: reducedMotionMq.matches ? 'auto' : 'smooth',
    });
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  });
}

let neonLoopGeneration = 0;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function wrapLogoLetters() {
  if (!logoLink || logoLink.dataset.lettersWrapped === 'true') return;

  const text = logoLink.textContent;
  logoLink.textContent = '';

  for (const char of text) {
    if (char === ' ') {
      logoLink.appendChild(document.createTextNode(' '));
      continue;
    }

    const span = document.createElement('span');
    span.className = 'logo-letter';
    span.textContent = char;
    logoLink.appendChild(span);
  }

  logoLink.dataset.lettersWrapped = 'true';
}

function getLogoLetters() {
  return logoLink ? [...logoLink.querySelectorAll('.logo-letter')] : [];
}

function clearNeonLetterState(letter) {
  letter.classList.remove('is-neon-dead', 'is-neon-weak', 'is-neon-flash');
}

function resetAllLogoLetters() {
  getLogoLetters().forEach(clearNeonLetterState);
}

function pickNeonFlickerState() {
  const roll = Math.random();
  if (roll < 0.58) return 'dead';
  if (roll < 0.82) return 'weak';
  return 'flash';
}

function applyNeonLetterState(letter, state) {
  clearNeonLetterState(letter);
  if (state !== 'idle') {
    letter.classList.add(`is-neon-${state}`);
  }
}

function shouldPauseNeonLoop() {
  return Boolean(
    reducedMotionMq.matches
    || logoLink?.matches(':hover, :focus-visible')
  );
}

async function flickerPhase(letter, durationMs, minGapMs, maxGapMs, loopId) {
  const end = performance.now() + durationMs;

  while (performance.now() < end) {
    if (loopId !== neonLoopGeneration || shouldPauseNeonLoop()) {
      return false;
    }

    applyNeonLetterState(letter, pickNeonFlickerState());
    await sleep(randomBetween(minGapMs, maxGapMs));

    if (loopId !== neonLoopGeneration || shouldPauseNeonLoop()) {
      return false;
    }
  }

  return true;
}

function pickRandomLogoLetter(letters, avoid) {
  if (letters.length === 0) return null;
  if (letters.length === 1) return letters[0];

  let choice = letters[Math.floor(Math.random() * letters.length)];
  let attempts = 0;

  while (choice === avoid && attempts < 8) {
    choice = letters[Math.floor(Math.random() * letters.length)];
    attempts += 1;
  }

  return choice;
}

async function runLetterStruggle(letter, loopId) {
  clearNeonLetterState(letter);

  const fastDone = await flickerPhase(
    letter,
    randomBetween(700, 1100),
    40,
    95,
    loopId
  );
  if (!fastDone) return false;

  const slowDone = await flickerPhase(
    letter,
    randomBetween(1600, 2600),
    120,
    260,
    loopId
  );
  if (!slowDone) return false;

  clearNeonLetterState(letter);
  await sleep(randomBetween(2200, 3600));

  return loopId === neonLoopGeneration && !shouldPauseNeonLoop();
}

async function neonSignLoop() {
  const loopId = ++neonLoopGeneration;
  wrapLogoLetters();

  let lastLetter = null;

  while (loopId === neonLoopGeneration) {
    if (shouldPauseNeonLoop()) {
      resetAllLogoLetters();
      lastLetter = null;
      await sleep(280);
      continue;
    }

    const letters = getLogoLetters();
    if (letters.length === 0) return;

    await sleep(randomBetween(2400, 4200));
    if (loopId !== neonLoopGeneration || shouldPauseNeonLoop()) continue;

    const letter = pickRandomLogoLetter(letters, lastLetter);
    if (!letter) continue;

    lastLetter = letter;
    await runLetterStruggle(letter, loopId);
  }
}

if (logoLink) {
  wrapLogoLetters();
  neonSignLoop();

  reducedMotionMq.addEventListener('change', () => {
    neonLoopGeneration += 1;
    resetAllLogoLetters();

    if (!reducedMotionMq.matches) {
      neonSignLoop();
    }
  });
}
