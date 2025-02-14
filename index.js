"use strict";

(function() {

  window.addEventListener("load", init);

  function init() {
    console.log("hello world");
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