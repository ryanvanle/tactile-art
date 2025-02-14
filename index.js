"use strict";

(function() {

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

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

})();