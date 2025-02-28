"use strict";

(function() {
  let favorites = []; // Initialize an empty array to store favorites
  let currentPageId = "search-page"; // Initialize with the default home page
  let previousPageId = "search-page"; // Initialize to home page as well, in case of initial back button press

  window.addEventListener("load", init);

  function init() {
    initializeEventListeners();
    populateGallery();
    generateColors();
    generateMaterials();
    generateTextures();
    generateFavoritesPage();
    initSearch();
  }

  function initializeEventListeners() {
    id("materials-button").addEventListener("click", () => showPage("material-page"));
    id("textures-button").addEventListener("click", () => showPage("texture-page"));
    id("colors-button").addEventListener("click", () => showPage("colors-page"));
    id("favorites-button").addEventListener("click", () => showPage("favorite-page"));

    // TODO UPDATE functionally
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        showPreviousPage();
      });
    });

    document.addEventListener('click', function(event) {
      handleSelectableClick(event);
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === "Enter" || event.key === " ") {
        handleSelectableClick(event);
      }
    });

    function handleSelectableClick(event){
        const selectable = event.target.closest('.selectable');
        if (selectable && !event.target.closest('.back-button')) { // Check if it's selectable AND NOT a close button
          showDetailPage(selectable);
        }
    }

    // Event listener for save to favorites buttons (delegation)
    document.addEventListener('click', function(event) {
      handleFavoritesClick(event);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === " ") { // Space or Enter
            handleFavoritesClick(event);
        }
    });


    const submitButton = id("user-suggestion-page-submit-button");
    const closeButton = id("user-suggestion-popup-close-button");
    const userSuggestionPopup = id("user-suggestion-popup");
    submitButton.addEventListener('click', () => {
      userSuggestionPopup.showModal();
    });

    closeButton.addEventListener('click', () => {
      userSuggestionPopup.close();
    });

  }

  function initSearch() {
    const searchBars = document.querySelectorAll(".search-bar");
    searchBars.forEach(searchBar => {
      searchBar.addEventListener("input", () => {
        const searchTerm = searchBar.value.toLowerCase();
        const pageId = searchBar.closest(".page").id;
          switch (pageId) {
            case "home-page":
              searchHomePage(searchTerm);
              break;
            case "colors-page":
              searchColorsPage(searchTerm);
              break;
            case "material-page":
              searchMaterialsPage(searchTerm);
              break;
            case "texture-page":
              searchTexturesPage(searchTerm);
              break;
          }
        });
    });
  }

  function searchHomePage(searchTerm) {
    const gallery = id("gallery");
    const images = gallery.querySelectorAll("img");

    images.forEach(image => {
      const artworkName = image.dataset.itemName;
      const artworkData = ARTWORK[artworkName];
      const artworkAlt = artworkData.alt.toLowerCase();

      if (artworkAlt.includes(searchTerm)) {
        image.style.display = "block";
      } else {
        image.style.display = "none";
      }
    });
  }

  function searchColorsPage(searchTerm) {
    const colorsList = id("colors-list");
    const colorItems = colorsList.querySelectorAll("li");

    colorItems.forEach(item => {
      const colorName = item.querySelector("h2").textContent.toLowerCase();

      if (colorName.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function searchMaterialsPage(searchTerm) {
    const materialsList = id("materials-list");
    const materialItems = materialsList.querySelectorAll("li");

    materialItems.forEach(item => {
      const materialName = item.querySelector("h2").textContent.toLowerCase();
      const materialBlurb = item.querySelector("p").textContent.toLowerCase();

      if (materialName.includes(searchTerm) || materialBlurb.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function searchTexturesPage(searchTerm) {
    const texturesList = id("textures-list");
    const textureItems = texturesList.querySelectorAll("li");

    textureItems.forEach(item => {
      const textureName = item.querySelector("h2").textContent.toLowerCase();
      const textureBlurb = item.querySelector("p").textContent.toLowerCase();

      if (textureName.includes(searchTerm) || textureBlurb.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function showPage(pageId) {
    const audio = document.querySelector("audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    previousPageId = currentPageId; // Store current page as previous
    currentPageId = pageId;        // Update current page to the new page

    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.classList.add("hidden");
    });

    const currentPage = id(pageId);
    currentPage.classList.remove("hidden");
  }

  function showPreviousPage() {
    showPage(previousPageId);
  }

  function generateColors() {
    const colorsList = id('colors-list');
    colorsList.innerHTML = '';

    for (const colorName in COLORS) {
      const colorData = COLORS[colorName];
      const listItem = document.createElement('li');
      const article = document.createElement('article');
      article.classList.add("selectable");
      article.dataset.itemType = "color";
      article.dataset.itemName = colorName;
      article.dataset.pageId = "color-detail-page";
      article.setAttribute("role","button");
      article.setAttribute("tabindex", "0");
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
      article.setAttribute("role","button");
      article.setAttribute("tabindex","0");
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
      article.setAttribute("role","button");
      article.setAttribute("tabindex","0");
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
    const description = detailPage.querySelectorAll("p");
    const techniquesList = detailPage.querySelector("ul");
    const availability = detailPage.querySelector("#material-detail-page > section:nth-of-type(3) > p");

    title.textContent = materialName;
    blurb.textContent = materialData.blurb;
    description.textContent = materialData.description;

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
        return;
      }

      listItem.appendChild(article);
      exploreList.appendChild(listItem);
    });
  }

  function populateGallery() {
    const gallery = id('gallery');
    if (!gallery) {
      console.error("Gallery element not found.");
      return;
    }

    gallery.innerHTML = '';

    for (const artworkName in ARTWORK) {
      const artworkData = ARTWORK[artworkName];
      const img = document.createElement('img');
      img.src = `img/${artworkData.image}`;
      img.alt = artworkData.alt;
      img.dataset.itemName = artworkName;
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", showArtworkDetailPage);
      gallery.appendChild(img);
    }
  }

  function showArtworkDetailPage(event) {
    const img = event.currentTarget;
    const artworkName = img.dataset.itemName;
    const artworkData = ARTWORK[artworkName];

    const detailPage = id("artwork-detail-page");
    generateArtworkDetailPageContent(detailPage, artworkData, artworkName);
    checkFavoriteButtonState(detailPage, "artwork", artworkName);
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

  function checkFavoriteButtonState(detailPage, itemType, itemName) {
      const button = detailPage.querySelector(".favorites-button");
      if (!button) return;

      const isFavorite = favorites.some(fav => fav.name === itemName && fav.type === itemType);
      button.textContent = isFavorite? "Remove from Favorites": "Save to Favorites";
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
        itemData = MATERIALS[itemName];
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
      let article;

      switch (favorite.type) {
        case "color":
          article = createFavoriteColorCard(favorite.name, COLORS[favorite.name]);
          break;
        case "material":
          article = createFavoriteTextCard(favorite.name,  MATERIALS[favorite.name], favorite.type);
          break;
        case "texture":
          article = createFavoriteTextCard(favorite.name,  TEXTURES[favorite.name], favorite.type);
          break;
        case "artwork":
          article = createSmallArtworkCard(favorite.name, ARTWORK[favorite.name]);
          break;
      }

      if (article) {
        favoritesList.appendChild(article);
      }
    });

    addFavoriteCardEventListeners();
  }

  function addFavoriteCardEventListeners() {
    const favoriteCards = document.querySelectorAll("#favorite-page.selectable");
    favoriteCards.forEach(card => {
      card.addEventListener("click", handleFavoriteCardClick);
    });
  }

  function handleFavoriteCardClick(event) {
    const card = event.currentTarget;
    const itemType = card.dataset.itemType;
    const itemName = card.dataset.itemName;

    if (itemType === "artwork") {
      showArtworkDetailPage(event);
    } else {
      showDetailPage(event);
    }
  }

  function createSmallColorCard(colorName, colorData) {
    const article = document.createElement("article");
    article.classList.add("small-color-card", "selectable");
    article.dataset.itemType = "color";
    article.dataset.itemName = colorName;
    article.dataset.pageId = "color-detail-page";
    article.addEventListener("click", showDetailPage);
    article.setAttribute("role","button");
    article.setAttribute("tabindex","0");


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
    article.setAttribute("role","button");
    article.setAttribute("tabindex","0");


    const h3 = document.createElement("h3");
    h3.textContent = itemName;
    article.appendChild(h3);

    const blurb = document.createElement("p");
    blurb.textContent = itemData.blurb;
    article.appendChild(blurb);

    return article;
  }


  function createFavoriteColorCard(colorName, colorData) {
    const article = document.createElement("article");
    article.classList.add("favorite-small-color-card", "selectable");
    article.dataset.itemType = "color";
    article.dataset.itemName = colorName;
    article.dataset.pageId = "color-detail-page";
    article.addEventListener("click", showDetailPage);
    article.setAttribute("role","button");
    article.setAttribute("tabindex","0");


    const h3 = document.createElement("h3");
    h3.textContent = colorName;
    article.appendChild(h3);

    const swatch = document.createElement("span");
    swatch.classList.add("small-color-swatch");
    swatch.style.backgroundColor = colorData.hex;
    article.appendChild(swatch);

    return article;
  }

  function createFavoriteTextCard(itemName, itemData, itemType) {
    const article = document.createElement("article");
    article.classList.add("favorite-small-text-card", "selectable");
    article.dataset.itemType = itemType;
    article.dataset.itemName = itemName;
    article.dataset.pageId = `${itemType}-detail-page`;
    article.setAttribute("role","button");
    article.setAttribute("tabindex","0");



    // console.log("HERE", itemType, itemName, article.dataset.pageId);

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
    const img = document.createElement('img');
    img.classList.add("selectable");
    img.setAttribute("role","button");
    img.setAttribute("tabindex","0");


    img.dataset.itemName = artworkName;
    img.addEventListener("click", showArtworkDetailPage);
    img.src = `img/${artworkData.image}`;
    img.alt = artworkData.alt;

    return img;
  }

  function handleFavoritesClick(event){
    if (event.target.textContent === "Save to Favorites" || event.target.textContent === "Remove from Favorites") {
        saveToFavorites(event);
    }
}


  function id(idName) {
    return document.getElementById(idName);
  }
})();