// segmentation.js
(function() {
    let currentImage = null;
    let segmentationCanvas = null;
    let promptsCanvas = null;
    let ctx = null;
    let promptsCtx = null;
    let isDrawing = false;
    let startX, startY;
    let currentPromptType = 'box';
    let prompts = [];
    let savedSegments = [];
    let currentSegmentAssociatedItems = [];
    let currentDraggedItem = null;
    let currentExplanationItem = null;
    let currentDragTargetSegmentIndex = null;
    let editingOldSegment = false;
  
    // Initialize segmentation when viewing artwork details
    function initSegmentation(artworkId, imageElement) {

      const artworkSection = document.querySelector('#segmentation-section') || document.querySelector('.artwork-section');
      if (artworkSection) {
        if (!document.querySelector('.artwork-segmentation-container')) {

          const container = document.createElement('div');
          container.className = 'artwork-segmentation-container';
  
          let canvasContainer = document.querySelector('.canvas-container');
          if (!canvasContainer) {
            canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas-container';
          }
  
          let toolsContainer = document.querySelector('.segmentation-tools-container');
          if (!toolsContainer) {
            toolsContainer = document.createElement('div');
            toolsContainer.className = 'segmentation-tools-container';
          }
  
          // Segment list container
          let segmentListContainer = document.querySelector('.segment-list-container');
          if (!segmentListContainer) {
            segmentListContainer = document.createElement('div');
            segmentListContainer.className = 'segment-list-container';
            segmentListContainer.innerHTML = '<h3>Saved Segments</h3><ul id="segments-list"></ul>';
            toolsContainer.appendChild(segmentListContainer);
          }
  
          // artworkSection.innerHTML = '';
          container.appendChild(canvasContainer);
          container.appendChild(toolsContainer);
          artworkSection.appendChild(container);
        }
      }
  
      currentImage = imageElement;
      setupCanvases(imageElement);
  
      createSegmentListContainer();
  
      // Load saved segments and update UI
      artworkID_new = getCurrentArtworkId();
      loadSavedSegments(artworkID_new);
      updateSegmentsList(); 
      displayExistingSegments(artworkID_new, imageElement);

      setupEventListeners();
      setupPalette();
    }
  
    function createSegmentListContainer() {
      let segmentListContainer = document.querySelector('.segment-list-container');
      if (!segmentListContainer) {
        const toolsContainer = document.querySelector('.segmentation-tools-container');
        if (!toolsContainer) {
          const artworkSection = document.querySelector('#segmentation-section') || document.querySelector('.artwork-section');
          if (artworkSection) {
            const container = document.createElement('div');
            container.className = 'artwork-segmentation-container';
  
            const existingContent = artworkSection.innerHTML;
            artworkSection.innerHTML = '';
  
            const canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas-container';
  
            const newToolsContainer = document.createElement('div');
            newToolsContainer.className = 'segmentation-tools-container';
  
            container.appendChild(canvasContainer);
            container.appendChild(newToolsContainer);
            artworkSection.appendChild(container);
  
            segmentListContainer = document.createElement('div');
            segmentListContainer.className = 'segment-list-container';
            segmentListContainer.innerHTML = '<h3>Saved Segments</h3><ul id="segments-list"></ul>';
            newToolsContainer.appendChild(segmentListContainer);
          }
        } else {
          segmentListContainer = document.createElement('div');
          segmentListContainer.className = 'segment-list-container';
          segmentListContainer.innerHTML = '<h3>Saved Segments</h3><ul id="segments-list"></ul>';
          toolsContainer.appendChild(segmentListContainer);
        }
      }
    }
  
    function setupCanvases(imageElement) {
      const container = document.querySelector('.canvas-container');
      container.innerHTML = '';
      container.style.position = 'relative';
  
      imageElement.style.maxWidth = '100%';
      imageElement.style.height = 'auto';
  
      // Add the image
      container.appendChild(imageElement);
  
      segmentationCanvas = document.createElement('canvas');
      segmentationCanvas.width = imageElement.width;
      segmentationCanvas.height = imageElement.height;
      segmentationCanvas.style.position = 'absolute';
      segmentationCanvas.style.top = '0';
      segmentationCanvas.style.left = '0';
      segmentationCanvas.style.pointerEvents = 'none';
      container.appendChild(segmentationCanvas);
      ctx = segmentationCanvas.getContext('2d');
  
      // Create canvas for drawing prompts
      promptsCanvas = document.createElement('canvas');
      promptsCanvas.width = imageElement.width;
      promptsCanvas.height = imageElement.height;
      promptsCanvas.style.position = 'absolute';
      promptsCanvas.style.top = '0';
      promptsCanvas.style.left = '0';
      promptsCanvas.style.cursor = 'crosshair';
      container.appendChild(promptsCanvas);
      promptsCtx = promptsCanvas.getContext('2d');
    }
  
    function setupEventListeners() {
      const boxBtn = document.getElementById('box-prompt');
      if (boxBtn) {
        /*
        boxBtn.addEventListener('click', () => {
          currentPromptType = 'box';
          updateToolButtons();
        });
        */
        boxBtn.addEventListener('click', () => {
          // If we are currently locked in an old segment OR we have leftover prompts,
          // we interpret that as "Start a new segment from scratch."
          if (editingOldSegment || prompts.length > 0) {
            console.log("[box-prompt click] Starting a brand-new segment, clearing old data.");
      
            editingOldSegment = false;
            clearPrompts();
            currentSegmentAssociatedItems = [];
            updateAssociatedItemsList();
      
            let detailsContainer = document.querySelector('.segment-details-container');
            if (detailsContainer) {
              detailsContainer.innerHTML = '';
            }
          }
      
          currentPromptType = 'box';
          updateToolButtons();
        });
      }
      /*
      const pointBtn = document.getElementById('point-prompt');
      if (pointBtn) {
        pointBtn.addEventListener('click', () => {
          currentPromptType = 'point';
          updateToolButtons();
        });
      }
      */
  
      const clearPromptsBtn = document.getElementById('clear-prompts');
      if (clearPromptsBtn) {
        clearPromptsBtn.addEventListener('click', clearPrompts);
      }

      const saveSegmentBtn = document.getElementById('save-segment');
      if (saveSegmentBtn) {
        saveSegmentBtn.addEventListener('click', saveCurrentSegment);
      }
  
      // Canvas interaction
      if (promptsCanvas) {
        promptsCanvas.addEventListener('mousedown', handleMouseDown);
        promptsCanvas.addEventListener('mousemove', handleMouseMove);
        promptsCanvas.addEventListener('mouseup', handleMouseUp);
      }

      document.addEventListener('click', function(e) {
        // Check if the click is outside the canvas-container and segmentation tools
        const canvasContainer = document.querySelector('.canvas-container');
        const toolsContainer = document.querySelector('.segmentation-tools-container');
        const segmentListContainer = document.querySelector('.segment-list-container');
        
        // If the click target is not within any of these containers
        if (canvasContainer && !canvasContainer.contains(e.target) &&
            toolsContainer && !toolsContainer.contains(e.target) &&
            segmentListContainer && !segmentListContainer.contains(e.target) &&
            !e.target.closest('.segment-label-indicator') && // Exclude label indicators
            !e.target.closest('.segment-details-container')) { // Exclude segment details
          
          // Clear selection, prompts, and reset editing state
          clearPrompts();
          editingOldSegment = false;
        }
      });
  
      setupPalette();
    }
  
    function setupPalette() {
      // Set up the palette tabs
      document.querySelectorAll('.palette-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.palette-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
  
          document.querySelectorAll('.palette-content').forEach(content => content.classList.add('hidden'));
          const tabName = tab.getAttribute('data-tab');
          const target = document.getElementById(`palette-${tabName}`);
          if (target) {
            target.classList.remove('hidden');
          }
        });
      });
  
      // Load the items for each category
      loadMaterialsForPalette();
      loadTexturesForPalette();
      loadColorsForPalette();
  
      // Set up the explanation modal
      const modal = document.getElementById('explanation-modal');
      const closeBtn = modal ? modal.querySelector('.close-modal') : null;
      const saveBtn = document.getElementById('save-explanation');
  
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const explanationInput = document.getElementById('segment-explanation');
          const explanation = explanationInput ? explanationInput.value.trim() : '';
  
          if (!explanationInput) {
            console.error("Explanation input element not found!");
            return;
          }
  
          if (currentExplanationItem) {
            currentExplanationItem.explanation = explanation;
  
            if (currentDragTargetSegmentIndex !== null) {
              if (!savedSegments[currentDragTargetSegmentIndex].associatedItems) {
                savedSegments[currentDragTargetSegmentIndex].associatedItems = [];
              }
  
              const existingItemIndex = savedSegments[currentDragTargetSegmentIndex].associatedItems.findIndex(
                item => item.name === currentExplanationItem.name && item.type === currentExplanationItem.type
              );
  
              if (existingItemIndex !== -1) {
                savedSegments[currentDragTargetSegmentIndex].associatedItems[existingItemIndex].explanation = explanation;
              } else {
                const newItem = {
                  name: currentExplanationItem.name,
                  type: currentExplanationItem.type,
                  explanation: explanation
                };
                savedSegments[currentDragTargetSegmentIndex].associatedItems.push(newItem);
              }
  
              const artworkId = getCurrentArtworkId();
              const artworkSegmentsKey = `artwork_segments_${artworkId}`;
              localStorage.setItem(artworkSegmentsKey, JSON.stringify(savedSegments));
  
              updateSegmentsList();
              displaySegmentDetails(savedSegments[currentDragTargetSegmentIndex]);
  
              currentDragTargetSegmentIndex = null;
            } else {
              updateAssociatedItemsList();
            }
  
            // Close modal and reset
            if (modal) modal.style.display = 'none';
            currentExplanationItem = null;
            explanationInput.value = '';
          }
        });
      }
  
      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
          modal.style.display = 'none';
          currentExplanationItem = null;
        });
      }
  
      // Close the modal if user clicks outside
      window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
          modal.style.display = 'none';
          currentExplanationItem = null;
        }
      });
    }
  
    function loadMaterialsForPalette() {
      const container = document.getElementById('palette-materials');
      if (!container) return;
      container.innerHTML = '';
  
      if (window.MATERIALS) {
        for (const materialName in window.MATERIALS) {
          const item = createPaletteItem(materialName, 'material');
          container.appendChild(item);
        }
      } else {
        container.innerHTML = '<p>No materials available</p>';
      }
    }
  
    function loadTexturesForPalette() {
      const container = document.getElementById('palette-textures');
      if (!container) return;
      container.innerHTML = '';
  
      if (window.TEXTURES) {
        for (const textureName in window.TEXTURES) {
          const item = createPaletteItem(textureName, 'texture');
          container.appendChild(item);
        }
      } else {
        container.innerHTML = '<p>No textures available</p>';
      }
    }
  
    function loadColorsForPalette() {
      const container = document.getElementById('palette-colors');
      if (!container) return;
      container.innerHTML = '';
  
      if (window.COLORS) {
        for (const colorName in window.COLORS) {
          const item = createPaletteItem(colorName, 'color');
          // Add color swatch
          const hex = window.COLORS[colorName]?.hex;
          if (hex) {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch-small';
            swatch.style.backgroundColor = hex;
            item.insertBefore(swatch, item.firstChild);
          }
          container.appendChild(item);
        }
      } else {
        container.innerHTML = '<p>No colors available</p>';
      }
    }
  
    function createPaletteItem(name, type) {
      const item = document.createElement('div');
      item.className = `palette-item ${type}`;
      item.textContent = name;
      item.setAttribute('draggable', true);
      item.setAttribute('data-name', name);
      item.setAttribute('data-type', type);
  
      // Add drag events
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
  
      return item;
    }
  
    function handleDragStart(e) {
      currentDraggedItem = {
        name: e.target.getAttribute('data-name'),
        type: e.target.getAttribute('data-type')
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(currentDraggedItem));
      e.dataTransfer.effectAllowed = 'copy';
      this.classList.add('dragging');
    }
  
    function handleDragEnd() {
      this.classList.remove('dragging');
      currentDraggedItem = null;
    }
  
    // Drop zone for a segment
    function createDropZone() {
      let dropZone = document.querySelector('.segment-drop-zone');
      if (!dropZone) {
        dropZone = document.createElement('div');
        dropZone.className = 'segment-drop-zone';
        dropZone.innerHTML = '<p>Drag materials, textures, or colors here</p>';
  
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropZone.classList.add('drag-over');
        });
        dropZone.addEventListener('dragleave', () => {
          dropZone.classList.remove('drag-over');
        });
        dropZone.addEventListener('drop', handleDrop);
  
        const container = document.querySelector('.canvas-container').parentNode;
        container.appendChild(dropZone);
  
        const itemsList = document.createElement('div');
        itemsList.className = 'segment-associated-items';
        itemsList.innerHTML = '<h4>Associated Elements</h4><div id="associated-items-list"></div>';
        container.appendChild(itemsList);
      }
      return dropZone;
    }
  
    function handleDrop(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (!data.name || !data.type) {
          console.error('Invalid drop data');
          return;
        }

        const existingIndex = currentSegmentAssociatedItems.findIndex(
          item => item.name === data.name && item.type === data.type
        );
        if (existingIndex !== -1) {
          alert(`${data.name} is already associated with this segment. You can edit its explanation.`);
          return;
        }
  
        currentExplanationItem = {
          name: data.name,
          type: data.type,
          explanation: ''
        };
  
        // Show the explanation modal
        const modal = document.getElementById('explanation-modal');
        if (modal) {
          const segmentExplanation = document.getElementById('segment-explanation');
          if (segmentExplanation) {
            segmentExplanation.value = '';
          }
          modal.style.display = 'block';
        }
  
        currentSegmentAssociatedItems.push(currentExplanationItem);
        updateAssociatedItemsList();
      } catch (error) {
        console.error('Error handling drop:', error);
      }
    }
  
    function updateAssociatedItemsList() {
      const container = document.getElementById('associated-items-list');
      if (!container) return;
      container.innerHTML = '';
  
      if (currentSegmentAssociatedItems.length === 0) {
        container.innerHTML = '<p>No items associated yet</p>';
        return;
      }
  
      currentSegmentAssociatedItems.forEach((item, index) => {
        const element = document.createElement('div');
        element.className = 'associated-item';
  
        if (item.type === 'color' && window.COLORS && window.COLORS[item.name]) {
          const swatch = document.createElement('div');
          swatch.className = 'color-swatch-small';
          swatch.style.backgroundColor = window.COLORS[item.name].hex;
          swatch.style.width = '15px';
          swatch.style.height = '15px';
          swatch.style.marginRight = '5px';
          element.appendChild(swatch);
        }
  
        const nameSpan = document.createElement('span');
        nameSpan.className = 'associated-item-name';
        nameSpan.textContent = item.name;
        element.appendChild(nameSpan);
  
        const typeSpan = document.createElement('span');
        typeSpan.className = 'associated-item-type';
        typeSpan.textContent = `(${item.type})`;
        element.appendChild(typeSpan);
  
        if (item.explanation) {
          const explanationSpan = document.createElement('span');
          explanationSpan.className = 'associated-item-explanation';
          explanationSpan.textContent = item.explanation;
          element.appendChild(explanationSpan);
        }
  
        // Edit button
        const editBtn = document.createElement('span');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit explanation';
        editBtn.style.cursor = 'pointer';
        editBtn.style.marginLeft = '10px';
        editBtn.addEventListener('click', () => {
          currentExplanationItem = item;
          const modal = document.getElementById('explanation-modal');
          if (modal) {
            const segmentExplanation = document.getElementById('segment-explanation');
            if (segmentExplanation) {
              segmentExplanation.value = item.explanation || '';
            }
            modal.style.display = 'block';
          }
        });
        element.appendChild(editBtn);
  
        // Remove button
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '❌';
        removeBtn.style.cursor = 'pointer';
        removeBtn.addEventListener('click', () => {
          // remove from in-memory 
          currentSegmentAssociatedItems.splice(index, 1);
          updateAssociatedItemsList();

          // if we are currently “editing” an old segment,
          //  update that segment’s data in savedSegments + localStorage
          if (editingOldSegment && typeof currentLoadedSegmentIndex === 'number') {
            savedSegments[currentLoadedSegmentIndex].associatedItems =
              currentSegmentAssociatedItems;

            // Re‑save to localStorage
            const artworkId = getCurrentArtworkId();
            const artworkSegmentsKey = `artwork_segments_${artworkId}`;
            localStorage.setItem(artworkSegmentsKey, JSON.stringify(savedSegments));
          }
        });
        element.appendChild(removeBtn);
  
        container.appendChild(element);
      });
    }
  
    async function saveCurrentSegment() {
      // Check if we have any prompts drawn
      if (prompts.length === 0) {
        alert("Please select a region using box first.");
        return;
      }
  
      const labelInput = document.getElementById('segment-label');
      if (!labelInput) {
        console.error("Segment label input not found!");
        return;
      }
      const label = labelInput.value.trim();
      if (!label) {
        alert("Please enter a label for this segment.");
        return;
      }
  
      // Get the current artwork ID
      const artworkId = getCurrentArtworkId();
      console.log(`[saveCurrentSegment]: artworkID from getCurrentArtworkId:`, artworkId);
  
      // Build a segment object
      const segment = {
        label: label,
        prompts: JSON.parse(JSON.stringify(prompts)),
        timestamp: new Date().toISOString(),
        associatedItems: JSON.parse(JSON.stringify(currentSegmentAssociatedItems))
      };
  
      // Get existing segments from localStorage
      const artworkSegmentsKey = `artwork_segments_${artworkId}`;
      console.log(`[saveCurrentSegment]: artworkSegmentsKey:`, artworkSegmentsKey);

      const artworkSegments = JSON.parse(localStorage.getItem(artworkSegmentsKey) || '[]');
      console.log(`[saveCurrentSegment]: artworkSegments:`, artworkSegments);
  
      artworkSegments.push(segment);
      localStorage.setItem(artworkSegmentsKey, JSON.stringify(artworkSegments));
  
      savedSegments = artworkSegments;
      updateSegmentsList();
  
      clearPrompts();
      labelInput.value = '';
  
      currentSegmentAssociatedItems = [];
      updateAssociatedItemsList();
  
      updateSearchIndex(artworkId, label);
  
      alert("Segment saved successfully!");
      displayExistingSegments(artworkId, currentImage);
    }
  
    function loadSegment(index) {
      clearPrompts();

      const segment = savedSegments[index];
  
      if (segment.prompts && Array.isArray(segment.prompts)) {
        prompts = JSON.parse(JSON.stringify(segment.prompts));
        drawPrompts();
  
        // Load associated items
        if (segment.associatedItems && Array.isArray(segment.associatedItems)) {
          currentSegmentAssociatedItems = JSON.parse(JSON.stringify(segment.associatedItems));
        } else {
          currentSegmentAssociatedItems = [];
        }
        updateAssociatedItemsList();
  
        // Display segment details
        displaySegmentDetails(segment, index);

        // LOCK the canvas so we can’t add new boxes since it's segment make by other clients
        editingOldSegment = true;
      } else {
        console.error("Invalid segment data:", segment);
      }
    }
  
    function displaySegmentDetails(segment, segIndex) {
      let detailsContainer = document.querySelector('.segment-details-container');
      if (!detailsContainer) {
        detailsContainer = document.createElement('div');
        detailsContainer.className = 'segment-details-container';
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
          canvasContainer.parentNode.insertBefore(detailsContainer, canvasContainer.nextSibling);
        }
      }
      detailsContainer.innerHTML = '';
  
      const labelHeading = document.createElement('h3');
      labelHeading.textContent = `Segment: ${segment.label}`;
      detailsContainer.appendChild(labelHeading);
  
      if (segment.associatedItems && segment.associatedItems.length > 0) {
        const itemsHeading = document.createElement('h4');
        itemsHeading.textContent = 'Associated Elements & Explanations:';
        detailsContainer.appendChild(itemsHeading);
  
        const itemsList = document.createElement('ul');
        itemsList.className = 'segment-details-items';
  
        segment.associatedItems.forEach((item, itemIndex) => {
          const li = document.createElement('li');
  
          if (item.type === 'color' && window.COLORS && window.COLORS[item.name]) {
            const swatch = document.createElement('span');
            swatch.className = 'color-swatch-tiny';
            swatch.style.display = 'inline-block';
            swatch.style.width = '12px';
            swatch.style.height = '12px';
            swatch.style.backgroundColor = window.COLORS[item.name].hex;
            swatch.style.marginRight = '5px';
            li.appendChild(swatch);
          }
  
          const nameType = document.createElement('strong');
          nameType.textContent = `${item.name} (${item.type}): `;
          li.appendChild(nameType);
  
          const explanationSpan = document.createElement('span');
          explanationSpan.textContent = item.explanation;
          li.appendChild(explanationSpan);

          // REMOVE BUTTON:
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remove ❌';
          removeBtn.style.marginLeft = '10px';
          removeBtn.addEventListener('click', () => {
            savedSegments[segIndex].associatedItems.splice(itemIndex, 1);

            const artworkId = getCurrentArtworkId();
            const artworkSegmentsKey = `artwork_segments_${artworkId}`;
            localStorage.setItem(artworkSegmentsKey, JSON.stringify(savedSegments));

            displaySegmentDetails(savedSegments[segIndex], segIndex);
            displayExistingSegments(artworkId, currentImage);
            updateSegmentsList();
          });
          li.appendChild(removeBtn);
  
          itemsList.appendChild(li);
        });
  
        detailsContainer.appendChild(itemsList);
      } else {
        const noItems = document.createElement('p');
        noItems.textContent = 'No elements associated with this segment yet. Drag materials, textures, or colors onto this segment.';
        detailsContainer.appendChild(noItems);
      }
    }
  
    function updateToolButtons() {
      document.querySelectorAll('.seg-tool').forEach(btn => {
        btn.classList.remove('active');
      });
      /*
      if (currentPromptType === 'point') {
        const ptBtn = document.getElementById('point-prompt');
        if (ptBtn) ptBtn.classList.add('active');
      } else {
       */
        const bxBtn = document.getElementById('box-prompt');
        if (bxBtn) bxBtn.classList.add('active');
      // }
    }

    function clearSegmentDetails() {
      // wipe out past segment content
      const detailsContainer = document.querySelector('.segment-details-container');
      if (detailsContainer) {
        detailsContainer.remove();
      }
    }
  
    function handleMouseDown(e) {
      // clear any draft boxes here first since user is requesting to draw a new one?
      clearPrompts();

      // no interfere with past segment prompts
      if (editingOldSegment) {
        console.log("[handleMouseDown] You are viewing an old segment. " + 
                    "No new boxes can be drawn. Click 'New Segment' (or Clear All) to start fresh.");
        clearPrompts();
        clearSegmentDetails();
        editingOldSegment = false;
        // return;
      }

      const rect = promptsCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      /*
      if (currentPromptType === 'point') {
        addPointPrompt(x, y);
      } else if (currentPromptType === 'box') {
       */
        isDrawing = true;
        startX = x;
        startY = y;
      // }
    }
  
    function handleMouseMove(e) {
      if (!isDrawing || currentPromptType !== 'box') return;
      const rect = promptsCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      // Clear and redraw all prompts plus the in-progress box
      drawPrompts();
      promptsCtx.strokeStyle = 'yellow';
      promptsCtx.lineWidth = 2;
      promptsCtx.strokeRect(startX, startY, x - startX, y - startY);
    }
  
    function handleMouseUp(e) {
      if (!isDrawing || currentPromptType !== 'box') return;
      const rect = promptsCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      addBoxPrompt(startX, startY, x - startX, y - startY);
      isDrawing = false;
    }

    /*
    function addPointPrompt(x, y) {
      prompts.push({
        type: 'point',
        x: x,
        y: y
      });
      drawPrompts();
    }*/
  
    function addBoxPrompt(x, y, width, height) {
      prompts.push({
        type: 'box',
        x: x,
        y: y,
        width: width,
        height: height
      });
      drawPrompts();
    }
  
    function drawPrompts() {
      promptsCtx.clearRect(0, 0, promptsCanvas.width, promptsCanvas.height);
      prompts.forEach(prompt => {
        /*
        if (prompt.type === 'point') {
          promptsCtx.fillStyle = 'yellow';
          promptsCtx.beginPath();
          promptsCtx.arc(prompt.x, prompt.y, 5, 0, 2 * Math.PI);
          promptsCtx.fill();
        } else if (prompt.type === 'box') {
         */
          promptsCtx.strokeStyle = 'yellow';
          promptsCtx.lineWidth = 2;
          promptsCtx.strokeRect(prompt.x, prompt.y, prompt.width, prompt.height);
        // }
      });
    }
  
    function clearPrompts() {
        prompts = [];
        promptsCtx.clearRect(0, 0, promptsCanvas.width, promptsCanvas.height);
        ctx.clearRect(0, 0, segmentationCanvas.width, segmentationCanvas.height);
      
        currentSegmentAssociatedItems = [];
        clearSegmentDetails();
        updateAssociatedItemsList();
      }
      
    // Update the search index for labeling
    function updateSearchIndex(artworkId, label) {
      const searchIndexKey = 'segment_search_index';
      const searchIndex = JSON.parse(localStorage.getItem(searchIndexKey) || '{}');
      const normalizedLabel = label.toLowerCase().trim();
      if (!searchIndex[normalizedLabel]) {
        searchIndex[normalizedLabel] = [];
      }
      if (!searchIndex[normalizedLabel].includes(artworkId)) {
        searchIndex[normalizedLabel].push(artworkId);
      }
      localStorage.setItem(searchIndexKey, JSON.stringify(searchIndex));
    }
  
    function loadSavedSegments(artworkId) {
      console.log(`[loadSavedSegments] Attempting to load for: ${artworkId}`); //DEBUG

      const artworkSegmentsKey = `artwork_segments_${artworkId}`;
      const stored = localStorage.getItem(artworkSegmentsKey) || '[]';
      
      console.log(`[loadSavedSegments] localStorage raw for key=${artworkSegmentsKey}:`, stored);
      
      savedSegments = JSON.parse(stored);
      updateSegmentsList();
    }
  
    function updateSegmentsList() {
      console.log('[updateSegmentsList] Called, how many segments in memory:', savedSegments ? savedSegments.length : '(no savedSegments)'); //DEBUG
      console.log('[updateSegmentsList]' );
      const list = document.getElementById('segments-list');
      if (!list) {
        console.error("Segments list element not found!");
        createSegmentListContainer();
        return;
      }
      list.innerHTML = '';
  
      if (!savedSegments || savedSegments.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No segments saved yet';
        list.appendChild(li);
        return;
      }
  
      savedSegments.forEach((segment, index) => {
        const li = document.createElement('li');
        li.className = 'segment-list-item';
        li.setAttribute('data-segment-index', index);
  
        // Make list items droppable
        li.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.remove('drag-over');
        });
        li.addEventListener('drop', (e) => {
          handleDropOnSegment(e, index);
        });
  
        const nameSpan = document.createElement('span');
        nameSpan.className = 'segment-name';
        nameSpan.textContent = segment.label;
        li.appendChild(nameSpan);
  
        // Show associated items if any
        if (segment.associatedItems && segment.associatedItems.length > 0) {
          const itemsSpan = document.createElement('span');
          itemsSpan.className = 'segment-associated-tags';
          const tags = segment.associatedItems.map(item => item.name).join(', ');
          itemsSpan.textContent = ` (${tags})`;
          li.appendChild(itemsSpan);
        }
  
        const controls = document.createElement('div');
        controls.className = 'segment-controls';
  
        const showBtn = document.createElement('button');
        showBtn.textContent = 'Show';
        showBtn.classList.add('segment-btn');
        showBtn.addEventListener('click', () => {
          loadSegment(index);
        });
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('segment-btn');
        deleteBtn.addEventListener('click', () => {
          deleteSegment(index);
        });
  
        controls.appendChild(showBtn);
        controls.appendChild(deleteBtn);
        li.appendChild(controls);
  
        list.appendChild(li);
      });
    }
  
    function handleDropOnSegment(e, segmentIndex) {
      e.preventDefault();
      e.stopPropagation();
      const li = e.currentTarget;
      li.classList.remove('drag-over');
  
      try {
        const dataString = e.dataTransfer.getData('text/plain');
        const data = JSON.parse(dataString);
  
        if (!data.name || !data.type) {
          console.error('Invalid drop data');
          return;
        }
  
        const segment = savedSegments[segmentIndex];
        const existing = segment.associatedItems
          ? segment.associatedItems.findIndex(item => item.name === data.name && item.type === data.type)
          : -1;
  
        if (existing !== -1) {
          alert(`${data.name} is already associated with this segment. You can edit its explanation.`);
          return;
        }
  
        currentExplanationItem = {
          name: data.name,
          type: data.type,
          explanation: ''
        };
        currentDragTargetSegmentIndex = segmentIndex;
  
        const modal = document.getElementById('explanation-modal');
        if (modal) {
          const explanationInput = document.getElementById('segment-explanation');
          if (explanationInput) {
            explanationInput.value = '';
          }
          modal.style.display = 'block';
        }
      } catch (error) {
        console.error('Error handling drop on segment:', error);
      }
    }
  
    function deleteSegment(index) {
      if (confirm("Are you sure you want to delete this segment?")) {
        const artworkId = getCurrentArtworkId();
        savedSegments.splice(index, 1);
  
        const artworkSegmentsKey = `artwork_segments_${artworkId}`;
        localStorage.setItem(artworkSegmentsKey, JSON.stringify(savedSegments));
        updateSegmentsList();
        displayExistingSegments(artworkId, currentImage);
      }
    }
  
    function getCurrentArtworkId() {
      const title = document.querySelector('#artwork-detail-page h1');
      if (!title) return 'unknown_artwork';

      let slug = title.textContent
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, '_');

      console.log(`[getCurrentArtworkId] Returning slug: "${slug}" from raw: "${title.textContent}"`);  //DEBUG
      return slug;
    }
  
    function displayExistingSegments(artworkId, imageElement) {
      console.log(`[displayExistingSegments] for artworkId=${artworkId}`);  //DEBUG

      const container = document.querySelector('.canvas-container');
      if (!container) return;
  
      // Remove any existing labels container
      const existingLabels = container.querySelector('.segment-labels-container');
      if (existingLabels) {
        existingLabels.remove();
      }
  
      const artworkSegmentsKey = `artwork_segments_${artworkId}`;
      const segments = JSON.parse(localStorage.getItem(artworkSegmentsKey) || '[]');
      if (segments.length === 0) return;
  
      // Create container for segment indicators
      const labelsContainer = document.createElement('div');
      labelsContainer.className = 'segment-labels-container';
      labelsContainer.style.position = 'absolute';
      labelsContainer.style.top = '0';
      labelsContainer.style.left = '0';
      labelsContainer.style.width = '100%';
      labelsContainer.style.height = '100%';
      container.appendChild(labelsContainer);
  
      // Add label indicators for each segment
      segments.forEach((segment, index) => {
        if (!segment.prompts || segment.prompts.length === 0) return;
        const firstPrompt = segment.prompts[0];
  
        const label = document.createElement('div');
        label.className = 'segment-label-indicator';
        label.textContent = segment.label;
        label.style.position = 'absolute';
        label.style.backgroundColor = 'rgba(255, 255, 0, 0.8)';
        label.style.color = 'black';
        label.style.padding = '2px 6px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.pointerEvents = 'all';
        label.style.cursor = 'pointer';
        
        /*
        if (firstPrompt.type === 'point') {
          label.style.left = `${firstPrompt.x}px`;
          label.style.top = `${firstPrompt.y}px`;
        } else if (firstPrompt.type === 'box') {
         */
          label.style.left = `${firstPrompt.x + firstPrompt.width / 2}px`;
          label.style.top = `${firstPrompt.y + firstPrompt.height / 2}px`;
        //}
  
        label.title = `Added: ${new Date(segment.timestamp).toLocaleString()}`;
        label.addEventListener('click', (event) => {
          event.stopPropagation();
          loadSegment(index);
        });
  
        // Make label droppable
        label.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          label.classList.add('drag-over-label');
        });
        label.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          label.classList.remove('drag-over-label');
        });
        label.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDropOnLabel(e, index);
          label.classList.remove('drag-over-label');
        });
  
        labelsContainer.appendChild(label);
      });
    }
  
    function handleDropOnLabel(e, segmentIndex) {
      try {
        const dataString = e.dataTransfer.getData('text/plain');
        const data = JSON.parse(dataString);
  
        if (!data.name || !data.type) {
          console.error('Invalid drop data');
          return;
        }
  
        const segment = savedSegments[segmentIndex];
        const existing = segment.associatedItems
          ? segment.associatedItems.findIndex(item => item.name === data.name && item.type === data.type)
          : -1;
  
        if (existing !== -1) {
          alert(`${data.name} is already associated with this segment. You can edit its explanation.`);
          return;
        }
  
        currentExplanationItem = {
          name: data.name,
          type: data.type,
          explanation: ''
        };
        currentDragTargetSegmentIndex = segmentIndex;
  
        const modal = document.getElementById('explanation-modal');
        if (modal) {
          const explanationInput = document.getElementById('segment-explanation');
          if (explanationInput) {
            explanationInput.value = '';
          }
          modal.style.display = 'block';
        }
      } catch (error) {
        console.error('Error handling drop on segment label:', error);
      }
    }
  
    function findArtworksByLabel(label) {
      const searchIndexKey = 'segment_search_index';
      const searchIndex = JSON.parse(localStorage.getItem(searchIndexKey) || '{}');
      const normalizedLabel = label.toLowerCase().trim();
      return searchIndex[normalizedLabel] || [];
    }
  
    // Expose public methods
    window.segmentation = {
      init: initSegmentation,
      search: findArtworksByLabel
    };
  
    document.addEventListener('DOMContentLoaded', function() {
      // If on an artwork detail page
      const title = document.querySelector('#artwork-detail-page h1');
      const artworkImage = document.querySelector('.artwork-image-container img');
      if (title && artworkImage) {
        // Wait for the image to load if needed...
        if (artworkImage.complete) {
          window.segmentation.init(getCurrentArtworkId(), artworkImage);
        } else {
          artworkImage.onload = function() {
            window.segmentation.init(getCurrentArtworkId(), artworkImage);
          };
        }
      }
    });
  })();
  