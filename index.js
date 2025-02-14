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

    generateColors();
    generateMaterials();
    generateTextures();
  }

  function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
      page.classList.add("hidden");
    });

    id(pageId).classList.remove("hidden");
  }

  function generateColors() {
    generateColorCards();
  }

  function generateColorCards() {
    const colorsList = id('colors-list');
    colorsList.innerHTML = '';

    for (const colorName in COLORS) {
      if (COLORS.hasOwnProperty(colorName)) {
        const colorData = COLORS[colorName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');

        h2.textContent = colorName;

        const colorSwatch = document.createElement('span');
        colorSwatch.classList.add('color-swatch');
        colorSwatch.style.backgroundColor = colorData.hex;

        article.classList.add("selectable");
        article.dataset.itemType = "color";
        article.dataset.itemName = colorName;

        article.addEventListener("click", showDetailPage);

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
    const materialsList = id('materials-list');
    materialsList.innerHTML = '';

    for (const materialName in MATERIALS) {
      if (MATERIALS.hasOwnProperty(materialName)) {
        const materialData = MATERIALS[materialName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');

        h2.textContent = materialName;
        p.textContent = materialData.blurb;

        article.classList.add("selectable");
        article.dataset.itemType = "material";
        article.dataset.itemName = materialName;
        article.addEventListener("click", showDetailPage);

        article.appendChild(h2);
        article.appendChild(p);
        listItem.appendChild(article);
        materialsList.appendChild(listItem);
      }
    }
  }

  function generateTextures() {
    generateTextureCards();
  }

  function generateTextureCards() {
    const texturesList = id('textures-list');
    texturesList.innerHTML = '';

    for (const textureName in TEXTURES) {
      if (TEXTURES.hasOwnProperty(textureName)) {
        const textureData = TEXTURES[textureName];
        const listItem = document.createElement('li');
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');

        h2.textContent = textureName;
        p.textContent = textureData.blurb;

        article.classList.add("selectable");
        article.dataset.itemType = "texture";
        article.dataset.itemName = textureName;
        article.addEventListener("click", showDetailPage);

        article.appendChild(h2);
        article.appendChild(p);
        listItem.appendChild(article);
        texturesList.appendChild(listItem);
      }
    }
  }

  function showDetailPage(event) {
    const article = event.currentTarget;
    const itemType = article.dataset.itemType;
    const itemName = article.dataset.itemName;

    let data;

    switch (itemType) {
      case "color":
        data = COLORS[itemName];
        generateColorDetailPage(data);
        break;
      case "material":
        data = MATERIALS[itemName];
        generateMaterialDetailPage(data);
        break;
      case "texture":
        data = TEXTURES[itemName];
        generateTextureDetailPage(data);
        break;
    }

    showPage("detail-page");
  }

  function generateColorDetailPage(colorData) {
    const detailPage = id("detail-page");
    detailPage.innerHTML = "";

    const h1 = document.createElement("h1");
    h1.textContent = Object.keys(COLORS).find(key => COLORS[key] === colorData);
    detailPage.appendChild(h1);

    const swatch = document.createElement("div");
    swatch.classList.add("color-swatch");
    swatch.style.backgroundColor = colorData.hex;
    detailPage.appendChild(swatch);

    const p = document.createElement("p");
    p.textContent = `Hex: ${colorData.hex}`; // Example additional detail
    detailPage.appendChild(p);

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Back to Colors";
    backButton.addEventListener("click", () => showPage("colors-page"));
    detailPage.appendChild(backButton);
  }

  function generateMaterialDetailPage(materialData) {
    const detailPage = id("detail-page");
    detailPage.innerHTML = "";

    const h1 = document.createElement("h1");
    h1.textContent = Object.keys(MATERIALS).find(key => MATERIALS[key] === materialData);
    detailPage.appendChild(h1);

    const p = document.createElement("p");
    p.textContent = materialData.blurb;
    detailPage.appendChild(p);

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Back to Materials";
    backButton.addEventListener("click", () => showPage("material-page"));
    detailPage.appendChild(backButton);
  }

  function generateTextureDetailPage(textureData) {
    const detailPage = id("detail-page");
    detailPage.innerHTML = "";

    const h1 = document.createElement("h1");
    h1.textContent = Object.keys(TEXTURES).find(key => TEXTURES[key] === textureData);
    detailPage.appendChild(h1);

    const p = document.createElement("p");
    p.textContent = textureData.blurb;
    detailPage.appendChild(p);

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Back to Textures";
    backButton.addEventListener("click", () => showPage("texture-page"));
    detailPage.appendChild(backButton);
  }

  function id(idName) {
    return document.getElementById(idName);
  }

})();