/**
 * CAPTURE — main.js
 */

/* ─── INTRO HALO ANIMATION ─── */
(function() {
  const overlay  = document.getElementById('introOverlay');
  const device   = document.getElementById('introDevice');
  const halos    = [
    document.getElementById('halo1'),
    document.getElementById('halo2'),
    document.getElementById('halo3'),
    document.getElementById('halo4'),
  ];

  // Phase 1 : device apparaît (0.4s)
  setTimeout(() => {
    device.style.transition = 'opacity .4s ease, transform .6s cubic-bezier(0.16,1,0.3,1)';
    device.style.opacity = '1';
    device.style.transform = 'scale(1)';
  }, 100);

  // Phase 2 : halos se déploient depuis le device
  halos.forEach((halo, i) => {
    const delay = 500 + i * 220;
    const finalSize = 260 + i * 200; // px
    setTimeout(() => {
      halo.style.transition = `opacity .3s ease, width 1.2s cubic-bezier(0.16,1,0.3,1), height 1.2s cubic-bezier(0.16,1,0.3,1)`;
      halo.style.opacity = (0.7 - i * 0.14).toString();
      halo.style.width  = finalSize + 'px';
      halo.style.height = finalSize + 'px';
    }, delay);

    // fade out halo
    setTimeout(() => {
      halo.style.transition += ', opacity .6s ease';
      halo.style.opacity = '0';
    }, delay + 900);
  });

  // Phase 3 : overlay disparaît, site révélé
  setTimeout(() => {
    overlay.style.transition = 'opacity .7s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.classList.add('hidden'), 700);
  }, 2200);
})();

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── BURGER MENU ─── */
const burger   = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
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
const slider    = document.getElementById('demoSlider');
const demoLabel = document.getElementById('demoLabel');
const demoRing1 = document.getElementById('demoRing1');
const demoRing2 = document.getElementById('demoRing2');
const demoRing3 = document.getElementById('demoRing3');
const modeBtns  = document.querySelectorAll('.demo__mode-btn');

function updateDemo(value) {
  const v = parseInt(value);
  demoLabel.textContent = `${v} m`;
  const ratio = v / 25;
  const r1 = Math.max(5,  ratio * 100 * 0.3);
  const r2 = Math.max(10, ratio * 100 * 0.55);
  const r3 = Math.max(20, ratio * 100 * 0.85);
  demoRing1.style.width  = `${r1}%`;
  demoRing1.style.height = `${r1}%`;
  demoRing2.style.width  = `${r2}%`;
  demoRing2.style.height = `${r2}%`;
  demoRing3.style.width  = `${r3}%`;
  demoRing3.style.height = `${r3}%`;
  const a1 = 0.08 + ratio * 0.22;
  const a2 = 0.05 + ratio * 0.15;
  const a3 = 0.03 + ratio * 0.1;
  demoRing1.style.background  = `rgba(0,102,255,${a1})`;
  demoRing1.style.borderColor = `rgba(0,102,255,${a1+0.1})`;
  demoRing2.style.borderColor = `rgba(0,102,255,${a2})`;
  demoRing3.style.borderColor = `rgba(0,102,255,${a3})`;
  modeBtns.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.value) === v));
}

slider.addEventListener('input', e => updateDemo(e.target.value));
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    slider.value = btn.dataset.value;
    updateDemo(btn.dataset.value);
    document.getElementById('orbValue').textContent = `${btn.dataset.value}m`;
  });
});
updateDemo(slider.value);

/* ─── DEVICE TILT ─── */
const productOrb = document.getElementById('productOrb');
if (productOrb) {
  productOrb.addEventListener('mousemove', e => {
    const rect = productOrb.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    productOrb.querySelector('.device__body').style.transform =
      `rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.02)`;
  });
  productOrb.addEventListener('mouseleave', () => {
    productOrb.querySelector('.device__body').style.transform = '';
  });
  productOrb.addEventListener('click', () => {
    const body = productOrb.querySelector('.device__body');
    body.classList.remove('activating');
    void body.offsetWidth;
    body.classList.add('activating');
    setTimeout(() => body.classList.remove('activating'), 700);
  });
}

/* ─── HERO RING PARALLAX ─── */
window.addEventListener('mousemove', e => {
  const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
  const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  document.querySelectorAll('.ring').forEach((ring, i) => {
    const f = (i + 1) * 5;
    ring.style.transform = `translate(calc(50% + ${dx * f}px), calc(-50% + ${dy * f}px))`;
  });
});

/* ─── SCROLL PROGRESS ─── */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total    = document.body.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
});

/* ─── SPEC STAGGER ─── */
const specItems = document.querySelectorAll('.spec-item');
const specObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
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
  item.style.transition = 'opacity .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1)';
  specObserver.observe(item);
});

/* ─── SMOOTH ANCHORS ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ─── PRICE COUNTER ─── */
const buyPrice = document.querySelector('.buy__price');
const priceObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    let start = null;
    const duration = 1200;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = Math.floor(ease * 189);
      buyPrice.innerHTML = `${v}<span>,99 €</span>`;
      if (p < 1) requestAnimationFrame(step);
      else buyPrice.innerHTML = `189<span>,99 €</span>`;
    }
    requestAnimationFrame(step);
    priceObserver.disconnect();
  }
}, { threshold: 0.5 });
if (buyPrice) priceObserver.observe(buyPrice);
