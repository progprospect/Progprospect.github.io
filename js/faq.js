(() => {
  const accordions = document.querySelectorAll("[data-accordion]");

  const closeItem = (item) => {
    const button = item.querySelector("button");
    if (!button) {
      return;
    }

    item.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  const openItem = (item) => {
    const button = item.querySelector("button");
    if (!button) {
      return;
    }

    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  };

  const toggleItem = (accordion, item) => {
    const isOpen = item.classList.contains("is-open");
    const items = accordion.querySelectorAll(".accordion-item");

    items.forEach(closeItem);

    if (!isOpen) {
      openItem(item);
    }
  };

  const focusButtonByOffset = (buttons, currentIndex, offset) => {
    const nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  };

  const setupAccordion = (accordion) => {
    const items = Array.from(accordion.querySelectorAll(".accordion-item"));
    const buttons = items
      .map((item) => item.querySelector("button"))
      .filter(Boolean);

    items.forEach((item, index) => {
      const button = item.querySelector("button");
      const panel = item.querySelector(".accordion-panel");

      if (!button || !panel) {
        return;
      }

      const panelId = panel.id || `faq-panel-${index + 1}`;
      const buttonId = button.id || `faq-button-${index + 1}`;

      panel.id = panelId;
      button.id = buttonId;
      button.setAttribute("aria-controls", panelId);
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", buttonId);

      button.addEventListener("click", () => {
        toggleItem(accordion, item);
      });

      button.addEventListener("keydown", (event) => {
        const currentIndex = buttons.indexOf(button);

        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusButtonByOffset(buttons, currentIndex, 1);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          focusButtonByOffset(buttons, currentIndex, -1);
        }

        if (event.key === "Home") {
          event.preventDefault();
          buttons[0].focus();
        }

        if (event.key === "End") {
          event.preventDefault();
          buttons[buttons.length - 1].focus();
        }
      });
    });
  };

  accordions.forEach(setupAccordion);
})();
