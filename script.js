// Responsive navigation and subtle reveal-on-scroll interactions
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = window.IntersectionObserver
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
      }
    )
  : null;

if (revealObserver) {
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const form = document.querySelector('.booking-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const date = (formData.get('date') || '').toString().trim();
    const location = (formData.get('location') || '').toString().trim();
    const type = (formData.get('type') || '').toString().trim();
    const guests = (formData.get('guests') || '').toString().trim();
    const details = (formData.get('details') || '').toString().trim();

    const subject = encodeURIComponent(`Booking inquiry from ${name || 'a new client'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Date: ${date}\nLocation: ${location}\nEvent Type: ${type}\nEstimated Guest Count: ${guests}\n\nAdditional Details:\n${details}`
    );

    window.location.href = `mailto:info@thephotolounge.net?subject=${subject}&body=${body}`;

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.textContent = 'Request Submitted';
      button.disabled = true;
    }
  });
}
