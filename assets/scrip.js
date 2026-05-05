const links = document.querySelectorAll('.topnav a');
const pages = document.querySelectorAll('.page');
const certCards = document.querySelectorAll('.cert-card');
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.querySelector('.close-btn');

function setActivePage(targetId) {
  pages.forEach(page => page.classList.remove('active'));
  const page = document.getElementById(targetId);
  if (page) page.classList.add('active');
}

function setActiveLink(activeLink) {
  links.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href').replace('#', '');
    setActivePage(targetId);
    setActiveLink(link);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

if (links.length > 0) {
  setActiveLink(links[0]);
}

function openModal(card) {
  modal.classList.add('active');
  modalImg.src = card.dataset.img || card.querySelector('img').src;
  modalTitle.textContent = card.dataset.title || card.querySelector('h3').textContent;
  modalDesc.textContent = card.dataset.desc || 'Click outside or the X to close.';
}

certCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

closeBtn?.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal?.addEventListener('click', event => {
  if (event.target === modal) {
    modal.classList.remove('active');
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    modal.classList.remove('active');
  }
});

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Check if EmailJS is loaded
  if (typeof emailjs === 'undefined') {
    alert('Email service not loaded. Please refresh the page.');
    return;
  }

  // Initialize EmailJS with your public key
  emailjs.init('YOUR_PUBLIC_KEY_HERE'); // Replace with your actual public key from EmailJS dashboard

  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: 'trixycabuang0426@gmail.com'
  };

  // Show loading
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  emailjs.send('service_t5cdh9q', 'template_4zgk4cy', templateParams)
    .then(function(response) {
      alert('Message sent successfully!');
      form.reset();
    }, function(error) {
      alert('Failed to send message. Please check your EmailJS setup or try again later.');
      console.error('EmailJS error:', error);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

window.handleFormSubmit = handleFormSubmit;

// PDF Export Function
document.getElementById('downloadResumeBtn')?.addEventListener('click', () => {
  if (typeof html2pdf === 'undefined') {
    alert('PDF library not loaded. Please refresh the page.');
    return;
  }
  const resumeElement = document.querySelector('.resume-container');
  if (!resumeElement) {
    alert('Resume content not found.');
    return;
  }
  const options = {
    margin: 0.5,
    filename: 'Trixy_Cabuang_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(options).from(resumeElement).save().catch(err => {
    console.error('PDF generation failed:', err);
    alert('Failed to generate PDF. Check console for details.');
  });
});