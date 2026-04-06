(() => {
  const docEl = document.documentElement;

  /* ---- Nav toggle ---- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

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

  /* ---- Localization helpers ---- */
  const languageSwitcher = document.querySelector("[data-language-switcher]");
  const languageToggle = document.querySelector("[data-language-toggle]");
  const languageMenu = document.querySelector("[data-language-menu]");
  const currentLanguageLabel = document.querySelector("[data-current-language]");

  const currentPageKey = (docEl.dataset.pageKey || "index").trim();
  const currentLangCode = (docEl.dataset.langCode || "EN").trim().toUpperCase();

  const closeLanguageMenu = () => {
    if (!languageSwitcher || !languageToggle) return;
    languageSwitcher.classList.remove("is-open");
    languageToggle.setAttribute("aria-expanded", "false");
  };

  const openLanguageMenu = () => {
    if (!languageSwitcher || !languageToggle) return;
    languageSwitcher.classList.add("is-open");
    languageToggle.setAttribute("aria-expanded", "true");
  };

  const resolvePageUrl = (manifest, pageKey, langCode) => {
    const pageMap = manifest?.pages?.[pageKey] || {};
    return pageMap[langCode] || pageMap[manifest.defaultLang] || null;
  };

  const resolveLegalUrl = (manifest, kind, langCode) => {
    const legalMap = manifest?.legal?.[kind] || {};
    return legalMap[langCode] || legalMap[manifest.defaultLang] || null;
  };

  const applyBoundLinks = (manifest) => {
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      const pageKey = link.getAttribute("data-page-link");
      const href = resolvePageUrl(manifest, pageKey, currentLangCode);
      if (href) link.setAttribute("href", href);
    });

    document.querySelectorAll("[data-legal-link]").forEach((link) => {
      const kind = link.getAttribute("data-legal-link");
      const href = resolveLegalUrl(manifest, kind, currentLangCode);
      if (href) link.setAttribute("href", href);
    });
  };

  const renderLanguageMenu = (manifest) => {
    if (!languageSwitcher || !languageToggle || !languageMenu) return;

    const namesByCode = new Map((manifest.languages || []).map((lang) => [lang.code, lang.name]));
    const currentPageMap = manifest.pages?.[currentPageKey] || {};
    const availableCodes = Object.keys(currentPageMap);
    const activeCode = currentPageMap[currentLangCode] ? currentLangCode : manifest.defaultLang;

    applyBoundLinks(manifest);

    if (currentLanguageLabel) {
      currentLanguageLabel.textContent =
        namesByCode.get(activeCode) || namesByCode.get(manifest.defaultLang) || manifest.defaultLang;
    }

    if (availableCodes.length <= 1) {
      languageSwitcher.hidden = true;
      return;
    }

    languageSwitcher.hidden = false;
    languageMenu.innerHTML = "";

    availableCodes
      .map((code) => ({
        code,
        name: namesByCode.get(code) || code,
        href: currentPageMap[code]
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((entry) => {
        const link = document.createElement("a");
        link.className = "language-option";
        link.href = entry.href;
        link.textContent = entry.name;

        if (entry.code === activeCode) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }

        link.addEventListener("click", () => closeLanguageMenu());
        languageMenu.appendChild(link);
      });

    languageToggle.addEventListener("click", () => {
      languageSwitcher.classList.contains("is-open") ? closeLanguageMenu() : openLanguageMenu();
    });

    document.addEventListener("click", (event) => {
      if (!languageSwitcher.contains(event.target)) closeLanguageMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLanguageMenu();
    });
  };

  const initLocalization = async () => {
    try {
      const response = await fetch("/assets/i18n/page_routes.json", {
        headers: { Accept: "application/json" },
        cache: "force-cache"
      });
      if (!response.ok) return;

      const manifest = await response.json();
      if (!manifest || typeof manifest !== "object") return;

      if (!manifest.defaultLang) manifest.defaultLang = "EN";
      renderLanguageMenu(manifest);
    } catch (_) {
      /* Leave the static English links untouched if the manifest is unavailable. */
    }
  };

  void initLocalization();

  /* ---- Scroll-reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));

    setTimeout(() => {
      revealEls.forEach((el) => {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      });
    }, 1500);
  } else if (revealEls.length) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
