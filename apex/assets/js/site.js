(() => {
  /* ---- Nav toggle ---- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav    = document.querySelector("[data-nav]");

  const syncScrollState = () => {
    document.body.dataset.scrolled = window.scrollY > 10 ? "true" : "false";
  };

  syncScrollState();
  window.addEventListener("scroll", syncScrollState, { passive: true });

  if (toggle && nav) {
    const closeNav = () => {
      document.body.removeAttribute("data-nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    const openNav = () => {
      document.body.dataset.navOpen = "true";
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      document.body.dataset.navOpen === "true" ? closeNav() : openNav();
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---- Scroll-reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));

    /* Safety net: reveal anything still hidden after 1.5s
       (covers reduced-motion, slow observers, file:// quirks) */
    setTimeout(() => {
      revealEls.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          el.classList.add("is-visible");
        }
      });
    }, 1500);
  } else {
    /* No IntersectionObserver support — show everything */
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
