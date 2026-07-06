(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (prefersReducedMotion || !hasFinePointer) {
    return;
  }

  const cursor = document.createElement("div");
  const cursorDot = document.createElement("div");
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let cursorX = pointerX;
  let cursorY = pointerY;

  cursor.className = "custom-cursor";
  cursorDot.className = "custom-cursor-dot";
  cursor.setAttribute("aria-hidden", "true");
  cursorDot.setAttribute("aria-hidden", "true");
  document.body.append(cursor, cursorDot);

  const interactiveSelector = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    ".service-card",
    ".project-card",
    ".pricing-card",
    ".blog-card",
    ".accordion-item"
  ].join(",");

  const updateCursor = () => {
    cursorX += (pointerX - cursorX) * 0.18;
    cursorY += (pointerY - cursorY) * 0.18;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(updateCursor);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      document.body.classList.add("has-custom-cursor");
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(interactiveSelector)) {
      document.body.classList.add("cursor-interactive");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest(interactiveSelector)) {
      document.body.classList.remove("cursor-interactive");
    }
  });

  document.addEventListener("pointerdown", () => {
    document.body.classList.add("cursor-pressed");
  });

  document.addEventListener("pointerup", () => {
    document.body.classList.remove("cursor-pressed");
  });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("has-custom-cursor");
  });

  document.addEventListener("mouseenter", () => {
    document.body.classList.add("has-custom-cursor");
  });

  updateCursor();
})();
