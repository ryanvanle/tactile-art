"use strict";

(function() {
  let favorites = []; // Initialize an empty array to store favorites

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

    // Event listener for save to favorites buttons (delegation)
    document.addEventListener('click', function(event) {
      if (event.target.textContent === "Save to Favorites" || event.target.textContent === "Remove from Favorites") { // IMPORTANT: Check for BOTH states.
        saveToFavorites(event);
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

  function generateMaterials() {
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

  function generateTextures() {
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

    const detailPage = id(pageId);

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
    // Check and set favorite button state *after* generating content
    checkFavoriteButtonState(detailPage, itemType, itemName);
    showPage(pageId);
  }

  function generateColorDetailPageContent(detailPage, colorData, colorName) {
    const title = detailPage.querySelector("h1");
    const swatch = detailPage.querySelector(".color-swatch");
    const hue = detailPage.querySelector("#color-detail-page > section:nth-of-type(1) > p");
    const seen = detailPage.querySelector("#color-detail-page > section:nth-of-type(2) > p");
    const hexCode = detailPage.querySelector("#color-detail-page > section:nth-of-type(3) > p");

    title.textContent = colorName;
    swatch.style.backgroundColor = colorData.hex;
    hue.textContent = colorData.description;
    seen.textContent = colorData.seen;
    hexCode.textContent = `Hex code: ${colorData.hex}`;

    const exploreList = id("color-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, colorData.explore);
  }

  function generateMaterialDetailPageContent(detailPage, materialData, materialName) {
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p");
    const description = detailPage.querySelectorAll("p"); // Select the second <p>
    const techniquesList = detailPage.querySelector("ul");
    const availability = detailPage.querySelector("#material-detail-page > section:nth-of-type(3) > p");

    title.textContent = materialName;
    blurb.textContent = materialData.blurb;
    description.textContent = materialData.description; // Set the content of the second <p>

    techniquesList.innerHTML = "";
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
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p");
    const description = detailPage.querySelector("#texture-detail-content > p");

    title.textContent = textureName;
    blurb.textContent = textureData.blurb;
    description.textContent = textureData.create;

    const exploreList = id("texture-detail-page").querySelector(".explore-more ul");
    generateExploreFurtherList(exploreList, textureData.explore);
  }

  function generateExploreFurtherList(exploreList, exploreItems) {
    exploreList.innerHTML = "";

    exploreItems.forEach(item => {
      const listItem = document.createElement("li");
      let article;

      if (item in COLORS) {
        article = createSmallColorCard(item, COLORS[item]);
      } else if (item in TEXTURES) {
        article = createSmallTextCard(item, TEXTURES[item], "texture");
      } else if (item in MATERIALS) {
        article = createSmallTextCard(item, MATERIALS[item], "material");
      } else {
        return; // Item not found
      }

      listItem.appendChild(article);
      exploreList.appendChild(listItem);
    });
  }

  // --- Image Gallery Handling ---
  function populateGallery() {
    const gallery = id('gallery');
    if (!gallery) {
      console.error("Gallery element not found.");
      return;
    }

    gallery.innerHTML = ''; // Clear existing images

    for (const artworkName in ARTWORK) {
      const artworkData = ARTWORK[artworkName];
      const img = document.createElement('img');
      img.src = `img/${artworkData.image}`;
      img.alt = artworkData.alt;
      img.dataset.itemName = artworkName;
      img.addEventListener("click", showArtworkDetailPage);
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
    checkFavoriteButtonState(detailPage, "artwork", artworkName); // Check favorite state
    showPage("artwork-detail-page");
  }

  function generateArtworkDetailPageContent(detailPage, artworkData, artworkName) {
    const title = detailPage.querySelector("h1");
    const artistYear = detailPage.querySelector("header > section > p");
    const image = detailPage.querySelector(".artwork-image-container img");
    const description = detailPage.querySelector(".artwork-about > section:nth-of-type(1) > p");
    const notesList = detailPage.querySelector(".artwork-about > section:nth-of-type(2) > ul");
    const audio = detailPage.querySelector(".artwork-about > section:nth-of-type(3) > audio");
    const credit = detailPage.querySelector("#audio-description-credit");

    title.textContent = artworkName;
    artistYear.textContent = `${artworkData.notes.artist}, ${artworkData.notes.year}`;
    image.src = `img/${artworkData.image}`;
    image.alt = artworkData.alt;
    description.textContent = artworkData.description;

    notesList.innerHTML = "";
    for (const note in artworkData.notes) {
      if (note!== "artist" && note!== "year") {
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

  // --- Favorites Handling ---

  function checkFavoriteButtonState(detailPage, itemType, itemName) {
      const button = detailPage.querySelector(".favorites-button");
      if (!button) return;

      const isFavorite = favorites.some(fav => fav.name === itemName && fav.type === itemType);
      button.textContent = isFavorite ? "Remove from Favorites" : "Save to Favorites";
  }


  function saveToFavorites(event) {
    const button = event.target;
    const detailPage = button.closest(".detail-page");
    const itemType = detailPage.id.split("-")[0];
    const itemName = detailPage.querySelector("h1").textContent;

    let itemData;
    switch (itemType) {
      case "color":
        itemData = COLORS[itemName];
        break;
      case "material":
        itemData = MATERIALS[itemName]; // This was missing
        break;
      case "texture":
        itemData = TEXTURES[itemName];
        break;
      case "artwork":
        itemData = ARTWORK[itemName];
        break;
    }

    const existingIndex = favorites.findIndex(fav => fav.name === itemName && fav.type === itemType);
    if (existingIndex > -1) {
      favorites.splice(existingIndex, 1);
      button.textContent = "Save to Favorites";
    } else {
      favorites.push({ type: itemType, name: itemName, data: itemData });
      button.textContent = "Remove from Favorites";
    }

    generateFavoritesPage();
  }

  function generateFavoritesPage() {
    const favoritesList = id("favorite-page").querySelector("ul");
    favoritesList.innerHTML = "";

    favorites.forEach(favorite => {
      const listItem = document.createElement("li");
      let article;

      switch (favorite.type) {
        case "color":
          article = createSmallColorCard(favorite.name, favorite.data);
          break;
        case "material":
        case "texture":
          article = createSmallTextCard(favorite.name, favorite.data, favorite.type);
          break;
        case "artwork":
          article = createSmallArtworkCard(favorite.name, favorite.data);
          break;
      }

      if (article) {
        listItem.appendChild(article);
        favoritesList.appendChild(listItem);
      }
    });
  }

  // Helper functions to create small cards
  function createSmallColorCard(colorName, colorData) {
    const article = document.createElement("article");
    article.classList.add("small-color-card", "selectable");
    article.dataset.itemType = "color";
    article.dataset.itemName = colorName;
    article.dataset.pageId = "color-detail-page";
    article.addEventListener("click", showDetailPage);

    const h3 = document.createElement("h3");
    h3.textContent = colorName;
    article.appendChild(h3);

    const swatch = document.createElement("span");
    swatch.classList.add("color-swatch");
    swatch.style.backgroundColor = colorData.hex;
    article.appendChild(swatch);

    return article;
  }

  function createSmallTextCard(itemName, itemData, itemType) {
    const article = document.createElement("article");
    article.classList.add("small-text-card", "selectable");
    article.dataset.itemType = itemType;
    article.dataset.itemName = itemName;
    article.dataset.pageId = `${itemType}-detail-page`;
    article.addEventListener("click", showDetailPage);

    const h3 = document.createElement("h3");
    h3.textContent = itemName;
    article.appendChild(h3);

    const blurb = document.createElement("p");
    blurb.textContent = itemData.blurb;
    article.appendChild(blurb);

    return article;
  }

  function createSmallArtworkCard(artworkName, artworkData) {
    const article = document.createElement("article");
    article.classList.add("small-artwork-card", "selectable"); // You might want to style this differently
    article.dataset.itemName = artworkName;
    article.addEventListener("click", showArtworkDetailPage);

    const img = document.createElement('img');
    img.src = `img/${artworkData.image}`;
    img.alt = artworkData.alt;
    article.appendChild(img);

    const h3 = document.createElement("h3");
    h3.textContent = artworkName;
    article.appendChild(h3);

    return article;
  }

  // Helper Function
  function id(idName) {
    return document.getElementById(idName);
  }
})();