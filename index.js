import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';

import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

import { getFirestore, collection, addDoc, doc, getDocs, setDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

"use strict";

(function() {
  let favorites = []; // Initialize an empty array to store favorites
  let currentPageId = "search-page"; // Initialize with the default home page
  let previousPageId = "search-page"; // Initialize to home page as well, in case of initial back button press\

  // Firebase Configuration this is fine to have here, we'll need to look into security rules though
  const firebaseConfig = {
    apiKey: "AIzaSyDWKcR-dzcwq0PoBwmPVp-Kr-xmYlCah3Q",
    authDomain: "tactileart-cse482a.firebaseapp.com",
    projectId: "tactileart-cse482a",
    storageBucket: "tactileart-cse482a.firebasestorage.app",
    messagingSenderId: "954927873836",
    appId: "1:954927873836:web:c35026dd563a900399f689",
    measurementId: "G-V7SS7LHDZ3"
  };

  let ARTWORK = [];
  let COLORS = [];
  let MATERIALS = [];
  let TEXTURES = [];


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  window.addEventListener("load", init);

  async function init() {
    await getAllData();
    initializeEventListeners();
    populateGallery();
    generateColors();
    generateMaterials();
    generateTextures();
    generateFavoritesPage();
    updateSuggestionForm();
  }

  async function getAllData() {

    COLORS = [];
    MATERIALS = [];
    ARTWORK = [];
    TEXTURES = [];

    const colorsSnapshot = await getDocs(collection(db, "colors"));
    colorsSnapshot.forEach((doc) => {
      COLORS[doc.id] = doc.data();
    });

    const materialsSnapshot = await getDocs(collection(db, "materials"));
    materialsSnapshot.forEach((doc) => {
      MATERIALS[doc.id] = doc.data();
    });

    const artworksSnapshot = await getDocs(collection(db, "artworks"));
    artworksSnapshot.forEach((doc) => {
      ARTWORK[doc.id] = doc.data();
    });

    const texturesSnapshot = await getDocs(collection(db, "textures"));
    texturesSnapshot.forEach((doc) => {
      TEXTURES[doc.id] = doc.data();
    });
  }


  function initializeEventListeners() {
    id("materials-button").addEventListener("click", () => showPage("material-page"));
    id("textures-button").addEventListener("click", () => showPage("texture-page"));
    id("colors-button").addEventListener("click", () => showPage("colors-page"));
    id("favorites-button").addEventListener("click", () => showPage("favorite-page"));
    id("search-button").addEventListener("click", () => processSearchResults(id("home-search")));
    id("upload-artwork-button").addEventListener("click", () => {
      // TODO clear out the form page
      showPage("upload-page");
    });

    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        showPreviousPage();
      });
    });

    // document.addEventListener('click', function(event) {
    //   handleSelectableClick(event);
    // });

    // document.addEventListener('keydown', function(event) {
    //   if (event.key === "Enter" || event.key === " ") {
    //     handleSelectableClick(event);
    //   }
    // });

    // function handleSelectableClick(event){
    //   const selectable = event.currentTarget; // Use event.currentTarget here
    //   if (selectable && !event.target.closest('.back-button')) {
    //     showDetailPage(selectable);
    //   }
    // }

    // Event listener for save to favorites buttons (delegation)
    document.addEventListener('click', function(event) {
      handleFavoritesClick(event);
    });

    document.addEventListener('keydown', function(event) {
      if(event.key === "Enter" && document.activeElement === id("home-search")){
        processSearchResults(id("home-search"));
      } else if (event.key === "Enter" || event.key === " ") { // Space or Enter
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

    // New event listeners for radio buttons
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => {
      radio.addEventListener('change', updateSuggestionForm);
    });
    updateSuggestionForm();
  }

  function processSearchResults(currentElement) {
    updateSearchResults(currentElement.value);
  }

  async function updateSearchResults(searchQuery) {
    id("search-results-search").value = searchQuery;
    let searchResultsArray = await searchDataset(searchQuery);
    generateSearchResults(searchResultsArray);
    showPage("search-result-page");
  }

  async function searchDataset(searchQuery) {
    const results = [];
    await getAllData();
    searchQuery = searchQuery.toLowerCase();

    // Search through ARTWORK
    for (const artwork in ARTWORK) {
      const artworkData = ARTWORK[artwork];
      if (
        artwork.toLowerCase().includes(searchQuery) ||
        artworkData.alt.toLowerCase().includes(searchQuery) ||
        artworkData.description.toLowerCase().includes(searchQuery) ||
        artworkData.notes.artist.toLowerCase().includes(searchQuery) ||
        artworkData.notes.medium.toLowerCase().includes(searchQuery) ||
        artworkData.explore.some(item => item.toLowerCase().includes(searchQuery))
      ) {
        results.push({ type: 'artwork', name: artwork, data: artworkData });
      }
    }

    // Search through COLORS
    for (const color in COLORS) {
      const colorData = COLORS[color];
      if (
        color.toLowerCase().includes(searchQuery) ||
        colorData.description.toLowerCase().includes(searchQuery) ||
        colorData.seen.toLowerCase().includes(searchQuery) ||
        colorData.explore.some(item => item.toLowerCase().includes(searchQuery))
      ) {
        results.push({ type: 'color', name: color, data: colorData });
      }
    }

    // Search through TEXTURES
    for (const texture in TEXTURES) {
      const textureData = TEXTURES[texture];
      if (
        texture.toLowerCase().includes(searchQuery) ||
        textureData.blurb.toLowerCase().includes(searchQuery) ||
        textureData.create.toLowerCase().includes(searchQuery) ||
        textureData.explore.some(item => item.toLowerCase().includes(searchQuery))
      ) {
        results.push({ type: 'texture', name: texture, data: textureData });
      }
    }

    // Search through MATERIALS
    for (const material in MATERIALS) {
      const materialData = MATERIALS[material];
      if (
        material.toLowerCase().includes(searchQuery) ||
        materialData.blurb.toLowerCase().includes(searchQuery) ||
        materialData.description.toLowerCase().includes(searchQuery) ||
        materialData.techniques.some(item => item.toLowerCase().includes(searchQuery)) ||
        materialData.availability.toLowerCase().includes(searchQuery) ||
        materialData.explore.some(item => item.toLowerCase().includes(searchQuery))
      ) {
        results.push({ type: 'material', name: material, data: materialData });
      }
    }

    return results;
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

  function generateSearchResults(searchResults) {
    const resultsList = document.querySelector("#search-result-page ul");
    resultsList.innerHTML = ""; // Clear previous results

    searchResults.forEach(result => {
      const listItem = document.createElement("li");
      let resultCard = document.createElement("button");
      resultCard.classList.add("selectable"); // Make the card selectable
      resultCard.dataset.itemType = result.type;
      resultCard.dataset.itemName = result.name;

      if (result.type === "artwork") {
        resultCard.classList.add("search-result-card-artwork");
        resultCard.dataset.pageId = "artwork-detail-page"; // Set the correct page ID

        const img = document.createElement("img");
        img.src = `img/${result.data.image}`;
        img.alt = result.data.alt;
        resultCard.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = result.name;
        resultCard.appendChild(title);

        const artist = document.createElement("p");
        artist.textContent = `by ${result.data.notes.artist}`;
        resultCard.appendChild(artist);

      } else if (result.type === "color") {
        resultCard.classList.add("search-result-card-color");
        resultCard.dataset.pageId = "color-detail-page"; // Set the correct page ID

        const title = document.createElement("h3");
        title.textContent = result.name;
        resultCard.appendChild(title);

        const swatch = document.createElement("span");
        swatch.classList.add("color-swatch");
        swatch.style.backgroundColor = result.data.hex;
        resultCard.appendChild(swatch);

        const description = document.createElement("p");
        description.textContent = result.data.description;
        resultCard.appendChild(description);

      } else if (result.type === "texture") {
        resultCard.classList.add("search-result-card-text");
        resultCard.dataset.pageId = "texture-detail-page"; // Set the correct page ID

        const title = document.createElement("h3");
        title.textContent = result.name;
        resultCard.appendChild(title);

        const blurb = document.createElement("p");
        blurb.textContent = result.data.blurb;
        resultCard.appendChild(blurb);

      } else if (result.type === "material") {
        resultCard.classList.add("search-result-card-text");
        resultCard.dataset.pageId = "material-detail-page"; // Set the correct page ID

        const title = document.createElement("h3");
        title.textContent = result.name;
        resultCard.appendChild(title);

        const blurb = document.createElement("p");
        blurb.textContent = result.data.blurb || result.data.description; // Use blurb or description if blurb is not available
        resultCard.appendChild(blurb);
      }

      resultCard.addEventListener("click", showDetailPage); // Add event listener to the card
      listItem.appendChild(resultCard);
      resultsList.appendChild(listItem);
    });
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


  function updateSuggestionForm() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const formSection = document.querySelector('form');
    const suggestionCategorySpan = id("user-form-suggestion-category");
    const helpText = id("user-form-suggestion-help-text");

    // Clear the form section
    formSection.innerHTML = ''; // It's okay to use innerHTML here to clear the form

    // Update the displayed category
    suggestionCategorySpan.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

    // Update help text and form fields based on the selected category
    switch (selectedCategory) {
      case 'material':
        helpText.textContent = "Help others understand the materials used in this artwork or share what you used to recreate it.";
        createMaterialForm(formSection);
        break;
      case 'texture':
        helpText.textContent = "Help others understand the textures used in this artwork or share what you used to recreate it.";
        createTextureForm(formSection);
        break;
      case 'idea': // Assuming 'idea' maps to 'artwork' in your comments
        helpText.textContent = "Help others explore artistic connections by suggesting a related artwork. Share how it connects, whether through style, theme, history, or technique.";
        createArtworkForm(formSection);
        break;
      case 'interpretation':
        helpText.textContent = "Share your perspective on this section of the artwork. Whether it's symbolism, artistic choices, or a creative re-imagining, your insights can help others see it in new ways.";
        createInterpretationForm(formSection);
        break;
    }
  }

  function createMaterialForm(formSection) {
    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing material or add a new one.");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this material appear to this section, or how did you recreate it?", "Describe how you think it was used, how you used it, or how it could be used to recreate an element. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createTextureForm(formSection) {
    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing texture or add a new one.");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this texture appear to this section, or how did you recreate it?", "Describe how the texture contributes to the artwork, or how you replicated it in a version. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createArtworkForm(formSection) {
    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing artwork or add a new one.");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this artwork connect to this section?", "Describe how the suggested artwork connects thematically, stylistically, or historically. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createInterpretationForm(formSection) {
    const guidingQuestions = document.createElement("h3");
    guidingQuestions.textContent = "Guiding Questions (optional):";
    formSection.appendChild(guidingQuestions);

    const questionList = document.createElement("ul");
    const questions = [
      "What artistic choices or symbolism stand out in this section?",
      "How do you interpret this part of the artwork?",
      "If you were to reimagine or alter it, what would you change or emphasize?",
      "Does this section remind you of a different artistic style or concept?"
    ];
    questions.forEach(question => {
      const listItem = document.createElement("li");
      listItem.textContent = question;
      questionList.appendChild(listItem);
    });
    formSection.appendChild(questionList);

    const explanationSection = createTextAreaSection("explanation", "Use the guiding questions as an optional reference and answer below.", "Describe how the suggested artwork connects thematically, stylistically, or historically. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createInputSection(id, labelText, type, placeholder) {
    const section = document.createElement("section");
    section.classList.add("input-group");

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    section.appendChild(label);

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    section.appendChild(input);

    return section;
  }

  function createTextAreaSection(id, question, describe) {
    const section = document.createElement("section");
    section.classList.add("input-group");


    const questionElement = document.createElement("h3");
    questionElement.textContent = question;
    section.appendChild(questionElement);

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = describe;
    section.appendChild(label);

    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.placeholder = "Start typing here...";
    section.appendChild(textarea);

    return section;
  }


  function id(idName) {
    return document.getElementById(idName);
  }
})();