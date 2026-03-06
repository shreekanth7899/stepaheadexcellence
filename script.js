/* ═══════════════════════════════════════════════
   StepAheadXcellence — script.js
   ═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   PAGE NAVIGATION
   Switch between "home" and "contact" pages
   without a full page reload.
────────────────────────────────────────────── */
function showPage(pageId, scrollTo) {
  // Hide all pages, show the target
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // Scroll to top of window
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav link highlight
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.remove('current');
    if (a.getAttribute('data-page') === pageId) a.classList.add('current');
  });

  // If a section anchor is provided, scroll to it after page switch
  if (scrollTo) {
    setTimeout(() => {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  // Re-initialise scroll animations for the newly visible page
  setTimeout(initObserver, 160);
}


/* ──────────────────────────────────────────────
   MOBILE MENU TOGGLE
────────────────────────────────────────────── */
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});


/* ──────────────────────────────────────────────
   SCROLL ANIMATIONS  (Intersection Observer)
   Elements with class .fade-up animate in as
   they enter the viewport.
────────────────────────────────────────────── */
function initObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // Stagger cards in the active page
  document.querySelectorAll('.page.active .fade-up:not(.visible)').forEach((el, i) => {
    el.dataset.delay = (i % 6) * 80;
    obs.observe(el);
  });
}

// Run on first load
document.addEventListener('DOMContentLoaded', initObserver);


/* ──────────────────────────────────────────────
   FORMSPREE CONTACT FORM SUBMISSION
   Submits asynchronously, shows success state.

   SETUP:
   1. Go to https://formspree.io → sign up / log in
   2. Create a new form
   3. Set destination email to:
      shreekanth.sharma@stepaheadxcellence.com
   4. Copy your form ID (e.g. xpzgkdqr)
   5. In index.html, replace YOUR_FORM_ID in the
      form's action attribute with your real ID.
────────────────────────────────────────────── */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const inner   = document.getElementById('contactFormInner');

  // Show loading state
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const data = new FormData(form);
    const res  = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      // Show success message
      inner.style.display   = 'none';
      success.style.display = 'block';
      form.reset();
    } else {
      // Show Formspree error detail if available
      const json = await res.json().catch(() => ({}));
      const msg  = (json.errors || []).map(err => err.message).join(', ')
                   || 'Something went wrong. Please try again.';
      showFormError(msg, btn);
    }

  } catch (err) {
    showFormError(
      'Network error. Please try again or email us directly at shreekanth.sharma@stepaheadxcellence.com',
      btn
    );
  }
}

function showFormError(message, btn) {
  alert('⚠️ ' + message);
  btn.textContent = 'Send Message →';
  btn.disabled = false;
}
