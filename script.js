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
  const requiredMessages = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter your phone number.',
    date: 'Please select your event date.',
    venue: 'Please provide your event location and venue name.',
    duration: 'Please select how long you need us for.',
    startTime: 'Please select a booth start time.',
    endTime: 'Please select a booth end time.',
    boothPlacement: 'Please choose whether the booth is inside or outside.',
    type: 'Please share your event type.',
    guests: 'Please provide your estimated guest count.',
  };

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const stepIndicator = form.querySelector('.current-step');
  let activeStep = 1;

  const setActiveStep = (stepNumber) => {
    activeStep = stepNumber;

    steps.forEach((stepElement) => {
      const isActive = Number(stepElement.dataset.step) === stepNumber;
      stepElement.classList.toggle('is-active', isActive);
      stepElement.setAttribute('aria-hidden', String(!isActive));
    });

    if (stepIndicator) {
      stepIndicator.textContent = String(stepNumber);
    }
  };

  const findErrorElement = (field) => {
    const describedBy = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    const errorId = describedBy.find((id) => id.endsWith('-error'));
    return errorId ? document.getElementById(errorId) : null;
  };

  const setFieldError = (field, message) => {
    const errorElement = findErrorElement(field);
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const validateField = (field) => {
    if (!(field instanceof HTMLElement)) {
      return true;
    }

    const value = (field.value || '').trim();
    let message = '';

    if (field.hasAttribute('required') && !value) {
      message = requiredMessages[field.name] || 'This field is required.';
    }

    if (!message && field.type === 'email' && value && !field.checkValidity()) {
      message = requiredMessages[field.name] || 'Please enter a valid email address.';
    }

    if (!message && field.name === 'guests' && value && Number(value) < 1) {
      message = 'Guest count must be at least 1.';
    }

    setFieldError(field, message);
    return !message;
  };

  const validateStep = (stepNumber) => {
    const stepElement = steps.find((element) => Number(element.dataset.step) === stepNumber);
    if (!stepElement) {
      return true;
    }

    const fields = stepElement.querySelectorAll('input, select, textarea');
    const invalidFields = [];

    fields.forEach((field) => {
      if (!validateField(field)) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return false;
    }

    return true;
  };

  const allFields = form.querySelectorAll('input, select, textarea');

  allFields.forEach((field) => {
    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });

    field.addEventListener('change', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  form.querySelectorAll('[data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextStep = Number(button.getAttribute('data-next-step'));
      if (validateStep(activeStep)) {
        setActiveStep(nextStep);
        const firstField = form.querySelector(`.form-step[data-step="${nextStep}"] input, .form-step[data-step="${nextStep}"] select, .form-step[data-step="${nextStep}"] textarea`);
        if (firstField instanceof HTMLElement) {
          firstField.focus();
        }
      }
    });
  });

  form.querySelectorAll('[data-prev-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const prevStep = Number(button.getAttribute('data-prev-step'));
      setActiveStep(prevStep);
      const firstField = form.querySelector(`.form-step[data-step="${prevStep}"] input, .form-step[data-step="${prevStep}"] select, .form-step[data-step="${prevStep}"] textarea`);
      if (firstField instanceof HTMLElement) {
        firstField.focus();
      }
    });
  });

  setActiveStep(1);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateStep(1)) {
      setActiveStep(1);
      return;
    }

    if (!validateStep(2)) {
      setActiveStep(2);
      return;
    }

    if (!validateStep(3)) {
      setActiveStep(3);
      return;
    }

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const date = (formData.get('date') || '').toString().trim();
    const venue = (formData.get('venue') || '').toString().trim();
    const duration = (formData.get('duration') || '').toString().trim();
    const startTime = (formData.get('startTime') || '').toString().trim();
    const endTime = (formData.get('endTime') || '').toString().trim();
    const boothPlacement = (formData.get('boothPlacement') || '').toString().trim();
    const theme = (formData.get('theme') || '').toString().trim();
    const type = (formData.get('type') || '').toString().trim();
    const guests = (formData.get('guests') || '').toString().trim();
    const details = (formData.get('details') || '').toString().trim();
    const referralSource = (formData.get('referralSource') || '').toString().trim();

    const subject = encodeURIComponent(`Booking inquiry from ${name || 'a new client'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent Date: ${date}\nVenue: ${venue}\nDuration: ${duration}\nBooth Start Time: ${startTime}\nBooth End Time: ${endTime}\nInside/Outside: ${boothPlacement}\nTheme/Color Scheme: ${theme || 'N/A'}\nEvent Type: ${type}\nEstimated Guest Count: ${guests}\nHow did you hear about us: ${referralSource || 'N/A'}\n\nAnything else we should know:\n${details || 'N/A'}`
    );

    window.location.href = `mailto:atlphotolounge@gmail.com?subject=${subject}&body=${body}`;

  });
}
