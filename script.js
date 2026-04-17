/* =============================================
   MELISSA HERRLE — Site Scripts
   ============================================= */

// --- Navbar: add .scrolled class when page scrolls ---
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- Active nav link highlight on scroll ---
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => observer.observe(s));

// --- Footer year ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Contact form: Formspree submission ---
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');
const submitBtn   = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formId = contactForm.dataset.formspreeId;
  const name   = document.getElementById('name').value.trim();

  if (!formId || formId === 'YOUR_FORM_ID') {
    formNote.textContent = 'Form not yet configured. Add your Formspree ID to get started.';
    formNote.style.color = 'var(--terracotta)';
    return;
  }

  // Show loading state
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';
  formNote.textContent  = '';

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method:  'POST',
      body:    new FormData(contactForm),
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      formNote.textContent = `Thanks, ${name}! I'll be in touch soon.`;
      formNote.style.color = 'var(--sage)';
      contactForm.reset();
      setTimeout(() => { formNote.textContent = ''; }, 8000);
    } else {
      const data = await response.json();
      const msg  = data.errors?.map(err => err.message).join(', ') || 'Something went wrong. Please try again.';
      formNote.textContent = msg;
      formNote.style.color = 'var(--terracotta)';
    }
  } catch {
    formNote.textContent = 'Network error. Please check your connection and try again.';
    formNote.style.color = 'var(--terracotta)';
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }
});

// --- Scroll-reveal animation ---
const revealEls = document.querySelectorAll(
  '.card, .blurb-card, .writing-item, .gallery-item, .stat-item, .writing-featured, .accomplishment-list li'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Add initial hidden state via JS (not CSS) so page works without JS
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {});

// Helper to apply revealed state
document.addEventListener('animationend', () => {}, { once: true });

// Reveal handler (applied via observer above)
function applyReveal(el) {
  el.style.opacity   = '1';
  el.style.transform = 'translateY(0)';
}

// Re-wire observer to call applyReveal
revealEls.forEach(el => {
  revealObserver.unobserve(el); // clear old observer
});

const finalObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        applyReveal(entry.target);
        finalObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

revealEls.forEach(el => finalObserver.observe(el));
