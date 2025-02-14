"use strict";

// disclaimer: AI was only used to do rapid prototyping in speeding of the process writing code that I (ryan) already knew how to implement but would be tedious to do, i.e. component generation.

(function() {

  const COLORS = {
    "Crimson": "#ad1c42",
    "Golden Yellow": "#cb8f16",
    "Emerald": "#009877",
    "Navy Blue": "#403f6f",
    "Lavender": "#b2a4d4",
    "Burnt Orange": "#c7632c",
    "Charcoal Gray": "#6a6a6a",
    "Blue Turquoise": "#52b0ae",
    "Crystal Rose": "#fdc4c7"
  }

  window.addEventListener("load", init);

  function init() {

    id("materials-button").addEventListener("click", () => showPage("material-page"));
    id("textures-button").addEventListener("click", () => showPage("texture-page"));
    id("colors-button").addEventListener("click", () => showPage("colors-page"));
    id("favorites-button").addEventListener("click", () => showPage("favorite-page"));

    const backButtons = document.querySelectorAll(".back-button");
    backButtons.forEach(button => {
        button.addEventListener("click", () => showPage("home-page"));
    });

    generateColors();
  }

  /**
   * Shows the specified page and hides all other pages.
   * @param {string} pageId - The ID of the page to show.
   */
  function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
      page.classList.add("hidden");
    });

    id(pageId).classList.remove("hidden");
  }

  function generateColors() {
    generateColorCards();
    // generateColorDetailPage() // ignore
  }

  function generateColorCards() {
    const colorsList = id('colors-list');
    colorsList.innerHTML = '';

    for (const colorName in COLORS) {
      if (COLORS.hasOwnProperty(colorName)) {
        const colorValue = COLORS[colorName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');

        h2.textContent = colorName;

        const colorSwatch = document.createElement('span');
        colorSwatch.classList.add('color-swatch');
        colorSwatch.style.backgroundColor = colorValue;

        article.classList.add("selectable");

        article.appendChild(h2);
        article.appendChild(colorSwatch);
        listItem.appendChild(article);
        colorsList.appendChild(listItem);
      }
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();