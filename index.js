import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';

import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

import { getFirestore, collection, addDoc, doc, getDocs, setDoc, updateDoc, runTransaction } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

"use strict";

(function() {
  let favorites = []; // Initialize an empty array to store favorites

  let pageHistory = [];
  let currentPageIndex = 0;

  let currentPageId = "search-page"; // Initialize with the default home page

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

  let currentSearchResults = [];
  let currentFilterResults = [];


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
    await updateSuggestionForm();
  }

  async function getAllData() {

    COLORS = [];
    MATERIALS = [];
    ARTWORK = [];
    TEXTURES = [];

    const colorsSnapshot = await getDocs(collection(db, "colors"));
    colorsSnapshot.forEach((doc) => {
      COLORS[doc.id] = doc.data();
      COLORS[doc.id].title = doc.id; // TODO change this lol, make the title in the object in addition as the key, tbh it as the key might be bad but oh well
      COLORS[doc.id].category = "colors";
    });

    const materialsSnapshot = await getDocs(collection(db, "materials"));
    materialsSnapshot.forEach((doc) => {
      MATERIALS[doc.id] = doc.data();
      MATERIALS[doc.id].title = doc.id;
      MATERIALS[doc.id].category = "materials";
    });

    const artworksSnapshot = await getDocs(collection(db, "artworks"));
    artworksSnapshot.forEach((doc) => {
      ARTWORK[doc.id] = doc.data();
      ARTWORK[doc.id].title = doc.id;
      ARTWORK[doc.id].category = "artworks";
    });

    const texturesSnapshot = await getDocs(collection(db, "textures"));
    texturesSnapshot.forEach((doc) => {
      TEXTURES[doc.id] = doc.data();
      TEXTURES[doc.id].title = doc.id;
      TEXTURES[doc.id].category = "textures"
    });
  }


  async function initializeEventListeners() {
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

    const checkboxes = document.querySelectorAll('#search-result-filters input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', filterSearchResults);
    });

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
    submitButton.addEventListener('click', (event) => {
      processSuggestionForm(event);
      userSuggestionPopup.showModal();
    });

    closeButton.addEventListener('click', () => {
      userSuggestionPopup.close();
    });

    let button = document.getElementById("image-segmentation-button");
    console.log("Found button?", button); // DEBUG
    if (button) {
      button.addEventListener("click", () => {
        console.log("Clicked Interact with Artwork button"); // DEBUG
        updateInteractWithArtworkPage();
      });
    } else {
      console.warn("image-segmentation-button not found in the DOM!");
    }

    // New event listeners for radio buttons
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => {
      radio.addEventListener('change', async () => {await updateSuggestionForm()});
    });
    await updateSuggestionForm();

    // TODO: added temporarily for testing
    /*
    document.getElementById("image-segmentation-button").addEventListener("click", function() {
      // Get the artwork detail page
      const detailPage = id("segment-detail-page");

      // Manually set up an artwork image for testing
      const imageElement = document.createElement("img");
      imageElement.src = "img/1.jpg";  // Use any image from your img folder
      imageElement.alt = "Test artwork";

      const imageContainer = detailPage.querySelector(".artwork-image-container");
      if (imageContainer) {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(imageElement);
      }

      const titleElement = detailPage.querySelector("h1");
      if (titleElement) {
        titleElement.textContent = "Test Artwork";
      }

      setTimeout(() => {
        if (window.segmentation && typeof window.segmentation.init === 'function') {
          window.segmentation.init("test-artwork", imageElement);
        } else {
          console.error("Segmentation module not loaded properly");
        }
      }, 500);
    });
    let button = document.getElementById("image-segmentation-button");
    if (button) {
      button.addEventListener("click", () => {
        console.log("Clicked Interact with Artwork button");
        updateInteractWithArtworkPage();
      });
    }
    */
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

  function filterSearchResults() {
    const checkboxes = document.querySelectorAll('#search-result-filters input[type="checkbox"]');
    const selectedFilters = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    if (selectedFilters.length === 0) {
      // No filters selected, show all results
      currentFilterResults = currentSearchResults;
    } else {
      currentFilterResults = currentSearchResults.filter(result => {
        return selectedFilters.includes(result.type);
      });
    }

    // Regenerate the search results list with the filtered results
    generateSearchResults(currentFilterResults);
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

    currentSearchResults = results;
    return results;
  }

  function showPage(pageId, isPrevious) {
    console.log("showPage called with:", pageId);
    console.log("Before hiding pages, currentPageId is", currentPageId);

    const audio = document.querySelector("audio");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    let previousPageId = currentPageId; //store the previous page id before changing it.
    currentPageId = pageId; //update the current page id first.

    console.log(previousPageId);

    if (!isPrevious) {
      if (previousPageId.includes("detail-page")) {
          pageHistory.push({"id": previousPageId, "data": JSON.parse(id(previousPageId).dataset.previous)});
      } else {
          pageHistory.push({"id": previousPageId});
      }
      currentPageIndex = pageHistory.length - 1;
  } else {
      currentPageIndex--;

      // Trim the history array to the current index, removing "forward" history.
      pageHistory = pageHistory.slice(0, currentPageIndex + 1);
  }

  console.log(pageHistory, currentPageIndex);


    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.classList.add("hidden");
    });

    const currentPage = id(pageId);
    currentPage.classList.remove("hidden");
    console.log("After unhide, new current page is:", pageId);
  }

  function showPreviousPage() {
    if (pageHistory.length > 0) {
      const previousPage = pageHistory[currentPageIndex];
      // currentPageId = previousPage.id; // No need for a separate content object

      console.log("showPreviousPage", previousPage);

      // Restore the content based on the page ID and dataset information
      if (previousPage.id.includes('-detail-page')) {

        const itemType = previousPage.data.itemType;
        const itemName = previousPage.data.itemName;

        switch (itemType) {
          case "artworks":
            generateArtworkDetailPageContent(id(previousPage.id), ARTWORK[itemName], itemName);
            break;
          case "colors":
            generateColorDetailPageContent(id(previousPage.id), COLORS[itemName], itemName);
            break;
          case "materials":
            generateMaterialDetailPageContent(id(previousPage.id), MATERIALS[itemName], itemName);
            break;
          case "textures":
            generateTextureDetailPageContent(id(previousPage.id), TEXTURES[itemName], itemName);
            break;
        }
      }

      showPage(previousPage.id, true);
    } else {
      console.log("No history to go back to.");
    }
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

    // console.log("show dp", article, itemType, itemName, pageId, detailPage);

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
      case "artwork":
        generateArtworkDetailPageContent(detailPage, ARTWORK[itemName], itemName);
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

    let previousData = {
      id: detailPage.id,
      itemName: detailPage.dataset.itemName || null,
      itemType: detailPage.dataset.itemType || null,
    }

    detailPage.dataset.previous = JSON.stringify(previousData);
    detailPage.dataset.itemName = colorName;
    detailPage.dataset.itemType = "colors";


    title.textContent = colorName;
    swatch.style.backgroundColor = colorData.hex;
    hue.textContent = colorData.description;
    seen.textContent = colorData.seen;
    hexCode.textContent = `Hex code: ${colorData.hex}`;

    const communitySuggestionsList = id("color-detail-page").querySelector(".community-suggestions-list ul");
    generateSuggestionsList(communitySuggestionsList, colorData.suggestions, colorData);
    // generateExploreFurtherList(exploreList, colorData.explore);

    // const exploreList = id("color-detail-page").querySelector(".explore-more ul");
    // generateExploreFurtherList(exploreList, colorData.explore);
  }

  function generateMaterialDetailPageContent(detailPage, materialData, materialName) {
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p");
    const description = detailPage.querySelectorAll("p");
    const techniquesList = detailPage.querySelector("ul");
    const availability = detailPage.querySelector("#material-detail-page > section:nth-of-type(3) > p");

    let previousData = {
      id: detailPage.id,
      itemName: detailPage.dataset.itemName,
      itemType: detailPage.dataset.itemType,
    }

    detailPage.dataset.previous = JSON.stringify(previousData);
    detailPage.dataset.itemName = materialName;
    detailPage.dataset.itemType = "materials";

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

    // const exploreList = id("material-detail-page").querySelector(".explore-more ul");
    // generateExploreFurtherList(exploreList, materialData.explore);

    const communitySuggestionsList = id("material-detail-page").querySelector(".community-suggestions-list ul");
    generateSuggestionsList(communitySuggestionsList, materialData.suggestions, materialData);
  }


  function generateTextureDetailPageContent(detailPage, textureData, textureName) {
    const title = detailPage.querySelector("h1");
    const blurb = detailPage.querySelector("p");
    const description = detailPage.querySelector("#texture-detail-content > p");

    title.textContent = textureName;
    blurb.textContent = textureData.blurb;
    description.textContent = textureData.create;

    let previousData = {
      id: detailPage.id,
      itemName: detailPage.dataset.itemName || null,
      itemType: detailPage.dataset.itemType || null,
    }

    detailPage.dataset.previous = JSON.stringify(previousData);
    detailPage.dataset.itemName = textureName;
    detailPage.dataset.itemType = "textures";


    const communitySuggestionsList = id("texture-detail-page").querySelector(".community-suggestions-list ul");
    generateSuggestionsList(communitySuggestionsList, textureData.suggestions, textureData);
  }

  function generateSuggestionsList(suggestionListElement, suggestionDataObject, data) {
    suggestionListElement.innerHTML = "";

    const addSuggestionLi = document.createElement("li");
    const addSuggestionSection = document.createElement("section");
    addSuggestionSection.classList.add("suggestion-card-add", "selectable");
    addSuggestionSection.addEventListener("click", () => showSuggestionForm(data));

    const addSuggestionH3 = document.createElement("h3");
    addSuggestionH3.textContent = "Add your own suggestion";
    addSuggestionLi.appendChild(addSuggestionSection);
    addSuggestionSection.appendChild(addSuggestionH3);
    suggestionListElement.appendChild(addSuggestionLi);

    // console.log(suggestionItems);
    let suggestionDataList = Object.values(suggestionDataObject);

    suggestionDataList.sort(function(a,b) {
      let aScore = Number(a.metadata.likes) - Number(a.metadata.dislikes);
      let bScore = Number(b.metadata.likes) - Number(b.metadata.dislikes);
      return bScore-aScore;
    });

    for (let suggestionData of suggestionDataList) {
      let card = generateSuggestionCard(suggestionData);
      card.addEventListener("click", () => { showSuggestionPopupData(suggestionListElement, suggestionData, card) });
      suggestionListElement.appendChild(card);
    }
  }

  function showSuggestionPopupData(suggestionListElement, suggestionData, suggestionCard) {
    let detailPage = suggestionListElement.parentElement.parentElement;

    let dialog = detailPage.querySelector("dialog");

    let cardVoteContainer = suggestionCard.querySelector(".vote-container");
    let cardUpvoteButton = suggestionCard.querySelector(".upvote-button");
    let cardDownvoteButton = suggestionCard.querySelector(".downvote-button");


    let dialogVoteContainer = suggestionCard.querySelector(".vote-container").cloneNode(true);
    let dialogUpvoteButton = dialogVoteContainer.querySelector(".upvote-button");
    let dialogDownvoteButton = dialogVoteContainer.querySelector(".downvote-button");

    dialogUpvoteButton.addEventListener("click", () => {
      handleUpvote(suggestionData, dialogVoteContainer, dialogUpvoteButton, dialogDownvoteButton, cardVoteContainer);
    });

    dialogDownvoteButton.addEventListener("click", () => {
      handleDownvote(suggestionData, dialogVoteContainer, dialogUpvoteButton, dialogDownvoteButton, cardVoteContainer);
    });

    if (dialog != null) {
      dialog.remove();
    }

    let newDialog = document.createElement("dialog");
    newDialog.classList.add("community-suggestion-popup");

    // Create elements for the dialog
    let h2New = document.createElement("h2");
    let closeButton = document.createElement("button");
    let closeButtonImg = document.createElement("img");
    let sectionNew = document.createElement("section");
    let learnMoreButton = document.createElement("button");

    // Set attributes and content
    closeButton.classList.add("close-button");
    closeButtonImg.src = "icons/x-symbol.svg";
    closeButtonImg.alt = "close button x symbol icon";
    learnMoreButton.classList.add("learn-more-button");
    learnMoreButton.textContent = "Learn More";

    closeButton.appendChild(closeButtonImg);

    let voteContainerElement = dialogVoteContainer || generateVoteContainer(suggestionData);

    newDialog.appendChild(h2New);
    newDialog.appendChild(closeButton);
    newDialog.appendChild(sectionNew);

    if (suggestionData.category !== "interpretation") {
      newDialog.appendChild(learnMoreButton);
    }

    newDialog.appendChild(voteContainerElement);
    detailPage.appendChild(newDialog);
    dialog = newDialog;

    learnMoreButton.addEventListener("click", () =>{
      processLearnMoreButton(suggestionData);
      dialog.close();
    });

    // Populate the dialog with suggestionData
    let h2 = dialog.querySelector("h2");
    let section = dialog.querySelector("section");
    section.innerHTML = ''; // Clear previous content

    if (suggestionData.itemTitle) {
      h2.textContent = suggestionData.itemTitle;
    } else if (suggestionData.category === "interpretation") {
      h2.textContent = "Interpretation";
    }

    if (suggestionData.category == "artwork") {
      let artworkData = ARTWORK[suggestionData.itemTitle];
      let img = document.createElement("img");
      img.src = `img/${artworkData.image}`;
      img.alt = artworkData.alt;
      section.appendChild(img);
    }

    if (suggestionData.artist) {
        let artistP = document.createElement("p");
        artistP.textContent = suggestionData.artist;
        section.appendChild(artistP);
    }

    if (suggestionData.context) {
        let descriptionP = document.createElement("p");
        descriptionP.textContent = suggestionData.context;
        section.appendChild(descriptionP);
    }

    const outsideDialogClickListener = (event) => {
      if (dialog.open) {
        const dialogRect = dialog.getBoundingClientRect();

        if (
          event.clientX < dialogRect.left ||
          event.clientX > dialogRect.right ||
          event.clientY < dialogRect.top ||
          event.clientY > dialogRect.bottom
        ) {
          dialog.close();
          document.removeEventListener('click', outsideDialogClickListener);
        }
      }
    };

    // // Add event listener to close button
    dialog.querySelector(".close-button").addEventListener("click", () => {
      dialog.close();
    });

    document.addEventListener('click', outsideDialogClickListener);
    dialog.showModal();
  }

  function processLearnMoreButton(suggestionData) {
    let itemName = suggestionData.itemTitle;
    let category = suggestionData.category;

    // console.log(suggestionData);

    let data;

    if (category === "artworks") {
      category = "artwork";
    }

    if (category === "material") {
      data = MATERIALS[itemName];
    } else if (category === "color") {
      data = COLORS[itemName];
    } else if (category === "texture") {
      data = TEXTURES[itemName];
    } else if (category === "artwork") {
      data = ARTWORK[itemName];
    }


    const pageId = `${category}-detail-page`;
    const detailPage = id(pageId);
    // console.log(itemName);
    // console.log("show dp", article, itemType, itemName, pageId, detailPage);

    switch (category) {
      case "color":
        generateColorDetailPageContent(detailPage, COLORS[itemName], itemName);
        break;
      case "material":
        generateMaterialDetailPageContent(detailPage, MATERIALS[itemName], itemName);
        break;
      case "texture":
        generateTextureDetailPageContent(detailPage, TEXTURES[itemName], itemName);
        break;
      case "artwork":
        generateArtworkDetailPageContent(detailPage, ARTWORK[itemName], itemName);
    }

    // console.log(pageId, detailPage);
    checkFavoriteButtonState(detailPage, category, itemName);
    showPage(pageId);

    // showArtworkDetailPage();
    // console.log(suggestionData);
  }

  function generateSuggestionCard(data) {
    let category = data.category;
    let listItem = document.createElement("li");
    let suggestionCard = document.createElement("section");
    suggestionCard.classList.add("selectable");

    let title = document.createElement("h3");
    title.textContent = data.itemTitle;

    let context = document.createElement("p");
    context.textContent = data.context;

    let cornerIcon = document.createElement("i");
    let iconImg = document.createElement("img");
    cornerIcon.appendChild(iconImg);
    iconImg.alt = "placeholder";
    iconImg.classList.add("corner-icon");

    let voteContainer = generateVoteContainer(data);

    if (category === "material") {
        suggestionCard.classList.add("suggestion-card-material");
        iconImg.src = "icons/material.svg";
    } else if (category === "color") {
        suggestionCard.classList.add("suggestion-card-color");
        let colorSwatch = document.createElement("span");
        colorSwatch.classList.add("suggestion-color-swatch");
        colorSwatch.style.backgroundColor = data.itemTitle;
        suggestionCard.appendChild(colorSwatch);
        iconImg.src = "icons/color.svg";
    } else if (category === "interpretation") {
        title.textContent = "Interpretation";
        suggestionCard.classList.add("suggestion-card-interpretation");
        iconImg.src = "icons/interpretation.svg";
    } else if (category === "texture") {
        suggestionCard.classList.add("suggestion-card-texture");
        iconImg.src = "icons/texture.svg";
    } else if (category === "artwork") {
        suggestionCard.classList.add("suggestion-card-artwork");
        let artworkData = ARTWORK[data.itemTitle];
        let artworkImg = document.createElement("img");
        artworkImg.src = `img/${artworkData.image}` || "img/placeholder.jpg";
        artworkImg.alt = artworkData.alt;
        suggestionCard.appendChild(artworkImg);

        let artistPara = document.createElement("p");
        artistPara.textContent = "by " + artworkData.notes.artist;
        suggestionCard.appendChild(artistPara);
        iconImg.src = "icons/artwork.svg";
    }

    suggestionCard.appendChild(title);
    suggestionCard.appendChild(context);
    suggestionCard.appendChild(cornerIcon);
    suggestionCard.appendChild(voteContainer);

    listItem.appendChild(suggestionCard);
    return listItem;
  }

  function showSuggestionForm(data) {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const suggestionCategorySpan = id("user-form-suggestion-category");
    const helpText = id("user-form-suggestion-help-text");

    // Update the displayed category
    suggestionCategorySpan.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

    // Update help text based on the selected category
    switch (selectedCategory) {
      case 'material':
        helpText.textContent = "Help others understand the materials used in this artwork or share what you used to recreate it.";
        break;
      case 'texture':
        helpText.textContent = "Help others understand the textures used in this artwork or share what you used to recreate it.";
        break;
      case 'idea':
        helpText.textContent = "Help others explore artistic connections by suggesting a related artwork. Share how it connects, whether through style, theme, history, or technique.";
        break;
      case 'interpretation':
        helpText.textContent = "Share your perspective on this section of the artwork. Whether it's symbolism, artistic choices, or a creative re-imagining, your insights can help others see it in new ways.";
        break;
    }

    // Update artwork data from the passed-in data parameter
    const artworkData = data;
    id("user-suggestion-form").dataset.data = JSON.stringify(data);
    id("user-suggestion-title").textContent = artworkData.title; // You might need to adjust this if the artwork name is dynamic
    id("user-suggestion-image").src = `img/${artworkData.image}`;
    id("user-suggestion-image").alt = artworkData.alt;

    showPage("user-suggestion-page");
  }

  async function processSuggestionForm(event) {
    // console.log(event);

    if (validateSuggestionForm()) {
      // check form and display message
      return;
    }

    event.preventDefault();

    let input = document.querySelector("#user-suggestion-form input");
    let textarea = document.querySelector("#user-suggestion-form textarea");
    let suggestionCategory = id("user-suggestion-form").dataset.type;
    let recipientData = JSON.parse(id("user-suggestion-form").dataset.data);

    let suggestionData = {
      category: suggestionCategory,
      metadata: {
        likes: 0,
        dislikes: 0,
        timestamp: new Date().getTime()
      },
      recipient: {
        title: recipientData.title,
        category: recipientData.category,
      }
    }

    if (input) {
      suggestionData.itemTitle = input.value;
    }

    if (textarea) {
      suggestionData.context = textarea.value;
    }



    //submit data

    console.log("recipientReference", db, recipientData.category, recipientData.title);
    const recipientReference = doc(db, recipientData.category, recipientData.title);

    try {
      await runTransaction(db, async (transaction) => {
        const recipientDoc = await transaction.get(recipientReference);
        if (!recipientDoc.exists()) {
          throw "Document does not exist!";
        }

        const newSuggestionsList = Object.values(recipientDoc.data().suggestions);
        newSuggestionsList.push(suggestionData);

        // Convert the array back to an object
        const newSuggestionsObject = {};
        newSuggestionsList.forEach((suggestion, index) => {
          newSuggestionsObject[index] = suggestion;
        });

        transaction.update(doc(db, recipientData.category, recipientData.title), { suggestions: newSuggestionsObject });
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }


  }

  function validateSuggestionForm() {
    return false;
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

  function updateInteractWithArtworkPage() {
    console.log("updateInteractWithArtworkPage called"); // DEBUG

    let title = id("artwork-detail-page").querySelector("h1").textContent;
    console.log("Artwork title from detail page:", title);

    let data = ARTWORK[title];
    console.log("Data for that title from ARTWORK object:", data);

    console.log(data);

    window.MATERIALS = MATERIALS;
    window.COLORS = COLORS;
    window.TEXTURES = TEXTURES;
    window.ARTWORK = ARTWORK;

    // Setup segment detail page
    const segmentDetailPage = id("segment-detail-page");
    const titleElement = segmentDetailPage.querySelector("h1");
    titleElement.innerHTML = `Interact with: <br> ${title}`;

    const detailPage = id("artwork-detail-page");
    const artworkImage = detailPage.querySelector(".artwork-image-container img");
    const canvasContainer = segmentDetailPage.querySelector(".canvas-container");

    if (canvasContainer && artworkImage) {
      canvasContainer.innerHTML = ''; // Clear previous content
      const imgCopy = document.createElement('img');
      imgCopy.src = artworkImage.src;
      imgCopy.alt = artworkImage.alt;
      imgCopy.className = "segmentation-source-image";
      canvasContainer.appendChild(imgCopy);
    }

    console.log("Navigating to segment-detail-page now");
    showPage("segment-detail-page");

    // Initialize segmentation after showing the page
    setTimeout(() => {
      const sourceImage = segmentDetailPage.querySelector(".segmentation-source-image") || artworkImage;
      if (sourceImage) {
        if (sourceImage.complete) {
          window.segmentation.init(title, sourceImage);
        } else {
          sourceImage.onload = () => {
            window.segmentation.init(title, sourceImage);
          };
        }
      }
    }, 100); // Short delay to ensure page is visible
  }

  function generateArtworkDetailPageContent(detailPage, artworkData, artworkName) {
    console.log("Generating artwork detail page for:", artworkName);
    console.log("Artwork data:", artworkData);
    console.log("Detail page element:", detailPage);


    let previousData = {
      id: detailPage.id,
      itemName: detailPage.dataset.itemName || null,
      itemType: detailPage.dataset.itemType || null,
    }

    detailPage.dataset.previous = JSON.stringify(previousData);
    detailPage.dataset.itemName = artworkName;
    detailPage.dataset.itemType = "artworks";

    const title = detailPage.querySelector("h1");
    const artistYear = detailPage.querySelector("header > section > p");

    /*const image = detailPage.querySelector(".artwork-image-container img");
    console.log("Image element found:", image);*/
    const imageContainer = detailPage.querySelector(".artwork-image-container");
    let image = imageContainer ? imageContainer.querySelector("img") : null;
    if (!image && imageContainer) {
      image = document.createElement("img");
      imageContainer.appendChild(image);
    }

    console.log("Image element found or created:", image);

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

    const communitySuggestionsList = id("artwork-detail-page").querySelector(".community-suggestions-list ul");
    generateSuggestionsList(communitySuggestionsList, artworkData.suggestions, artworkData);
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


  async function updateSuggestionForm() {

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

    id("user-suggestion-form").dataset.type = "material";

    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing material or add a new one.", "material");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this material appear to this section, or how did you recreate it?", "Describe how you think it was used, how you used it, or how it could be used to recreate an element. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createTextureForm(formSection) {

    id("user-suggestion-form").dataset.type = "texture";

    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing texture or add a new one.", "texture");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this texture appear to this section, or how did you recreate it?", "Describe how the texture contributes to the artwork, or how you replicated it in a version. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createArtworkForm(formSection) {

    id("user-suggestion-form").dataset.type = "artwork";

    const suggestionSection = createInputSection("suggestion", "What are you suggesting?", "text", "Start typing to find an existing artwork or add a new one.", "artwork");
    formSection.appendChild(suggestionSection);

    const explanationSection = createTextAreaSection("explanation", "How does this artwork connect to this section?", "Describe how the suggested artwork connects thematically, stylistically, or historically. (150 words max)");
    formSection.appendChild(explanationSection);
  }

  function createInterpretationForm(formSection) {

    id("user-suggestion-form").dataset.type = "interpretation";

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

  function createInputSection(id, labelText, type, placeholder, category) {
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
    input.setAttribute("list", `${type}-suggestion-options`);

    const datalist = document.createElement("datalist");
    datalist.id = `${type}-suggestion-options`;

    let dataListContent = [];
    if (category === "color") {
        dataListContent = Object.values(COLORS);
    } else if (category === "material") {
        dataListContent = Object.values(MATERIALS);
    } else if (category === "texture") {
        dataListContent = Object.values(TEXTURES);
    } else if (category === "artwork") {
        dataListContent = Object.values(ARTWORK);
    }

    for (let item of dataListContent) {
      if (item && item.title) {
        const option = document.createElement("option");
        option.value = item.title;
        datalist.appendChild(option);
      }
    }

    section.appendChild(input);
    section.appendChild(datalist);
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

  function generateVoteContainer(data) {
    let voteContainer = document.createElement("section");

    let upvoteButton = document.createElement("button");
    let upvoteImg = document.createElement("img");

    let downvoteButton = document.createElement("button");
    let downvoteImg = document.createElement("img");

    let likeAmountElement = document.createElement("p");

    voteContainer.classList.add("vote-container");

    upvoteButton.classList.add("upvote-button");
    upvoteImg.src = "icons/upvote.svg";
    upvoteImg.alt = "PLACEHOLDER";

    // check the state somehow?? TODO
    // if already pressed

    upvoteButton.setAttribute("aria-pressed", "false");


    downvoteButton.classList.add("downvote-button");
    downvoteImg.src = "icons/downvote.svg";
    downvoteImg.alt = "PLACEHOLDER";

    downvoteButton.setAttribute("aria-pressed", "false");

    upvoteButton.appendChild(upvoteImg);
    upvoteButton.appendChild(likeAmountElement);

    downvoteButton.appendChild(downvoteImg);

    likeAmountElement.textContent = Number(data.metadata.likes) - Number(data.metadata.dislikes);

    upvoteButton.addEventListener("click", (event) => {
      handleUpvote(data, voteContainer, upvoteButton, downvoteButton);
      event.stopPropagation();
    });

    downvoteButton.addEventListener("click", (event) => {
      handleDownvote(data, voteContainer, upvoteButton, downvoteButton);
      event.stopPropagation();
    });

    voteContainer.appendChild(upvoteButton);
    voteContainer.appendChild(downvoteButton);
    return voteContainer;
  }

  async function handleUpvote(data, voteContainer, upvoteButton, downvoteButton, dialogVoteContainer) {
    updateVoteButtonState(voteContainer, upvoteButton, downvoteButton, true);
    updateVoteLikesDisplay(voteContainer, upvoteButton, downvoteButton);
    updateVoteData(data, true, false);

    if (dialogVoteContainer) {
      updateVoteButtonState(dialogVoteContainer, dialogVoteContainer.querySelector(".upvote-button"), dialogVoteContainer.querySelector(".downvote-button"), true);
      updateVoteLikesDisplay(dialogVoteContainer, dialogVoteContainer.querySelector(".upvote-button"), dialogVoteContainer.querySelector(".downvote-button"));
    }
  }

  async function handleDownvote(data, voteContainer, upvoteButton, downvoteButton, dialogVoteContainer)  {
    updateVoteButtonState(voteContainer, upvoteButton, downvoteButton, false);
    updateVoteLikesDisplay(voteContainer, upvoteButton, downvoteButton);
    updateVoteData(data, false, false);

    if (dialogVoteContainer) {
      updateVoteButtonState(dialogVoteContainer, dialogVoteContainer.querySelector(".upvote-button"), dialogVoteContainer.querySelector(".downvote-button"), false);
      updateVoteLikesDisplay(dialogVoteContainer, dialogVoteContainer.querySelector(".upvote-button"), dialogVoteContainer.querySelector(".downvote-button"));
    }
  }

  function updateVoteButtonState(voteContainer, upvoteButton, downvoteButton, isUpvote, likesDisplay) {
    let buttonElement = isUpvote ? upvoteButton : downvoteButton;
    let otherButton = isUpvote ? downvoteButton : upvoteButton;

    let isCurrentlyPressed = buttonElement.dataset.pressed === 'true';
    let newPressedState = isCurrentlyPressed ? 'false' : 'true';
    let otherPressedState = otherButton.dataset.pressed === 'true';

    let upvoteImage = upvoteButton.querySelector("img");
    let downvoteImage = downvoteButton.querySelector("img");

    if (isUpvote) {
      upvoteImage.src = isCurrentlyPressed ? "icons/upvote.svg" : "icons/upvote-pressed.svg";
      downvoteImage.src = otherPressedState ? "icons/downvote.svg" : "icons/downvote.svg";
    } else {
      downvoteImage.src = isCurrentlyPressed ? "icons/downvote.svg" : "icons/downvote-pressed.svg";
      upvoteImage.src = otherPressedState ? "icons/upvote.svg" : "icons/upvote.svg";
    }

    voteContainer.classList.toggle("upvote-pressed", isUpvote && newPressedState === 'true');
    voteContainer.classList.toggle("downvote-pressed", !isUpvote && newPressedState === 'true');

    buttonElement.setAttribute('aria-pressed', newPressedState);
    otherButton.setAttribute('aria-pressed', 'false');

    buttonElement.dataset.pressed = newPressedState;
    otherButton.dataset.pressed = 'false';
  }

  function updateVoteLikesDisplay(voteContainer, upvoteButton, downvoteButton) {
    let likesDisplay = voteContainer.querySelector("p");
    let upvotePressed = upvoteButton.getAttribute('aria-pressed') === 'true';
    let downvotePressed = downvoteButton.getAttribute('aria-pressed') === 'true';
    let currentLikes = parseInt(likesDisplay.textContent) || 0;

    // Store the previous state in the voteContainer's dataset
    let prevUpvotePressed = voteContainer.dataset.upvotePressed === 'true';
    let prevDownvotePressed = voteContainer.dataset.downvotePressed === 'true';

    if (upvotePressed && !prevUpvotePressed && !downvotePressed) {
      likesDisplay.textContent = currentLikes + 1;
    } else if (!upvotePressed && downvotePressed && !prevDownvotePressed) {
      likesDisplay.textContent = currentLikes - 1;
    } else if (!upvotePressed && !downvotePressed && (prevUpvotePressed || prevDownvotePressed)) {
      // Resetting to the original state
      likesDisplay.textContent = currentLikes - (prevUpvotePressed ? 1 : 0) + (prevDownvotePressed ? 1 : 0);
    }

    // Update the previous state
    voteContainer.dataset.upvotePressed = upvotePressed;
    voteContainer.dataset.downvotePressed = downvotePressed;
  }

  async function updateVoteData(data, isLiking, isUndoing) {

    const recipientReference = doc(db, data.recipient.category, data.recipient.title);

    try {
      await runTransaction(db, async (transaction) => {
        const recipientDoc = await transaction.get(recipientReference);
        if (!recipientDoc.exists()) {
          throw "Document does not exist!";
        }

        const suggestionsList = Object.values(recipientDoc.data().suggestions)

        let timestamp = data.metadata.timestamp;

        const suggestionIndex = suggestionsList.findIndex(
          (suggestion) => suggestion.metadata && suggestion.metadata.timestamp === timestamp
        );

        if (suggestionIndex === -1) {
          throw "Suggestion with provided timestamp not found!";
        }


        // ensuring fields exist
        if (!suggestionsList[suggestionIndex].metadata.dislikes) {
          suggestionsList[suggestionIndex].metadata.dislikes = 0;
        }

        if (!suggestionsList[suggestionIndex].metadata.likes) {
          suggestionsList[suggestionIndex].metadata.likes = 0;
        }

        if (isLiking && !isUndoing) {
          suggestionsList[suggestionIndex].metadata.likes++;
        } else if (isLiking && isUndoing) {
          suggestionsList[suggestionIndex].metadata.likes--;
        }

        if (!isLiking && !isUndoing) {
          suggestionsList[suggestionIndex].metadata.dislikes++;
        } else if (!isLiking && isUndoing) {
          suggestionsList[suggestionIndex].metadata.dislikes--;
        }

        const suggestionObject = {};
        suggestionsList.forEach((suggestion, index) => {
          suggestionObject[index] = suggestion;
        });

        transaction.update(doc(db, data.recipient.category, data.recipient.title), { suggestions: suggestionObject });

      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }


  }

  function id(idName) {
    return document.getElementById(idName);
  }
})();