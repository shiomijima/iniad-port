const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
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

passwordForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const answer = passwordInput.value.trim().replace(/\s+/g, '').toUpperCase();

  if (answer === ticketPassword) {
    sessionStorage.setItem('iniad-ticket-unlocked', 'true');
    window.location.href = './ticket-guide.html';
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
