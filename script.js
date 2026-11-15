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
const currentLanguage = document.body.dataset.pageLanguage || 'en';
if (languagePicker) {
  languagePicker.value = currentLanguage;
  languagePicker.addEventListener('change', event => {
    const destination = event.target.value === 'id' ? 'indonesia.html' : 'index.html';
    window.location.assign(destination + window.location.hash);
  });
}

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


// Infinite Q&A carousel: transform animation plus direct finger/mouse dragging.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.qa-motion-window[data-auto-scroll="qa"]').forEach(viewport => {
    const track = viewport.querySelector('.qa-motion-track');
    const firstGroup = track?.querySelector('.qa-motion-group');
    if (!track || !firstGroup) return;

    const SPEED = 33; // pixels per second, slow but clearly visible
    let period = 1, offset = 0, lastFrame = 0;
    let dragging = false, startX = 0, lastX = 0, totalDrag = 0;
    let pauseUntil = 0, hover = false;

    function measure() {
      const newPeriod = firstGroup.getBoundingClientRect().width;
      if (newPeriod > 0) period = newPeriod;
      offset = ((offset % period) + period) % period;
      render();
    }
    function render() { track.style.transform = `translate3d(${-offset}px, 0, 0)`; }
    function move(distance) {
      offset = ((offset + distance) % period + period) % period;
      render();
    }
    function animate(now) {
      if (!lastFrame) lastFrame = now;
      const elapsed = Math.min((now - lastFrame) / 1000, .075);
      lastFrame = now;
      if (!reducedMotion.matches && !dragging && !hover && document.visibilityState === 'visible' && now >= pauseUntil) {
        move(SPEED * elapsed);
      }
      requestAnimationFrame(animate);
    }
    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = lastX = e.clientX; totalDrag = 0;
      viewport.classList.add('is-dragging');
      try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
    });
    viewport.addEventListener('pointermove', e => {
      if (!dragging) return;
      const delta = e.clientX - lastX;
      lastX = e.clientX;
      totalDrag = Math.max(totalDrag, Math.abs(e.clientX-startX));
      move(-delta);
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      pauseUntil = performance.now() + 1200;
    }
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);
    viewport.addEventListener('lostpointercapture', release);
    // Prevent an accidental navigation after a swipe, but preserve card clicks/taps.
    viewport.addEventListener('click', e => {
      if (totalDrag > 8) { e.preventDefault(); e.stopPropagation(); }
      totalDrag = 0;
    }, true);
    viewport.addEventListener('mouseenter', e => { if (e.pointerType !== 'touch') hover = true; });
    viewport.addEventListener('mouseleave', () => { hover = false; });
    viewport.addEventListener('focusin', () => { pauseUntil = performance.now() + 2000; });
    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); move(e.key === 'ArrowRight' ? 180 : -180);
        pauseUntil = performance.now() + 2200;
      }
    });
    window.addEventListener('resize', measure, {passive: true});
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(firstGroup);
    // Start without requiring the user to hover or interact.
    measure(); requestAnimationFrame(animate);
  });
})();

// v6 mobile frozen bars: keep the content clear of both bars as their heights change.
(() => {
  const header = document.querySelector('body > header.topbar');
  const footer = document.querySelector('body > footer.footer');
  if (!header || !footer) return;
  const mobile = window.matchMedia('(max-width: 700px)');
  const syncBarHeights = () => {
    if (!mobile.matches) return;
    const root = document.documentElement;
    root.style.setProperty('--mobile-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    root.style.setProperty('--mobile-footer-height', `${Math.ceil(footer.getBoundingClientRect().height)}px`);
  };
  syncBarHeights();
  window.addEventListener('resize', syncBarHeights, { passive:true });
  window.addEventListener('orientationchange', syncBarHeights, { passive:true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(syncBarHeights);
    observer.observe(header);
    observer.observe(footer);
  }
})();


// Final mobile viewport sync, applies to both scroll directions and browser UI changes.
(() => {
  const header = document.querySelector('body > header.topbar');
  const footer = document.querySelector('body > footer.footer');
  if (!header || !footer) return;
  const query = matchMedia('(max-width:700px)');
  let scheduled = false;
  function sync() {
    scheduled = false;
    if (!query.matches) return;
    const root = document.documentElement;
    root.style.setProperty('--ta-top', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    root.style.setProperty('--ta-bottom', `${Math.ceil(footer.getBoundingClientRect().height)}px`);
  }
  function queue() { if (!scheduled) {scheduled=true;requestAnimationFrame(sync);} }
  queue();
  window.addEventListener('resize',queue,{passive:true});
  window.addEventListener('orientationchange',queue,{passive:true});
  window.visualViewport?.addEventListener('resize',queue,{passive:true});
  if (window.ResizeObserver) { const ob=new ResizeObserver(queue);ob.observe(header);ob.observe(footer); }
})();
