const links = document.querySelectorAll(".topnav a");
const pages = document.querySelectorAll(".page");
const body = document.body;

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // remove active from all pages
    pages.forEach(page => page.classList.remove("active"));

    // get target page
    const target = link.getAttribute("href").replace("#", "");

    // show selected page
    document.getElementById(target).classList.add("active");

    // sidebar control
    if (target === "about") {
      body.classList.add("about-active");
    } else {
      body.classList.remove("about-active");
    }
  });
});

// default state
body.classList.add("about-active");

// Gallery modal functionality
const galleryImages = document.querySelectorAll('.gallery-grid img');
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.querySelector('.close-btn');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalTitle.textContent = 'Gallery Image';
    modalDesc.textContent = 'Click outside or the X to close.';
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});