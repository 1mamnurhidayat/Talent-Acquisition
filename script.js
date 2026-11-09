const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (menuButton && nav) menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = open ? '×' : '☰';
});
if (nav && menuButton) {
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); menuButton.textContent = '☰';
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); menuButton.textContent = '☰';
    }
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) {
      nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); menuButton.textContent = '☰';
    }
  });
}

const languagePicker = document.getElementById('language');
function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-en][data-id]').forEach(element => {
    const value = element.dataset[language];
    if (value) element.textContent = value;
  });
  languagePicker.value = language;
  document.title = language === 'id' ? 'Imam Nur Hidayat | Akuisisi Talenta' : 'Imam Nur Hidayat | Talent Acquisition';
}
languagePicker.addEventListener('change', event => setLanguage(event.target.value));

// English is the default language on every fresh page load.
setLanguage('en');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();


// Horizontal card carousels, operated by the arrow controls above each track.
document.querySelectorAll('[data-carousel][data-direction]').forEach(button => {
  button.addEventListener('click', () => {
    const track = document.getElementById(button.dataset.carousel);
    if (!track) return;
    const direction = button.dataset.direction === 'left' ? -1 : 1;
    const distance = Math.max(260, track.clientWidth * 0.82);
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  });
});
