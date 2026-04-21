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