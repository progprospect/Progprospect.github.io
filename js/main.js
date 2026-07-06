(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const loader = document.querySelector(".site-loader");
  const backToTop = document.querySelector("[data-back-to-top]");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const setLoaderHidden = () => {
    if (!loader) {
      return;
    }

    loader.classList.add("is-hidden");
    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true }
    );
  };

  const closeNavigation = () => {
    if (!navToggle || !navPanel) {
      return;
    }

    document.body.classList.remove("nav-open");
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  const openNavigation = () => {
    if (!navToggle || !navPanel) {
      return;
    }

    document.body.classList.add("nav-open");
    navPanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  const toggleNavigation = () => {
    const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNavigation();
    } else {
      openNavigation();
    }
  };

  const updateHeader = () => {
    if (!header) {
      return;
    }

    const currentY = window.scrollY;
    header.classList.toggle("is-scrolled", currentY > 12);

    if (currentY > 420 && currentY > lastScrollY && !document.body.classList.contains("nav-open")) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }

    lastScrollY = Math.max(currentY, 0);
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  const setActiveNavigation = () => {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".nav-links a, .site-footer a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) {
        return;
      }

      const hrefPath = href.split("#")[0];
      if (hrefPath === path) {
        link.classList.add("active");
        if (link.closest(".nav-links")) {
          link.setAttribute("aria-current", "page");
        }
      } else if (link.closest(".nav-links")) {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  };

  const cloneMarqueeItems = () => {
    const tracks = document.querySelectorAll(".logo-track");
    tracks.forEach((track) => {
      if (track.dataset.cloned === "true") {
        return;
      }

      const items = Array.from(track.children);
      items.forEach((item) => {
        track.appendChild(item.cloneNode(true));
      });
      track.dataset.cloned = "true";
    });
  };

  const setupBackToTop = () => {
    if (!backToTop) {
      return;
    }

    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  };

  const setupNavigationEvents = () => {
    if (navToggle) {
      navToggle.addEventListener("click", toggleNavigation);
    }

    if (navPanel) {
      navPanel.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) {
          closeNavigation();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNavigation();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        closeNavigation();
      }
    });
  };

  const setupExternalLinks = () => {
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach((link) => {
      const rel = link.getAttribute("rel") || "";
      if (!rel.includes("noopener")) {
        link.setAttribute("rel", `${rel} noopener`.trim());
      }
    });
  };

  const init = () => {
    setActiveNavigation();
    cloneMarqueeItems();
    setupBackToTop();
    setupNavigationEvents();
    setupExternalLinks();
    updateHeader();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

    if (document.readyState === "complete") {
      window.setTimeout(setLoaderHidden, prefersReducedMotion ? 0 : 450);
    } else {
      window.addEventListener("load", () => {
        window.setTimeout(setLoaderHidden, prefersReducedMotion ? 0 : 450);
      });
    }
  };

  init();
})();
