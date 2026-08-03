/* ============================================================
   THRYVE GROWTH — Main Script
   ============================================================ */

// ── Nav scroll effect ────────────────────────────────────────
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}, { passive: true });


// ── Mobile hamburger menu ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const isOpen = navMobile.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});


// ── Case study tabs ──────────────────────────────────────────
const csTabs = document.querySelectorAll('.cs-tab');
const csPanels = document.querySelectorAll('.cs-panel');

csTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    csTabs.forEach(t => t.classList.remove('active'));
    csPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) panel.classList.add('active');
  });
});


// ── Intersection observer — fade-in-up animations ────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in-up to grid cards
const animateSelectors = [
  '.service-card',
  '.process-step',
  '.cs-card',
  '.ai-card',
  '.why-point',
  '.why-floating-card',
  '.stat',
  '.section-header',
];

animateSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in-up');
    fadeObserver.observe(el);
  });
});


// ── Contact form ─────────────────────────────────────────────
// Submissions are appended as rows to a Google Sheet via an Apps Script
// Web App endpoint. Deploy the script and paste its /exec URL below.
const SHEET_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const payload = {
      firstName: contactForm.firstName.value,
      lastName: contactForm.lastName.value,
      email: contactForm.email.value,
      brand: contactForm.brand.value,
      service: contactForm.services.value,
      message: contactForm.message.value,
    };

    const showSuccess = () => {
      contactForm.innerHTML = `
        <div class="form-success" style="display:flex; flex-direction:column; align-items:center; gap:16px; padding:48px 24px; text-align:center;">
          <div style="width:60px;height:60px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;">✓</div>
          <h3 style="font-size:22px;font-weight:700;color:#fff;">Enquiry Received!</h3>
          <p style="color:#a1a1b0;font-size:15px;max-width:320px;line-height:1.6;">Thanks for reaching out. We'll review your details and get back to you within 24 hours.</p>
        </div>
      `;
    };

    const showError = () => {
      btn.textContent = 'Send My Enquiry →';
      btn.disabled = false;
      alert("Something went wrong sending your enquiry. Please email us directly at Ops@thryvegrowth.com");
    };

    // Apps Script web apps don't handle CORS preflight, so this is sent as a
    // simple request (text/plain body) to avoid triggering an OPTIONS check.
    fetch(SHEET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        if (data.result === 'success') showSuccess();
        else throw new Error(data.error || 'Unknown error');
      })
      .catch(showError);
  });
}


// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ── Active nav link highlight on scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? '#fff' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));
