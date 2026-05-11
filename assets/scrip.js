const links = document.querySelectorAll('#nav-menu a');
const pages = document.querySelectorAll('.page');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
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
    
    // Close mobile menu after navigation
    if (window.innerWidth <= 768) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});

// Hamburger menu toggle
hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
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

// Gallery items now always visible - toggle functionality removed

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const successDiv = document.querySelector('[data-fs-success]');
const errorDiv = document.querySelector('[data-fs-error]');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const submitBtn = contactForm.querySelector('[data-fs-submit-btn]');
  const originalText = submitBtn.textContent;

  // Hide previous messages
  if (successDiv) successDiv.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch('https://formspree.io/f/xeenglpp', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success
      if (successDiv) {
        successDiv.textContent = 'Message sent successfully!';
        successDiv.style.display = 'block';
      }
      contactForm.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // Error
    if (errorDiv) {
      errorDiv.textContent = 'Failed to send message. Please try again.';
      errorDiv.style.display = 'block';
    }
  } finally {
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

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

  // Clone the resume element for PDF generation
  const pdfResume = resumeElement.cloneNode(true);

  // Apply PDF-specific styling by modifying the cloned element
  pdfResume.style.cssText = `
    background: white !important;
    color: black !important;
    font-family: Calibri, 'Segoe UI', Arial, sans-serif !important;
    line-height: 1.3 !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 10px !important;
    display: block !important;
    width: 100% !important;
    position: relative !important;
  `;

  // Convert two-column layout to single column
  const leftSide = pdfResume.querySelector('.resume-left');
  const rightSide = pdfResume.querySelector('.resume-right');

  if (leftSide && rightSide) {
    // Make both sides full width and stack them for 2-page layout
    leftSide.style.cssText = `
      width: 100% !important;
      float: none !important;
      display: block !important;
      margin-bottom: 15px !important;
      padding: 12px !important;
      background: white !important;
      color: black !important;
      border: none !important;
      border-bottom: 2px solid #333 !important;
      page-break-inside: avoid !important;
    `;

    rightSide.style.cssText = `
      width: 100% !important;
      float: none !important;
      display: block !important;
      background: white !important;
      color: black !important;
      padding: 12px !important;
      border: none !important;
    `;

    // Force all text to black and backgrounds to white
    const allElements = pdfResume.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.setProperty('color', 'black', 'important');
      el.style.setProperty('background-color', 'white', 'important');
      el.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
      el.style.setProperty('color-adjust', 'exact', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('padding', '0', 'important');
      el.style.setProperty('border', 'none', 'important');

      if (el.tagName === 'IMG') {
        el.style.setProperty('border', '2px solid #333', 'important');
        el.style.setProperty('margin', '5px 0', 'important');
      }
    });

    // Style specific elements for PDF
    const headings = pdfResume.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(h => {
      h.style.setProperty('color', 'black', 'important');
      h.style.setProperty('font-weight', 'bold', 'important');
      h.style.setProperty('background-color', 'white', 'important');
      h.style.setProperty('margin', '8px 0 4px 0', 'important');
      h.style.setProperty('padding', '0', 'important');
    });

    // Style profile section
    const profile = pdfResume.querySelector('.profile');
    if (profile) {
      profile.style.setProperty('text-align', 'center', 'important');
      profile.style.setProperty('margin-bottom', '12px', 'important');
      profile.style.setProperty('background-color', 'white', 'important');
      profile.style.setProperty('page-break-inside', 'avoid', 'important');
    }

    const profileImg = pdfResume.querySelector('.profile img');
    if (profileImg) {
      profileImg.style.setProperty('width', '100px', 'important');
      profileImg.style.setProperty('height', '100px', 'important');
      profileImg.style.setProperty('border-radius', '50%', 'important');
      profileImg.style.setProperty('border', '2px solid #333', 'important');
      profileImg.style.setProperty('background-color', 'white', 'important');
      profileImg.style.setProperty('margin', '0 auto 8px', 'important');
    }

    // Style resume blocks
    const blocks = pdfResume.querySelectorAll('.resume-block, .resume-section');
    blocks.forEach(block => {
      block.style.setProperty('margin-bottom', '8px', 'important');
      block.style.setProperty('background-color', 'white', 'important');
      block.style.setProperty('color', 'black', 'important');
      block.style.setProperty('padding-bottom', '8px', 'important');
      block.style.setProperty('border-bottom', '1px solid #eee', 'important');
      block.style.setProperty('page-break-inside', 'avoid', 'important');
    });

    const blockHeadings = pdfResume.querySelectorAll('.resume-block h3, .resume-section h3');
    blockHeadings.forEach(h => {
      h.style.setProperty('font-size', '13px', 'important');
      h.style.setProperty('color', 'black', 'important');
      h.style.setProperty('border-bottom', 'none', 'important');
      h.style.setProperty('padding-bottom', '0', 'important');
      h.style.setProperty('margin-bottom', '4px', 'important');
      h.style.setProperty('font-weight', 'bold', 'important');
      h.style.setProperty('background-color', 'white', 'important');
    });

    // Style timeline items
    const timelineItems = pdfResume.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.style.setProperty('background', 'white', 'important');
      item.style.setProperty('border', 'none', 'important');
      item.style.setProperty('border-left', '3px solid #333', 'important');
      item.style.setProperty('padding', '6px 0 6px 10px', 'important');
      item.style.setProperty('margin-bottom', '6px', 'important');
      item.style.setProperty('color', 'black', 'important');
    });

    // Style lists
    const lists = pdfResume.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.style.setProperty('margin', '3px 0', 'important');
      list.style.setProperty('padding-left', '15px', 'important');
      list.style.setProperty('background-color', 'white', 'important');
      list.style.setProperty('color', 'black', 'important');
    });

    const listItems = pdfResume.querySelectorAll('li');
    listItems.forEach(li => {
      li.style.setProperty('font-size', '11px', 'important');
      li.style.setProperty('line-height', '1.2', 'important');
      li.style.setProperty('margin-bottom', '1px', 'important');
      li.style.setProperty('color', 'black', 'important');
      li.style.setProperty('background-color', 'white', 'important');
    });

    // Style paragraphs
    const paragraphs = pdfResume.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.setProperty('font-size', '11px', 'important');
      p.style.setProperty('line-height', '1.3', 'important');
      p.style.setProperty('margin', '2px 0', 'important');
      p.style.setProperty('color', 'black', 'important');
      p.style.setProperty('background-color', 'white', 'important');
    });

    // Style spans
    const spans = pdfResume.querySelectorAll('span');
    spans.forEach(span => {
      span.style.setProperty('font-size', '10px', 'important');
      span.style.setProperty('color', '#333', 'important');
      span.style.setProperty('background-color', 'white', 'important');
    });
  }

  // Hide the download button in the PDF
  const downloadBtn = pdfResume.querySelector('.resume-export');
  if (downloadBtn) {
    downloadBtn.style.setProperty('display', 'none', 'important');
  }

  const options = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename: 'Trixy_Cabuang_Resume.pdf',
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: true
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: {
      mode: 'legacy',
      before: '.resume-right',
      after: '.resume-left'
    }
  };

  // Show loading indicator
  const btn = document.getElementById('downloadResumeBtn');
  const originalText = btn.textContent;
  btn.textContent = 'Generating PDF...';
  btn.disabled = true;

  html2pdf()
    .set(options)
    .from(pdfResume)
    .save()
    .then(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    })
    .catch(err => {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
      btn.textContent = originalText;
      btn.disabled = false;
    });
});