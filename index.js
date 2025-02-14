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

  const TEXTURES = {
    "Smooth": "Even, polished surface with no roughness",
    "Rough": "Coarse, uneven surface with bumps or ridges",
    "Fuzzy": "Soft, slightly hairy or fluffy texture",
    "Bumpy": "Raised areas creating an irregular surface",
    "Slippery": "Slick, hard to grip, often glossy or wet",
    "Gritty": "Small, grainy particles creating a sandy feel",
    "Sticky": "Tacky, adhesive surface that clings to touch",
    "Soft": "Gentle, cushion-like feel, easy to press into",
    "Hard": "Firm, unyielding surface with no give"
  };

  const MATERIALS = {
    "Aluminum Foil": "Malleable, lightweight, good for beginners",
    "Air-Dry Clay": "Easy to shape, lightweight, good for beginners",
    "Foam Sheets": "Soft, lightweight, easy to cut, good for beginners",
    "Metal Wire": "Flexible, thin, ideal for intricate shapes",
    "Felt": "Soft, versatile fabric for layering and stitching",
    "Oil Paints": "Rich, smooth texture, great for adding colors and blending",
    "Acrylic Paint": "Fast-drying, versatile, vibrant colors",
    "Pipe Cleaners": "Fuzzy, flexible, easy to bend, good for shaping",
    "Beads": "Small, textured, perfect for adding detail",
    "Papier-Mâché": "Layered, hardened paper with a slightly rough, sculptable texture. Lightweight yet sturdy."
  };

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
    generateMaterials();
    generateTextures();
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

  function generateMaterials() {
    generateMaterialsCards();
  }

  function generateMaterialsCards() {
    const materialsList = id('materials-list'); // Make sure you have <ul id="materials-list"> in your HTML
    materialsList.innerHTML = ''; // Clear existing items

    for (const materialName in MATERIALS) {
      if (MATERIALS.hasOwnProperty(materialName)) {
        const materialDescription = MATERIALS[materialName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const p = document.createElement('p'); // Add paragraph for description

        h2.textContent = materialName;
        p.textContent = materialDescription;

        article.classList.add("selectable"); // Add selectable class if needed

        article.appendChild(h2);
        article.appendChild(p); // Append the description
        listItem.appendChild(article);
        materialsList.appendChild(listItem);
      }
    }
  }

  function generateTextures() {
    generateTextureCards();
  }

  function generateTextureCards() {
    const texturesList = id('textures-list'); // Make sure you have <ul id="textures-list"> in your HTML
    texturesList.innerHTML = ''; // Clear existing items

    for (const textureName in TEXTURES) {
      if (TEXTURES.hasOwnProperty(textureName)) {
        const textureDescription = TEXTURES[textureName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const p = document.createElement('p'); // Add paragraph for description

        h2.textContent = textureName;
        p.textContent = textureDescription;

        article.classList.add("selectable"); // Add selectable class if needed

        article.appendChild(h2);
        article.appendChild(p); // Append the description
        listItem.appendChild(article);
        texturesList.appendChild(listItem);
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