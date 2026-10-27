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
const scheduleBody = document.querySelector('.schedule-section tbody');
const daySchedules = {
  weekday: [['09:30','past'],['10:45','future'],['12:00','future'],['13:20','past'],['14:50','future'],['16:10','past']],
  holiday: [['09:00','past'],['10:00','future'],['11:00','past'],['12:00','future'],['13:00','past'],['14:00','future'],['15:00','past'],['16:30','future']],
};
function renderSchedule(day) {
  if (!scheduleBody || !daySchedules[day]) return;
  scheduleBody.replaceChildren(...daySchedules[day].map(([time,route]) => {
    const row = document.createElement('tr');
    row.dataset.route = route;
    const values = [time, route === 'past' ? '過去' : '未来', route === 'past' ? '第1桟橋' : '第2桟橋', '定刻'];
    values.forEach((value,index) => {
      const cell = document.createElement('td');
      const content = index === 0 ? document.createElement('b') : index === 3 ? document.createElement('span') : cell;
      content.textContent = value;
      if (index === 3) content.className = 'on-time';
      if (content !== cell) cell.append(content);
      row.append(cell);
    });
    return row;
  }));
}

routeButtons.forEach((button) => button.addEventListener('click', () => {
  routeButtons.forEach((item) => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-selected', String(item === button));
  });
  renderSchedule(button.dataset.schedule);
  document.querySelector('.schedule-section table')?.setAttribute('aria-label', button.textContent.trim() + 'の運航時刻表');
}));

const passwordForm = document.querySelector('#ticket-password-form');
const passwordInput = document.querySelector('#ticket-password');
const passwordError = document.querySelector('#password-error');
const ticketPassword = '思い出はたからもの';

const hintButton = document.querySelector('.hint-next');
const hintList = document.querySelector('#password-hints');
const passwordHints = [
  'サイトの冒頭にある「旅の思い出に」の文章を調べてみましょう。',
  '見つけた「宝箱」の文字をタップしてみましょう。',
  '「旅の記録」に鍵が現れています。鍵を近くの荷箱までドラッグしてみましょう。',
  '荷箱を開けて見つけたパスワードを、入力欄に入力してください。',
];
let shownHints = 0;
hintButton?.addEventListener('click', () => {
  if (!hintList || shownHints >= passwordHints.length) return;
  const hint = document.createElement('li');
  hint.textContent = passwordHints[shownHints++];
  hintList.hidden = false;
  hintList.append(hint);
  hintButton.setAttribute('aria-expanded', 'true');
  hintButton.textContent = shownHints === passwordHints.length ? 'すべてのヒントを表示しました' : '次のヒント';
  hintButton.disabled = shownHints === passwordHints.length;
});


const treasureKey = document.querySelector('.treasure-key');
const keyhole = document.querySelector('.treasure-chest');
const treasureMessage = document.querySelector('.treasure-message');
const passwordFoundDialog = document.querySelector('#password-found-dialog');
passwordFoundDialog?.querySelector('.password-found-close').addEventListener('click', () => passwordFoundDialog.close());
passwordFoundDialog?.querySelector('.password-found-next').addEventListener('click', () => {
  passwordFoundDialog.close();
  passwordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  passwordInput.focus({ preventScroll: true });
});
passwordFoundDialog?.addEventListener('close', () => {
  document.documentElement.classList.remove('password-dialog-open');
});

let keyPicked = false;
let treasureUnlocked = false;
let keyDrag = null;
document.querySelectorAll('.hidden-word').forEach((word) => {
  word.addEventListener('click', () => {
    if (treasureUnlocked) return;
    word.setAttribute('aria-pressed', 'true');
    if (word.dataset.word === 'treasure-chest') {
      treasureKey.hidden = false;
      const notice = document.querySelector('.word-discovery');
      if (notice) notice.hidden = false;
    }
  });
});

function unlockTreasure() {
  if (treasureUnlocked || !keyPicked) return;
  treasureUnlocked = true;
  treasureKey.hidden = true;
  keyhole.classList.add('is-unlocked', 'is-open');
  treasureMessage.textContent = 'パスワード：思い出はたからもの';
  if (passwordFoundDialog && !passwordFoundDialog.open) {
    passwordFoundDialog.showModal();
    document.documentElement.classList.add('password-dialog-open');
  }
}

treasureKey?.addEventListener('pointerdown', (event) => {
  if (treasureUnlocked || event.button !== 0) return;
  event.preventDefault();
  keyPicked = true;
  treasureKey.classList.add('is-picked');
  keyDrag = { x: event.clientX, y: event.clientY };
  treasureKey.setPointerCapture(event.pointerId);
});
treasureKey?.addEventListener('pointermove', (event) => {
  if (!keyDrag) return;
  treasureKey.style.transform = `translate(${event.clientX - keyDrag.x}px, ${event.clientY - keyDrag.y}px)`;
});
treasureKey?.addEventListener('pointerup', (event) => {
  if (!keyDrag) return;
  const hole = keyhole.getBoundingClientRect();
  const key = treasureKey.getBoundingClientRect();
  keyDrag = null;
  if (key.right >= hole.left && key.left <= hole.right && key.bottom >= hole.top && key.top <= hole.bottom) unlockTreasure();
  treasureKey.style.transform = '';
});
treasureKey?.addEventListener('pointercancel', () => {
  keyDrag = null;
  treasureKey.style.transform = '';
});
// Keyboard and tap alternative to dragging.
treasureKey?.addEventListener('click', () => {
  if (treasureUnlocked) return;
  keyPicked = true;
  treasureKey.classList.add('is-picked');
  treasureMessage.textContent = '';
});
keyhole?.addEventListener('click', unlockTreasure);

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
