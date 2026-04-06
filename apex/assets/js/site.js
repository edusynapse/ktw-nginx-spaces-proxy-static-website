(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const syncScrollState = () => {
    document.body.dataset.scrolled = window.scrollY > 10 ? "true" : "false";
  };

  syncScrollState();
  window.addEventListener("scroll", syncScrollState, { passive: true });

  if (!toggle || !nav) {
    return;
  }

  const closeNav = () => {
    document.body.removeAttribute("data-nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    document.body.dataset.navOpen = "true";
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    if (document.body.dataset.navOpen === "true") {
      closeNav();
      return;
    }

    openNav();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeNav();
    }
  });
})();
