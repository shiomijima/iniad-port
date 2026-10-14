const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  target.querySelectorAll('.scroll-reveal').forEach((element) => element.classList.add('is-visible'));
  window.history.pushState(null, '', link.getAttribute('href'));
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateNavigation();
}));

const routeButtons = document.querySelectorAll('.route-tabs button');
const departures = document.querySelectorAll('tbody tr');

routeButtons.forEach((button) => button.addEventListener('click', () => {
  routeButtons.forEach((item) => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-selected', String(item === button));
  });
  departures.forEach((row) => {
    row.hidden = button.dataset.route !== 'all' && row.dataset.route !== button.dataset.route;
  });
}));

const passwordForm = document.querySelector('#ticket-password-form');
const passwordInput = document.querySelector('#ticket-password');
const passwordError = document.querySelector('#password-error');
const ticketPassword = 'キーワード';

// Reveal selected secret text independently of the browser's selection colors.
const secretText = document.querySelector('.records-secret');
document.addEventListener('selectionchange', () => {
  if (!secretText) return;
  const selection = window.getSelection();
  let selected = false;
  if (selection && !selection.isCollapsed) {
    for (let index = 0; index < selection.rangeCount; index += 1) {
      if (selection.getRangeAt(index).intersectsNode(secretText)) {
        selected = true;
        break;
      }
    }
  }
  secretText.classList.toggle('is-selected', selected);
});

passwordForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const answer = passwordInput.value.trim().replace(/\s+/g, '').toUpperCase();

  if (answer === ticketPassword) {
    if (passwordForm.dataset.unlocking) return;
    passwordForm.dataset.unlocking = 'true';
    sessionStorage.setItem('iniad-ticket-unlocked', 'true');
    passwordForm.closest('.locked-card').classList.add('is-unlocked');
    passwordForm.querySelector('button').disabled = true;
    passwordError.textContent = 'パスワードを確認しました。';
    window.setTimeout(() => {
      window.location.href = './ticket-guide.html';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650);
    return;
  }

  passwordError.textContent = 'パスワードが違います。もう一度お確かめください。';
  passwordInput.setAttribute('aria-invalid', 'true');
  passwordInput.focus();
});

passwordInput?.addEventListener('input', () => {
  passwordInput.removeAttribute('aria-invalid');
  passwordError.textContent = '';
});

window.addEventListener('pageshow', () => {
  if (!passwordForm) return;
  delete passwordForm.dataset.unlocking;
  passwordForm.querySelector('button').disabled = false;
  passwordForm.closest('.locked-card').classList.remove('is-unlocked');
  passwordError.textContent = '';
});

// Escape also closes the navigation without leaving the page.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || mobileMenu.hidden) return;
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.focus();
});

function updateNavigation() {
  const hash = window.location.hash || '#top';
  document.querySelectorAll('.desktop-nav a').forEach((link) => {
    const active = link.getAttribute('href') === hash;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', updateNavigation);
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => window.requestAnimationFrame(updateNavigation)));
updateNavigation();

// Reveal each block once; the selectable secret is deliberately excluded.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.section-heading,.schedule-head,.boarding-steps li,.boarding-notes,.boarding-copy,.records-top,.records-text,.locked-card').forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('scroll-reveal');
    revealObserver.observe(element);
  });
}
