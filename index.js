"use strict";

(function() {
  window.addEventListener("load", init);

  function init() {
    // Event listeners for main navigation buttons
    id("materials-button").addEventListener("click", () => showPage("material-page"));
    id("textures-button").addEventListener("click", () => showPage("texture-page"));
    id("colors-button").addEventListener("click", () => showPage("colors-page"));
    id("favorites-button").addEventListener("click", () => showPage("favorite-page"));

    // Event listeners for back buttons (delegation)
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('back-button')) {
        showPage("home-page");
      }
    });

    populateGallery();
    generateColors();
    generateMaterials();
    generateTextures();
  }

  function showPage(pageId) {

    const audio = document.querySelector("#artwork-detail-audio > audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.add("hidden"));
    id(pageId).classList.remove("hidden");
  }

  // --- Card Generation Functions ---
  function generateColors() {
    generateColorCards();
  }

  function generateMaterials() {
    generateMaterialsCards();
  }

  function generateTextures() {
    generateTexturesCards();
  }

  function generateColorCards() {
    const colorsList = id('colors-list');
    colorsList.innerHTML = ''; // Clear existing cards

    for (const colorName in COLORS) {
      const colorData = COLORS[colorName];
      const listItem = document.createElement('li');
      const article = document.createElement('article');
      article.classList.add("selectable");
      article.dataset.itemType = "color";
      article.dataset.itemName = colorName;
      article.dataset.pageId = "color-detail-page";
      article.addEventListener("click", showDetailPage);

      const h2 = document.createElement('h2');
      h2.textContent = colorName;
      article.appendChild(h2);

      const colorSwatch = document.createElement('span');
      colorSwatch.classList.add('color-swatch');
      colorSwatch.style.backgroundColor = colorData.hex;
      article.appendChild(colorSwatch);

      listItem.appendChild(article);
      colorsList.appendChild(listItem);
    }
  }

  function generateMaterialsCards() {
    const materialsList = id('materials-list');
    materialsList.innerHTML = '';

    for (const materialName in MATERIALS) {
      const materialData = MATERIALS[materialName];
      const listItem = document.createElement('li');
      const article = document.createElement('article');
      article.classList.add("selectable");
      article.dataset.itemType = "material";
      article.dataset.itemName = materialName;
      article.dataset.pageId = "material-detail-page";
      article.addEventListener("click", showDetailPage);

      const h2 = document.createElement('h2');
      h2.textContent = materialName;
      article.appendChild(h2);

      const p = document.createElement('p');
      p.textContent = materialData.blurb;
      article.appendChild(p);

      listItem.appendChild(article);
      materialsList.appendChild(listItem);
    }
  }

  function generateTexturesCards() {
    const texturesList = id('textures-list');
    texturesList.innerHTML = '';

    for (const textureName in TEXTURES) {
      const textureData = TEXTURES[textureName];
      const listItem = document.createElement('li');
      const article = document.createElement('article');
      article.classList.add("selectable");
      article.dataset.itemType = "texture";
      article.dataset.itemName = textureName;
      article.dataset.pageId = "texture-detail-page";
      article.addEventListener("click", showDetailPage);

      const h2 = document.createElement('h2');
      h2.textContent = textureName;
      article.appendChild(h2);

      const p = document.createElement('p');
      p.textContent = textureData.blurb;
      article.appendChild(p);

      listItem.appendChild(article);
      texturesList.appendChild(listItem);
    }
  }

  // --- Detail Page Handling ---
  function showDetailPage(event) {
    const article = event.currentTarget;
    const itemType = article.dataset.itemType;
    const itemName = article.dataset.itemName;
    const pageId = article.dataset.pageId;

    // Get the detail page element
    const detailPage = id(pageId);

    // Call the appropriate function to update the template content
    switch (itemType) {
      case "color":
        generateColorDetailPageContent(detailPage, COLORS[itemName], itemName);
        break;
      case "material":
        generateMaterialDetailPageContent(detailPage, MATERIALS[itemName], itemName);
        break;
      case "texture":
        generateTextureDetailPageContent(detailPage, TEXTURES[itemName], itemName);
        break;
    }

    // Show the detail page
    showPage(pageId);
  }

  function generateColorDetailPageContent(detailPage, colorData, colorName) {
    // Get references to the template elements
    const title = detailPage.querySelector("h1");
    const swatch = detailPage.querySelector(".color-swatch");
    const hue = detailPage.querySelector("#color-detail-page > section:nth-of-type(1) > p"); // Select the <p> in the first section
    const seen = detailPage.querySelector("#color-detail-page > section:nth-of-type(2) > p"); // Select the <p> in the second section
    const hexCode = detailPage.querySelector("#color-detail-page > section:nth-of-type(3) > p"); // Select the <p> in the third section

    // Update the content of the template elements
    title.textContent = colorName;
    swatch.style.backgroundColor = colorData.hex;
    hue.textContent = colorData.description;
    seen.textContent = colorData.seen;
    hexCode.textContent = `Hex code: ${colorData.hex}`;

    const exploreList = id("color-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, colorData.explore);
  }

  function generateMaterialDetailPageContent(detailPage, materialData, materialName) {
    // Get references to the template elements
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p"); // Select the first <p>
    const description = detailPage.querySelectorAll("p"); // Select the second <p>
    const techniquesList = detailPage.querySelector("ul");
    const availability = detailPage.querySelector("#material-detail-page > section:nth-of-type(3) > p"); // Select the <p> in the third section of #material-detail-page

    // Update the content of the template elements
    title.textContent = materialName;
    blurb.textContent = materialData.blurb;
    description.textContent = materialData.description;

    console.log(materialData)

    // Clear existing techniques and add new ones
    techniquesList.innerHTML = ""; // Using innerHTML here for efficiency
    materialData.techniques.forEach(technique => {
      const listItem = document.createElement("li");
      listItem.textContent = technique;
      techniquesList.appendChild(listItem);
    });

    availability.textContent = materialData.availability;

    const exploreList = id("material-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, materialData.explore);
  }

  function generateTextureDetailPageContent(detailPage, textureData, textureName) {
    // Get references to the template elements
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p"); // Select the first <p>
    const description = detailPage.querySelector("#texture-detail-content > p"); // Select the <p> within #texture-detail-content

    // Update the content of the template elements
    title.textContent = textureName;
    blurb.textContent = textureData.blurb;
    description.textContent = textureData.create;

    const exploreList = id("texture-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, textureData.explore);
  }

  function generateExploreFurtherList(exploreList, exploreItems) {
    exploreList.innerHTML = ""; // Clear existing items

    exploreItems.forEach(item => {
      const listItem = document.createElement("li");
      let article;

      if (item in COLORS) {
        const colorData = COLORS[item];
        article = document.createElement("article");
        article.classList.add("small-color-card", "selectable");
        article.dataset.itemType = "color";
        article.dataset.itemName = item;
        article.dataset.pageId = "color-detail-page";
        article.addEventListener("click", showDetailPage); // Add event listener for navigation

        const h3 = document.createElement("h3");
        h3.textContent = item;
        article.appendChild(h3);

        const swatch = document.createElement("span");
        swatch.classList.add("color-swatch");
        swatch.style.backgroundColor = colorData.hex;
        article.appendChild(swatch);

      } else if (item in TEXTURES) {
        const textureData = TEXTURES[item];
        article = document.createElement("article");
        article.classList.add("small-text-card", "selectable");
        article.dataset.itemType = "texture";
        article.dataset.itemName = item;
        article.dataset.pageId = "texture-detail-page";
        article.addEventListener("click", showDetailPage); // Add event listener for navigation

        const h3 = document.createElement("h3");
        h3.textContent = item;
        article.appendChild(h3);

        const blurb = document.createElement("p");
        blurb.textContent = textureData.blurb;
        article.appendChild(blurb);

      } else if (item in MATERIALS) {
        const materialData = MATERIALS[item];
        article = document.createElement("article");
        article.classList.add("small-text-card", "selectable");
        article.dataset.itemType = "material";
        article.dataset.itemName = item;
        article.dataset.pageId = "material-detail-page";
        article.addEventListener("click", showDetailPage); // Add event listener for navigation

        const h3 = document.createElement("h3");
        h3.textContent = item;
        article.appendChild(h3);

        const blurb = document.createElement("p");
        blurb.textContent = materialData.blurb;
        article.appendChild(blurb);

      } else {
        // Item not found in any data, so don't render it
        return;
      }

      listItem.appendChild(article);
      exploreList.appendChild(listItem);
    });
  }

  // --- Image Gallery Handling ---
  function populateGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) {
      console.error("Gallery element not found.");
      return;
    }

    gallery.innerHTML = ''; // Clear existing images

    for (const artworkName in ARTWORK) {
      const artworkData = ARTWORK[artworkName];
      console.log(ARTWORK, artworkData);
      const img = document.createElement('img');
      img.src = `img/${artworkData.image}`; // Assuming images are in 'img' folder
      img.alt = artworkData.alt;
      img.dataset.itemName = artworkName; // Store artwork name for event handling
      img.addEventListener("click", showArtworkDetailPage); // Add click listener
      gallery.appendChild(img);
    }
  }

  // --- Artwork Detail Page Handling ---
  function showArtworkDetailPage(event) {
    const img = event.currentTarget;
    const artworkName = img.dataset.itemName;
    const artworkData = ARTWORK[artworkName];

    const detailPage = id("artwork-detail-page");
    generateArtworkDetailPageContent(detailPage, artworkData, artworkName);
    showPage("artwork-detail-page");
  }

  function generateArtworkDetailPageContent(detailPage, artworkData, artworkName) {
    // Get references to the template elements
    const title = detailPage.querySelector("h1");
    const artistYear = detailPage.querySelector("header > section > p"); // Select the <p> within the header section
    const image = detailPage.querySelector(".artwork-image-container img");
    const description = detailPage.querySelector(".artwork-about > section:nth-of-type(1) > p"); // Select the <p> in the first section of.artwork-about
    const notesList = detailPage.querySelector(".artwork-about > section:nth-of-type(2) > ul"); // Select the <ul> in the second section of.artwork-about
    const audio = detailPage.querySelector(".artwork-about > section:nth-of-type(3) > audio"); // Select the <audio> in the third section of.artwork-about
    const credit = detailPage.querySelector("#audio-description-credit");

    // Update the content of the template elements
    title.textContent = artworkName;
    artistYear.textContent = `${artworkData.notes.artist}, ${artworkData.notes.year}`;
    image.src = `img/${artworkData.image}`; // Assuming images are in 'img' folder
    image.alt = artworkData.alt;
    description.textContent = artworkData.description;

    // Clear existing notes and add new ones
    notesList.innerHTML = "";
    for (const note in artworkData.notes) {
      if (note!== "artist" && note!== "year") { // Exclude artist and year as they are already displayed
        const listItem = document.createElement("li");
        listItem.textContent = `${note}: ${artworkData.notes[note]}`;
        notesList.appendChild(listItem);
      }
    }

    audio.src = `audio/${artworkData.audio}`;
    credit.textContent = artworkData.credit;

    const exploreList = id("artwork-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, artworkData.explore);
  }

  // Helper Functions
  function id(idName) {
    return document.getElementById(idName);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

})();