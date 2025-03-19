# Tactus (Tactile Art Team)

**Wei Wu, Huan Nguyen, Ryan Le, Michelle Vu**

**Mentors: Stacy Hsueh, Venkatesh Potluri**

**CSE 482A: Accessibility Capstone**


## Introduction

### The Problem
For blind and visually impaired (BLV) individuals, experiencing art is often limited to verbal descriptions that may not fully capture their preferred sensory modalities or cultural perspectives. Unlike spoken or written language, there is no established method for translating visual art into tactile formats—no direct, one-to-one mapping from two-dimensional imagery to touch-based interpretation. Additionally, artistic expression is deeply personal, and there is no single "correct" way to represent an artwork tactically. A centralized, accessible resource that allows users to explore art through multimodal, culturally influenced interpretations can help make artistic experiences more inclusive and meaningful.  

### What Our Application Does
Our solution is a discovery-based application that fosters a community where users can explore artworks, materials, textures, and colors in a digital space. Recognizing that artistic interpretations are shaped by culture, senses, and lived experiences, our tool provides a platform for sharing diverse perspectives that resonate with multiple identities. We prioritize centralized information, screen reader compatibility, enriched alt-text, and intuitive navigation, ensuring accessibility while allowing flexible engagement based on cognitive, cultural, and sensory preferences. To counteract the biases of rigid, Western-centric interpretations, our open-ended system encourages multiple exploration methods and community contributions. Users can browse artworks, provide suggestions, save to favorites, use image tagging to segment different compositions of art pieces, and add comments, transforming the platform into a collaborative space where those interested in tactile art can gather inspiration before beginning their creative process.


## Client Input

We had three clients:

- **Accessibility Art Museum Manager**  
  - Blind since birth  
  - Based in the USA, originally from India  

- **Tactile Artist**  
  - Acquired Blindness  
  - Based in India  

- **Tactile Interaction Designer**  
  - Sighted  
  - Based in the USA  

Each of them provided unique insights into how they experience, interpret, and create tactile art. Their perspectives reflected a range of identities, cultural backgrounds, and engagement styles with art. Through our conversations, we learned about the accessibility barriers they face, including the lack of centralized resources for exploring art through a tactile or multimodal lens. Some clients were new to tactile art and discovered it as a way to connect with culture, while others had dedicated years to developing accessibility solutions in art spaces. They emphasized the importance of independent exploration, contextual familiarity, and community-driven contributions to make art more meaningful and engaging.

One key takeaway was that there is no single "correct" way to translate visual art into tactile formats—interpretations vary widely based on personal experiences, cultural backgrounds, and sensory preferences. Our clients emphasized the need for flexible, user-driven exploration rather than a prescriptive system.

### Key Quotes:
- A blind art museum manager shared that tactile art became an essential part of his engagement with culture during COVID-19, particularly in India, where museums are often inaccessible. He highlighted the importance of immersive, unrushed exploration:  
  > “If it [a tactile piece] just enhances my learning, in my experience, then that is successful. It doesn't matter what you do.”

- A blind tactile artist explained how her creative process is shaped by everyday materials, such as aluminum foil and paper, and how her sighted friends help her with her translation process of tactile art through touch. She shared the profound impact of losing her vision on her connection to art:
    > “Once I lost my eyesight… I completely gave up art. In India, art is just sidelined, I mean there's no resources that teaches alternate forms of art.”

- A tactile interaction designer stressed the importance of iterative testing with both blind and sighted users to ensure accessibility and effectiveness. She noted that balancing cost, scalability, and personalization is crucial when designing tactile resources for a broad audience.

### Feedback and Improvements

Feedback from our BLV clients revealed key areas for improvement in our prototype’s usability:

- **Affordances Need Explicit Labels**: Common UI elements like image buttons were not immediately clear unless explicitly described in the alt text. Keeping labels concise while maintaining clarity was essential.
  
- **Improved Navigation Flow**: Many users highlighted the need for a back button that functions contextually, returning to the previous page rather than the homepage. They also suggested making navigation bidirectional, allowing users to move freely between related pages.

- **ARIA Popups for Keyboard Navigation**: Our mentors suggested using ARIA popups instead of full-page switches, as popups can be easier to navigate with a keyboard and screen reader.

- **Collaborative Space for User Contributions**: Instead of relying on designer-defined suggestions, clients and mentors pushed us to create a space where they could share their own interpretations. This led to the creation of a "Community Suggestions" section, where users can submit feedback and tag artworks with their cultural and sensory insights.

### Lofi Prototype

![Alt text](image_url)
![Alt text](image_url)
![Alt text](image_url)

## Final Concept

### Design and Technical Concept
This project embraces intersectionality by recognizing that artistic interpretation is shaped by diverse cultural, sensory, and lived experiences. By curating a culturally inclusive database of materials, textures, colors, and artworks, we enable users from various backgrounds to find meaningful artistic inspiration that resonates with their identity and experiences. Our tool also provides a space to share these culturally influenced perspectives so that the process of creating art can be supported by a collective effort. 

### Intersectionality
Understanding the accessibility needs of blind and visually impaired individuals in art motivated our project. We prioritized screen-reader compatibility, intuitive keyboard navigation, and enriched alt-text descriptions to provide flexible engagement with visual elements. Additionally, by offering multiple ways to explore and source inspiration through our features: search, filter and browse, favorites, and community suggestions. Through this, we aim to empower users to navigate art in ways that align with their cognitive, cultural, and sensory preferences.

### Potential Risks and How We Minimized Them
Western-centric interpretations, rigid descriptions, and misrepresentation of ideas or culture were key concerns we encountered when designing our tool. To counteract these biases, we designed an open-ended system where users shape their artistic journey through customizable inspiration boards, non-linear browsing, and community-driven contributions. This encourages greater agency and cultural representation.

Tactile art remains an underexplored space with few accessible solutions. Art is a fundamental part of human expression and should be available to all. Our tool is a major step toward bridging this gap by embracing the diversity of artistic interpretation and creation. Through our research, we found that blind and low-vision artists often rely on their communities to create, as there is no universal solution. We reflect this sentiment through a community-focused design that fosters accessible collaboration and knowledge sharing. is what would help artists the most. Our tool strengthens the bond between every artwork and user, making artistic exploration more inclusive and meaningful.

![The Tactus homepage. It has a minimalistic design with black text on a white background. It has the title Tactus and subtitle "Search our collection of inspiration" under it. Below that is a gray search bar that prompts to search for artworks, materials, textures, colors, or keywords. Below the search bar is three buttons for the features it supports. Search, Browse, and My Saved.](./img/readme/homepage.png)
This is the homepage of Tactus. It features a minimalist design that highlights the core functionalities: searching by keyword, browsing the gallery of items, and viewing saved inspiration.

![The Search Results page displaying artworks, materials, textures, and colors related to the keyword 'blue.' The page includes the title 'Search Results,' followed by a search bar with the keyword 'blue' typed in. Below, there are filters for Artwork, Texture, Material, and Color that can be checked off. A gallery layout below shows related items, including various 2d artworks.](./img/readme/search.png)
When searching by keyword, users are directed to a results page displaying all related categories. They can further refine their search by filtering materials, textures, colors, or artworks.

![Color info page for 'Lavender.' The header displays the title 'Lavender' in the top left corner and a 'Save to Favorites' button in the top right corner. Below the title, there is a rectangle that is a color swatch of lavender. Below that is a paragraph titled 'Its Hue' that details a sensory description of the color's qualities. Below that is a paragraph that details 'Where it is seen?'. Below that is 'Color Information' that includes the hex value. The community suggestions section is below. It has a button to 'Add your own suggestion' but currently has no suggestions made.](./img/readme/lavender.png)
![Material info page for 'Papier-Mache.' The header displays the title 'Papier-Mache' in the top left corner and a 'Save to Favorites' button in the top right corner. Below the title, a subtitle reads 'Even, polished surface with no roughness.' Below that is a paragraph titled 'Material Description' that gives details about the material qualities and how it is commonly used. Below that is a list of Techniques detailing ways it can be used. The community suggestions section is below. It has a button to 'Add your own suggestion' but currently has no suggestions made.](./img/readme/papermache.png)
![Material info page for 'Papier-Mache.' The header displays the title 'Papier-Mache' in the top left corner and a 'Save to Favorites' button in the top right corner. Below the title, a subtitle reads 'Even, polished surface with no roughness.' Below that is a paragraph titled 'How to Create It,' detailing techniques for achieving a smooth texture. The community suggestions section is below. It has a button to 'Add your own suggestion' but currently has no suggestions made.](./img/readme/smooth.png)

Clicking on an entry within a category takes users to its dedicated information page, where they can explore detailed descriptions. Our tool goes beyond standard descriptions to provide a richer, more sensory-based understanding.

For colors, we offer more than just a swatch or hex code. We include sensory descriptions and common associations, helping blind and low-vision users form a deeper understanding.
For materials, we detail their qualities, artistic applications, and availability to ensure accessibility for artists across different socioeconomic backgrounds.
For textures, we describe their sensory characteristics and provide guidance on tools and techniques to recreate them.

Each category emphasizes sensory descriptions since many blind and low-vision artists rely on tactile and auditory elements to navigate and experience art meaningfully. Below this contextual information is the Community Suggestions section, where users can contribute their own interpretations and insights related to the selected entry.

![An overview of the Artwork for the painting Dance(I). Underneath the main title is the Artist name and year the painting was created. At the top right, there is a button that says Interact with Artwork to start the image segmentation process. By its side is another button to save to favorites. It is in a two column layout. The left column contains the artwork context and description. It starts with a large image of the artwork. Below that is the audio content player that outputs a artwork description provided by a museum. Below that is a text description provided by the artist. The right column contains the interactive features. The first section is Artwork Content that displays cards of materials, colors, and textures in a gallery format that are related to the artwork. Below that is the Community Suggestions that is cutoff in the screenshot.](./img/readme/dance.png)
For artworks, we provide both context and interactive elements to enhance user understanding. Users can access both audio and text descriptions, allowing them to choose how they engage with the information. Additionally, we enrich each artwork by populating it with related materials, textures, and colors from our database, connecting its visual and tactile qualities.

![The Community Suggestions section for the artwork Dance(I). It is shown in a gallery layout, with a button to add your own suggestion and cards displaying other user suggestions. Each card contains a title, a text box for what was inputted, and an up and down arrow to upvote or downvote the suggestion. An example of current suggestions for Dance(I) include Air-Dry Clay with text input "I think people can be like clay" and 1 upvote. Also the painting Wind and Water by Suzanne Jackson with the input text "There is a similarity in the portrayal of movement". ](./img/readme/communitysuggestions.png)
![The Community Suggestion Form that opens when "add your own" is clicked on the artwork page. It is a 1-column layout form. Underneath the title is a subtitle blurb that reads: "Share your insight for the following artwork." and instruction blurb for the form that reads: "Instructions - Help others experience this artwork in new ways! Select a category below, then share your observation, interpretation, or creative suggestion. Your contribution will add to the community’s understanding of this piece. 1. Choose a category: Select whether you’re suggesting a Material, Texture, Related Artwork, or Interpretation. 2️. Answer the guiding questions: These will help you describe your suggestion with clarity. 3️. Submit your idea: Your suggestion will be added for others to explore when they interact with the image." Below that is radio buttons to select a category from Material, Texture, Artwork, or Interpretation. Below that is the the form that updates to the selected category. Currently it is on Material, so the form reads "Suggest a Material - Help others understand the materials used in this artwork or share what you used to recreate it." Below that is text that describes what the form is suggesting for, currently it is Dance(I). Underneath is an image of Dance(I). Following that is the form questions. There is one that asks "What are you suggesting?" and prompts the user to start typing in the designated box below. Another question below asks "How does this material contribute to this section of the artwork? -- Describe how this material is used or could be used. Consider its cultural significance, sensory qualities, or personal connections in artistic interpretation. (150 words max)" and prompts the user to start typing in the designated box below. Below the two questions us the submit button for the form. The back button is at the top left.](./img/readme/communitysuggestionsform.png)
The Community Suggestions page offers a space for users to share their personal interpretations and connections to the artwork. To contribute, users fill out a form describing the material, texture, artwork, or interpretation they associate with the piece. The form includes guided prompts that encourage them to reflect on cultural significance, sensory qualities, and personal connections, fostering a more inclusive and intersectional artistic dialogue.

![The interface that appears when the 'Interact with Artwork' button on an artwork page is clicked. The title says 'Interact with: Dance(I). The page is a a one column layout and supports image segmentation. Below is subtitle that says "Digitally engage, discover, and share community on colors, textures, and materials." Then it is followed by 'Instructions' that reads 'Click on the labels on the image to explore their details. Community-submitted details on textures, materials, interpretations, will be shown for every labeled segment. Have your own insights? Add a new suggestion to help others experience artwork in new ways, either by adding tags to existed segments or drawing your own segment.' Below is the area to Segment the Artwork. Dance(I) is a painting by Henri Matisse. It features five figures, dancing in an energetic, carefree rhythm. The bodies are simple and fluid, with no interior details, almost like soft, playful shapes. There are also vibrant colors. On the image, one of the figures has a segment that appears as a yellow rectangular selection with a label "body". Below that is a textbox that details the information attached to that segment. This is the view when one of the segments is clicked on the image. It says 'Segment: body' and 'Associated Elements & Explanations:'. Currently, there are 2 associations listed: Air-Dry Clay (material): The body's form is fluid and impressionable, which gives the impression of clay; and Crystal Rose (color): The skin tone of the bodies have pinkish tones. Next to each association is a button to remove it.](./img/readme/interactwithart.png)
The Artwork Page also features interactive image segmentation, allowing users to engage more deeply with the artwork. Through this interface, users can select and tag specific segments of the image, associating them with relevant materials, textures, or colors, and providing explanations for their choices.

![The interface that appears when the 'Interact with Artwork' button on an artwork page is clicked. This is for the artwork Dance(I). The page is a a one column layout and supports image segmentation. The current view is showing multiple segments that have been made on the image. The painting Dance(I) is by Henri Matisse. It features five figures, dancing in an energetic, carefree rhythm. The bodies are simple and fluid, with no interior details, almost like soft, playful shapes. There are also vibrant colors. On the image, there are 4 segments that appears as a yellow rectangular selection with labels. Currently, there is one for body, holding hands, hair, and grass. Below the image is the text input to 'Label the selection' after selecting a part of the image to label. The buttons to save and clear the selection are next to it. Below that is a section that displays all the saved segments for the labels described previously. Each label has the associated materials, textures, and colors that the user provided. It also has a 'Show' button to display the explanation and 'Delete' button to remove it. Below that is the section where users can drag Materials, Textures, or Colors they associate with the segment into the image selected area/label. It is currently on the Colors view that displays the database of colors. ](./img/readme/segmentation.png)
Additionally, users can view and explore tags created by others. This fosters a sense of community and collaboration. This feature allows users to gain insight into different artistic interpretations while contributing their own, creating a shared space for inspiration and discovery.

## Accessibility Audit

| Criteria | Conformance Level | Brief Explanation |
|-|-|-|
| 1.4.4 (Resize Text) | Supports | All text fonts use rem, root em, or unit within the CSS, meaning that it will default to the user's set font-size and adjust accordingly when rem is increased. This can be manually tested by changing the webpage’s font size. |
| 1.4.10 (Reflow) | Supports | Enabling the largest font size, all content remains accessible without requiring horizontal scrolling. |
| 2.4.3 (Focus Order) | Supports | We ensured assistive technologies follow a logical focus order, mirroring natural reading patterns. Key elements are sequentially arranged with ARIA landmarks for smooth, accessible navigation. |
| 4.1.2 (Name, Role, Value) | Supports? | INSERT TEXT HERE PLS |
| 1.4.11 (Non-textual contrast) | Slightly Supports | Most elements in our Black and White UI meet the 3:1 contrast ratio, ensuring accessibility. However, certain artworks and lighter colors featured do not pass, requiring adjustments for better visibility. |
| 1.3.1 (Info and Relationships) | Supports? | INSERT TEXT HERE PLS |
| 1.1.1 (Non-text Content) | Supports | We ensured all non-text content includes alternative text for accessibility, with rich alt-text descriptions for artwork pictures. |
| 1.3.4 (Orientation) | Does Not Support  | The content rotates, but in vertical orientation, text overlaps, negatively affecting readability. |
| 4.1.3 (Status messages) | ? | INSERT TEXT HERE PLS |
| 1.4.3 (Contrast (Minimum)) | Supports | The black text on a white background of the UI supports this. Search fields with grey backgrounds are bolded to maintain contrast. |
