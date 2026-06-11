/**
 * CAPTURE — main.js
 * Nav scroll · Reveal on scroll · Demo slider · Orb interaction · Burger menu
 */

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── BURGER MENU ─── */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── REVEAL ON SCROLL ─── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

/* ─── DEMO SLIDER ─── */
const slider      = document.getElementById('demoSlider');
const demoLabel   = document.getElementById('demoLabel');
const demoRing1   = document.getElementById('demoRing1');
const demoRing2   = document.getElementById('demoRing2');
const demoRing3   = document.getElementById('demoRing3');
const modeBtns    = document.querySelectorAll('.demo__mode-btn');

function updateDemo(value) {
  const v = parseInt(value);
  demoLabel.textContent = `${v} m`;

  // Scale rings relative to max (25)
  const ratio = v / 25;
  const base = 100; // percent of parent

  const r1 = Math.max(5, ratio * base * 0.3);
  const r2 = Math.max(10, ratio * base * 0.55);
  const r3 = Math.max(20, ratio * base * 0.85);

  demoRing1.style.width  = `${r1}%`;
  demoRing1.style.height = `${r1}%`;
  demoRing2.style.width  = `${r2}%`;
  demoRing2.style.height = `${r2}%`;
  demoRing3.style.width  = `${r3}%`;
  demoRing3.style.height = `${r3}%`;

  // Intensity of ring color
  const alpha1 = 0.08 + ratio * 0.22;
  const alpha2 = 0.05 + ratio * 0.15;
  const alpha3 = 0.03 + ratio * 0.1;
  demoRing1.style.background   = `rgba(0, 102, 255, ${alpha1})`;
  demoRing1.style.borderColor  = `rgba(0, 102, 255, ${alpha1 + 0.1})`;
  demoRing2.style.borderColor  = `rgba(0, 102, 255, ${alpha2})`;
  demoRing3.style.borderColor  = `rgba(0, 102, 255, ${alpha3})`;

  // Update mode button active state
  modeBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.value) === v);
  });
}

slider.addEventListener('input', (e) => updateDemo(e.target.value));

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    slider.value = val;
    updateDemo(val);
  });
});

// Init
updateDemo(slider.value);

/* ─── ORB INTERACTIVE ─── */
const orbValue = document.getElementById('orbValue');
const productOrb = document.getElementById('productOrb');

// Sync orb value with demo slider
slider.addEventListener('input', (e) => {
  orbValue.textContent = `${e.target.value}m`;
});
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    orbValue.textContent = `${btn.dataset.value}m`;
  });
});

// Orb tilt on mouse
productOrb.addEventListener('mousemove', (e) => {
  const rect = productOrb.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  productOrb.querySelector('.orb__body').style.transform =
    `rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) scale(1.02)`;
});

productOrb.addEventListener('mouseleave', () => {
  productOrb.querySelector('.orb__body').style.transform = '';
});

/* ─── HERO RING PARALLAX ─── */
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  document.querySelectorAll('.ring').forEach((ring, i) => {
    const factor = (i + 1) * 5;
    ring.style.transform = `translate(calc(50% + ${dx * factor}px), calc(-50% + ${dy * factor}px))`;
  });
});

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─── SPEC ITEMS STAGGER ON ENTER ─── */
const specItems = document.querySelectorAll('.spec-item');

const specObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 60);
        specObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

specItems.forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateX(20px)';
  item.style.transition = 'opacity .5s var(--ease-out), transform .5s var(--ease-out)';
  specObserver.observe(item);
});

/* ─── SCROLL PROGRESS BAR ─── */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total    = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
});

/* ─── ORB CLICK ACTIVATE ─── */
if (productOrb) {
  productOrb.addEventListener('click', () => {
    const body = productOrb.querySelector('.orb__body');
    body.classList.remove('activating');
    void body.offsetWidth; // reflow to restart animation
    body.classList.add('activating');
    setTimeout(() => body.classList.remove('activating'), 700);
  });
}
const buyPrice = document.querySelector('.buy__price');

const priceObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animatePrice(0, 189.99, 1200);
      priceObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

if (buyPrice) priceObserver.observe(buyPrice);

function animatePrice(from, to, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = from + (to - from) * ease;
    buyPrice.innerHTML = `${current.toFixed(2)}<span>,99 €</span>`;
    // Fix the displayed value properly
    const int  = Math.floor(current);
    const frac = (current % 1).toFixed(2).slice(1);
    buyPrice.innerHTML = `${int}<span>${frac} €</span>`;
    if (progress < 1) requestAnimationFrame(update);
    else buyPrice.innerHTML = `189<span>,99 €</span>`;
  }
  requestAnimationFrame(update);
}
