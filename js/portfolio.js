(() => {
  const portfolioRoot = document.querySelector("[data-portfolio]");

  if (!portfolioRoot) {
    return;
  }

  const filterButtons = Array.from(portfolioRoot.querySelectorAll("[data-filter]"));
  const projectCards = Array.from(portfolioRoot.querySelectorAll("[data-project-card]"));
  const searchInput = portfolioRoot.querySelector("[data-portfolio-search]");
  const emptyState = portfolioRoot.querySelector("[data-portfolio-empty]");
  let activeFilter = "all";
  let activeSearch = "";

  const normalize = (value) => value.trim().toLowerCase();

  const getCardSearchText = (card) => {
    const title = card.querySelector("h2, h3")?.textContent || "";
    const summary = card.querySelector("p")?.textContent || "";
    const technologies = card.dataset.technologies || "";
    const category = card.dataset.category || "";
    return normalize(`${title} ${summary} ${technologies} ${category}`);
  };

  const cardMatchesFilter = (card) => {
    if (activeFilter === "all") {
      return true;
    }

    return normalize(card.dataset.category || "") === activeFilter;
  };

  const cardMatchesSearch = (card) => {
    if (!activeSearch) {
      return true;
    }

    return getCardSearchText(card).includes(activeSearch);
  };

  const updateEmptyState = (visibleCount) => {
    if (!emptyState) {
      return;
    }

    emptyState.hidden = visibleCount > 0;
  };

  const applyFilters = () => {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const isVisible = cardMatchesFilter(card) && cardMatchesSearch(card);
      card.hidden = !isVisible;
      card.classList.toggle("is-filtered-out", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    updateEmptyState(visibleCount);
  };

  const updateActiveButton = (selectedButton) => {
    filterButtons.forEach((button) => {
      const isActive = button === selectedButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");

    button.addEventListener("click", () => {
      activeFilter = normalize(button.dataset.filter || "all");
      updateActiveButton(button);
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      activeSearch = normalize(event.target.value);
      applyFilters();
    });
  }

  applyFilters();
})();
