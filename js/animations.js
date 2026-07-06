(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-counter]");
  const parallaxScenes = document.querySelectorAll("[data-parallax-scene]");

  const revealImmediately = () => {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  };

  const setupRevealObserver = () => {
    if (!("IntersectionObserver" in window)) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const formatCounter = (value, original) => {
    if (original.includes(".")) {
      return value.toFixed(1);
    }

    return Math.round(value).toLocaleString("en-US");
  };

  const animateCounter = (counter) => {
    const targetText = counter.dataset.counter || "0";
    const target = Number.parseFloat(targetText);
    const suffix = counter.textContent.replace(/[0-9.,]/g, "");

    if (!Number.isFinite(target)) {
      return;
    }

    if (prefersReducedMotion) {
      counter.textContent = `${formatCounter(target, targetText)}${suffix}`;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      counter.textContent = `${formatCounter(current, targetText)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const setupCounterObserver = () => {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          activeObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5
      }
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  const setupParallax = () => {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    parallaxScenes.forEach((scene) => {
      const layers = scene.querySelectorAll("[data-parallax-depth]");
      if (!layers.length) {
        return;
      }

      let rect = scene.getBoundingClientRect();
      let pointerX = 0;
      let pointerY = 0;
      let frameRequested = false;

      const updateLayers = () => {
        layers.forEach((layer) => {
          const depth = Number.parseFloat(layer.dataset.parallaxDepth || "0");
          const moveX = pointerX * depth * 34;
          const moveY = pointerY * depth * 34;

          layer.classList.add("is-parallaxing");

          if (layer.classList.contains("hero-dashboard")) {
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(7deg) rotateY(-13deg) rotateZ(2deg)`;
          } else {
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          }
        });

        frameRequested = false;
      };

      const requestUpdate = () => {
        if (!frameRequested) {
          window.requestAnimationFrame(updateLayers);
          frameRequested = true;
        }
      };

      scene.addEventListener(
        "pointermove",
        (event) => {
          pointerX = (event.clientX - rect.left) / rect.width - 0.5;
          pointerY = (event.clientY - rect.top) / rect.height - 0.5;
          requestUpdate();
        },
        { passive: true }
      );

      scene.addEventListener("pointerleave", () => {
        layers.forEach((layer) => {
          layer.classList.remove("is-parallaxing");
          layer.style.transform = "";
        });
      });

      window.addEventListener(
        "resize",
        () => {
          rect = scene.getBoundingClientRect();
        },
        { passive: true }
      );
    });
  };

  const setupSectionFocusReveal = () => {
    revealItems.forEach((item) => {
      item.addEventListener("focusin", () => {
        item.classList.add("is-visible");
      });
    });
  };

  const init = () => {
    if (prefersReducedMotion) {
      revealImmediately();
    } else {
      setupRevealObserver();
    }

    setupCounterObserver();
    setupParallax();
    setupSectionFocusReveal();
  };

  init();
})();
