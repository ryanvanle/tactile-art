const COLORS = {
  "Crimson": {
    hex: "#ad1c42",
    description: "Crimson is a deep, cool red with a hint of blue, making it darker and more intense than ruby or cherry red. It stands apart from warmer reds like scarlet and vermilion, and is deeper than pink or lighter reds like coral.",
    seen:"Crimson can be seen in deep red roses, autumn leaves, or royal clothing. It symbolizes passion, love, power, and intensity, often evoking strong emotions like desire or courage. It can also represent luxury and mystery.",
    explore:["Burnt Orange", "Hard", "Crystal Rose", "Blue Turquoise"],
  },
  "Golden Yellow": {
    hex: "#cb8f16",
    description: "Golden Yellow is a warm, rich color that combines the brightness of yellow with earthy amber undertones. It's more sophisticated than pure yellow, balancing vibrancy with a deep, metallic quality that suggests both sunlight and precious metals.",
    seen: "Gloden yellow appears naturally in ripe wheat fields, autumn leaves, and fresh honey. It's prominent in royal crowns, sacred art, and harvest celebrations, symbolizing abundance, wisdom, and the warmth of late summer sunshine.",
    explore: ["Burnt Orange", "Crystal Rose", "Smooth", "Hard"],
  },
  "Emerald": {
    hex: "#009877",
    description: "Emerald is a deep, luxurious green with cool blue undertones, inspired by the precious gemstone. It's richer than forest green but more natural than artificial greens, combining depth with clarity in a way that suggests both precious stones and lush vegetation.",
    seen: "Emerald found in tropical rainforest canopies, precious gemstones, and peacock feathers. In art and design, it represents growth, prosperity, and natural beauty, often associated with springtime renewal and environmental vitality.",
    explore: ["Navy Blue", "Blue Turquoise", "Smooth", "Crystal Rose"],
  },
  "Navy Blue": {
    hex: "#403f6f",
    description: "Navy Blue is a profound, dignified shade of blue with purple undertones, darker than royal blue but warmer than midnight blue. It has a depth that suggests both the ocean's mysteries and the evening sky, creating a sense of infinite space.",
    seen: "Navy Blue appears in deep ocean waters, storm clouds at dusk, and formal uniforms. It represents authority, wisdom, and depth, evoking feelings of trust and stability while maintaining an air of sophistication.",
    explore: ["Emerald", "Blue Turquoise", "Smooth", "Hard"],
  },
  "Lavender": {
    hex: "#b2a4d4",
    description: "Lavender is a soft, gentle purple with cool gray undertones, lighter than royal purple but more sophisticated than pink. It combines the delicacy of morning mist with the subtle richness of flower petals, creating a soothing, ethereal quality.",
    seen: "Visible in lavender flower fields, twilight skies, and morning fog. This color represents tranquility, grace, and spiritual awareness, often associated with spring blooms and peaceful meditation spaces.",
    explore: ["Crystal Rose", "Navy Blue", "Soft", "Smooth"],
  },
  "Burnt Orange": {
    hex: "#c7632c",
    description: "Burnt Orange is a warm, intense color that combines the vibrancy of orange with earthy brown undertones. It's deeper than pure orange but more energetic than terra cotta, suggesting both fire and earth elements in its composition.",
    seen: "Burnt Orange appears in desert sunsets, autumn maple leaves, and weathered clay pottery. It represents energy, creativity, and earthly warmth, evoking both the comfort of hearth fires and the excitement of seasonal change.",
    explore: ["Golden Yellow", "Crimson", "Rough", "Hard"],
  },
  "Charcoal Gray": {
    hex: "#6a6a6a",
    description: "Charcoal Gray is a rich, deep neutral that sits between pure black and medium gray. It has the depth of storm clouds but maintains a softness that pure black lacks, suggesting both strength and sophistication.",
    seen: "Found in wet stones, thunder clouds, and graphite drawings. This color represents stability, maturity, and contemplation, often used to create depth and shadow in artistic compositions while maintaining a sense of warmth.",
    explore: ["Navy Blue", "Crystal Rose", "Smooth", "Hard"],
  },
  "Blue Turquoise": {
    hex: "#52b0ae",
    description: "Blue Turquoise is a bright, refreshing color that balances blue's coolness with green's vitality. It's lighter than deep sea blue but more grounded than sky blue, capturing the essence of shallow tropical waters and precious stones.",
    seen: "Blue Turquoise appears in Caribbean waters, semi-precious stones, and tropical bird feathers. It represents renewal, clarity, and emotional healing, often associated with clean water and fresh beginnings.",
    explore: ["Emerald", "Navy Blue", "Smooth", "Slippery"],
  },
  "Crystal Rose": {
    hex: "#fdc4c7",
    description: "Crystal Rose is a delicate, luminous pink that combines the softness of rose petals with the clarity of morning light. It's lighter than traditional pink but warmer than white, suggesting both innocence and gentle warmth.",
    seen: "Visible in cherry blossoms, rose quartz crystals, and sunrise clouds. This color represents tenderness, youth, and new beginnings, evoking feelings of gentle affection and fresh starts.",
    explore: ["Lavender", "Golden Yellow", "Soft", "Smooth"],
  },
  "Forest Green": {
    hex: "#228B22",
    description: "Forest Green is a deep, rich green reminiscent of dense woodland canopies. It's darker and more muted than emerald, with a natural earthiness that grounds any composition.",
    seen: "This color appears in dense forest foliage, moss-covered stones, and evergreen trees. It's often used in nature-inspired artwork and represents growth, stability, and the natural world.",
    explore: ["Emerald", "Navy Blue", "Rough", "Hard"],
  },
  "Sage Green": {
    hex: "#87AE73",
    description: "Sage Green is a muted, earthy green with gray undertones, softer than forest green but more sophisticated than mint. It combines the freshness of herbs with the subtlety of morning mist, creating a sense of natural tranquility.",
    seen: "This color appears in garden herbs, desert succulents, and weathered copper. It represents balance, healing, and wisdom, often associated with herbal medicine and peaceful gardens.",
    explore: ["Emerald", "Charcoal Gray", "Soft", "Smooth"]
  },
  "Dusty Plum": {
    hex: "#7D4B69",
    description: "Dusty Plum is a sophisticated purple-brown that balances warmth and depth. It's more muted than royal purple but richer than mauve, suggesting both luxury and earthiness in its complex undertones.",
    seen: "Found in aged wine, vintage velvet, and twilight shadows. This color represents refinement, mystery, and contemplation, evoking the transition between day and night.",
    explore: ["Crimson", "Navy Blue", "Soft", "Smooth"]
  },
};

const TEXTURES = {
  "Smooth": {
    blurb: "Even, polished surface with no roughness",
    create: "To achieve a smooth surface in tactile art, explore materials that naturally lend themselves to a polished feel, such as fine clay, soft fabric, or sanded wood. Consider layering techniques—building up thin, even coats of paint, glue, or plaster can help smooth out rough areas. Tools like sandpaper, sponges, or even a damp cloth can refine textures, while sealing with varnish, wax, or resin can enhance the sleekness.",
    explore: ["Air-Dry Clay", "Papier-Mâché", "Soft", "Blue Turquoise", "Charcoal Gray"]
  },
  "Rough": {
    blurb: "Coarse, uneven surface with bumps or ridges",
    create: "Create rough textures using materials like sandpaper, burlap, or coarse stones. Apply techniques such as dry brushing, stippling, or adding sand to paint. Natural materials like tree bark or dried plants can provide authentic roughness. Use tools like texture combs, crumpled paper, or wire brushes to create varied patterns. Consider building up layers of different materials for complex textures.",
    explore: ["Gritty", "Hard", "Bumpy", "Burnt Orange", "Metal Wire"]
  },
  "Fuzzy": {
    blurb: "Soft, slightly hairy or fluffy texture",
    create: "Develop fuzzy textures using materials like felt, yarn, or faux fur. Experiment with flocking powder, velvet, or brushed fabrics. Try techniques like needle felting or brushing out fibers. Layer different materials of varying pile heights for depth. Consider using tools like wire brushes or velvet-finishing techniques to create subtle variations in the surface.",
    explore: ["Soft", "Smooth", "Crystal Rose", "Lavender", "Pipe Cleaners"]
  },
  "Bumpy": {
    blurb: "Raised areas creating an irregular surface",
    create: "Build bumpy textures using dimensional media like modeling paste, textured gels, or small beads. Apply materials in dots or clusters, varying sizes for interest. Try techniques like impasto painting or relief work. Use tools like palette knives, dotting tools, or textured rollers. Consider natural materials like pebbles or seed pods for organic patterns.",
    explore: ["Rough", "Hard", "Gritty", "Navy Blue", "Air-Dry Clay"]
  },
  "Slippery": {
    blurb: "Slick, hard to grip, often glossy or wet",
    create: "Achieve slippery textures using high-gloss finishes, resins, or polished surfaces. Experiment with layers of clear mediums, glazes, or sealants. Try techniques like pouring, burnishing, or wet-blending. Use materials like glass, polished stone, or glossy papers. Consider combining smooth surfaces with protective coatings for enhanced slickness.",
    explore: ["Smooth", "Hard", "Blue Turquoise", "Crystal Rose", "Oil Paints"]
  },
  "Gritty": {
    blurb: "Small, grainy particles creating a sandy feel",
    create: "Create gritty textures using materials like sand, fine gravel, or textured mediums. Mix additives into paint or adhesives for consistent texture. Try techniques like sprinkling, pressing, or embedding particles. Use tools like texture spreaders or sieves for even application. Consider layering different grain sizes for complex surfaces.",
    explore: ["Rough", "Hard", "Bumpy", "Charcoal Gray", "Metal Wire"]
  },
  "Sticky": {
    blurb: "Tacky, adhesive surface that clings to touch",
    create: "Develop sticky textures using adhesives, tacky mediums, or specialty glues. Experiment with different viscosities and drying times. Try techniques like controlled dripping or dabbing. Use tools like palette knives or silicone brushes for application. Consider combining different adhesives for varied tactile experiences.",
    explore: ["Soft", "Smooth", "Crystal Rose", "Golden Yellow", "Acrylic Paint"]
  },
  "Soft": {
    blurb: "Gentle, cushion-like feel, easy to press into",
    create: "Create soft textures using materials like batting, foam, or plush fabrics. Layer materials for depth and give. Try techniques like quilting, padding, or stuffing. Use tools like needle and thread or adhesives for construction. Consider combining different densities of materials for varied softness.",
    explore: ["Fuzzy", "Smooth", "Lavender", "Crystal Rose", "Felt"]
  },
  "Hard": {
    blurb: "Firm, unyielding surface with no give",
    create: "Achieve hard textures using materials like wood, stone, or hardened clay. Apply techniques like polishing, sealing, or finishing for desired surface quality. Try methods like carving, casting, or assembling solid materials. Use tools like chisels, files, or sanders for shaping. Consider combining different hard materials for visual and tactile contrast.",
    explore: ["Smooth", "Rough", "Navy Blue", "Charcoal Gray", "Metal Wire"]
  },
  "Woven": {
    blurb: "Interlaced patterns creating a fabric-like surface",
    create: "Create woven textures using materials like ribbons, strips of paper, or thin wire. Layer materials in alternating patterns for depth. Try techniques like basket weaving, paper weaving, or fabric manipulation. Use tools like looms or weaving boards for structure. Consider combining different materials for varied tactile experiences.",
    explore: ["Smooth", "Soft", "Crystal Rose", "Lavender", "Felt"]
  },
  "Crackled": {
    blurb: "Network of fine lines creating a broken surface",
    create: "Achieve crackled textures using crackle mediums, aging techniques, or controlled drying methods. Apply materials in layers allowing for intentional separation. Try techniques like heat treating or chemical reactions. Use tools like heat guns or specialized mediums. Consider layering different colors for enhanced visual effect.",
    explore: ["Rough", "Hard", "Charcoal Gray", "Navy Blue", "Acrylic Paint"]
  },
  "Rippled": {
    blurb: "Wave-like patterns creating flowing surface variations",
    create: "Develop rippled textures using fluid materials or moldable surfaces. Create wave patterns through controlled movement or tool manipulation. Try techniques like water manipulation or surface scoring. Use tools like combs or modeling tools. Consider layering different materials for complex wave patterns.",
    explore: ["Smooth", "Slippery", "Blue Turquoise", "Crystal Rose", "Oil Paints"]
  },
};

const MATERIALS = {
  "Aluminum Foil": {
    blurb: "Malleable, lightweight, good for beginners",
    description: "Aluminum foil is a lightweight, flexible material that reflects light and holds shape well. Artists use it for sculpture armatures, collage, and printmaking, taking advantage of its reflective surface and ability to capture fine details. Foil adds a dynamic, metallic element to compositions, making it a versatile tool for creative expression.",
    techniques: ["Embossing", "Collage", "Texturing", "Sculpting"],
    availability: "Affordable and widely available at most grocery stores, aluminum foil is great for tactile art, offering a simple way to experiment with both smooth and rough textures.",
    explore: ["Metal Wire", "Papier-Mâché", "Charcoal Gray", "Rough"],
    image: "",
    alt: "",
  },
  "Air-Dry Clay": {
    blurb: "Easy to shape, lightweight, good for beginners",
    description: "Air-dry clay is a versatile modeling material that hardens naturally without requiring heat or special equipment. It offers excellent detail retention and can be carved, smoothed, or textured while wet. Once dry, it can be painted, sealed, or further enhanced with various finishes, making it ideal for creating both sculptural and tactile art pieces.",
    techniques: ["Hand building", "Coiling", "Slab construction", "Surface texturing", "Relief work"],
    availability: "Readily available at art supply stores and craft shops, air-dry clay comes in various colors and formulations. It's an affordable option suitable for both beginners and experienced artists.",
    explore: ["Papier-Mâché", "Smooth", "Hard", "Crystal Rose", "Navy Blue"],
    image: "",
    alt: "",
  },
  "Foam Sheets": {
    blurb: "Soft, lightweight, easy to cut, good for beginners",
    description: "Foam sheets are thin, flexible materials that can be easily cut, shaped, and layered. Their uniform thickness and variety of colors make them perfect for creating relief designs and tactile patterns. The material's forgiving nature allows for easy corrections and modifications, making it ideal for prototyping and educational projects.",
    techniques: ["Cutting", "Layering", "Heat forming", "Embossing", "Perforation"],
    availability: "Found in craft stores and educational supply shops, foam sheets are inexpensive and come in various thicknesses and colors. They're particularly well-suited for classroom and group projects.",
    explore: ["Felt", "Soft", "Smooth", "Crystal Rose", "Lavender"],
    image: "",
    alt: "",
  },
  "Metal Wire": {
    blurb: "Flexible, thin, ideal for intricate shapes",
    description: "Metal wire is a versatile material that can be bent, twisted, and shaped into complex forms. Its strength and malleability make it perfect for creating three-dimensional line drawings, armatures for sculptures, or standalone pieces. The material can be combined with other elements to create mixed-media works with interesting tactile contrasts.",
    techniques: ["Bending", "Weaving", "Coiling", "Wrapping", "Linking"],
    availability: "Available in various gauges and types at hardware stores and craft suppliers. Different metals offer different properties - copper is soft and easy to work with, while steel provides more strength.",
    explore: ["Aluminum Foil", "Hard", "Smooth", "Charcoal Gray", "Navy Blue"],
    image: "",
    alt: "",
  },
  "Felt": {
    blurb: "Soft, versatile fabric for layering and stitching",
    description: "Felt is a dense, non-woven fabric that holds its shape well and can be easily cut without fraying. Its soft texture and variety of thicknesses make it ideal for creating layered compositions and soft sculptures. The material's natural grip allows for easy stacking and assembly without always requiring adhesives.",
    techniques: ["Cutting", "Layering", "Needle felting", "Appliqué", "Stitching"],
    availability: "Widely available at fabric and craft stores in various weights and colors. Both synthetic and wool options offer different tactile qualities and working properties.",
    explore: ["Foam Sheets", "Soft", "Fuzzy", "Crystal Rose", "Lavender"],
    image: "",
    alt: "",
  },
  "Oil Paints": {
    blurb: "Rich, smooth texture, great for adding colors and blending",
    description: "Oil paints offer exceptional blending capabilities and a rich, buttery consistency that can be manipulated to create various textures. Their slow drying time allows for extended working periods and complex layering techniques. The medium can be built up to create substantial tactile surfaces through impasto techniques.",
    techniques: ["Impasto", "Glazing", "Blending", "Scumbling", "Palette knife application"],
    availability: "Found in art supply stores in various qualities and price points. While more expensive than other paints, their versatility and working properties make them valuable for serious artists.",
    explore: ["Acrylic Paint", "Smooth", "Slippery", "Navy Blue", "Crimson"],
    image: "",
    alt: "",
  },
  "Acrylic Paint": {
    blurb: "Fast-drying, versatile, vibrant colors",
    description: "Acrylic paint is a quick-drying medium that can be used in both thin washes and thick, textural applications. It adheres well to most surfaces and can be modified with various mediums to create different effects. The paint's versatility makes it excellent for building layers and creating varied surface textures.",
    techniques: ["Texturing", "Pouring", "Dry brushing", "Mixed media", "Gel medium applications"],
    availability: "Readily available at all art supply stores in various grades from student to professional quality. The wide range of complementary mediums and additives expands its possibilities.",
    explore: ["Oil Paints", "Smooth", "Hard", "Golden Yellow", "Emerald"],
    image: "",
    alt: "",
  },
  "Pipe Cleaners": {
    blurb: "Fuzzy, flexible, easy to bend, good for shaping",
    description: "Pipe cleaners combine a flexible wire core with a soft, fuzzy exterior, making them perfect for creating both structural and tactile elements. Their ability to hold shapes while remaining somewhat flexible allows for easy manipulation and adjustment. The fuzzy texture adds an interesting tactile dimension to sculptures and assemblages.",
    techniques: ["Twisting", "Bundling", "Weaving", "Wrapping", "Shape forming"],
    availability: "Inexpensive and available at most craft stores in various colors and thicknesses. Their durability and ease of use make them particularly suitable for educational projects.",
    explore: ["Metal Wire", "Fuzzy", "Soft", "Crystal Rose", "Lavender"],
    image: "",
    alt: "",
  },
  "Beads": {
    blurb: "Small, textured, perfect for adding detail",
    description: "Beads offer infinite possibilities for creating texture through pattern and arrangement. Available in various sizes, shapes, and materials, they can be used to create both visual and tactile interest. Their modularity allows for systematic or random arrangements, creating surfaces that engage touch and sight.",
    techniques: ["Stringing", "Weaving", "Surface application", "Pattern making", "Texture mapping"],
    availability: "Found in craft stores and specialty bead shops in countless varieties. Materials range from glass and wood to plastic and metal, each offering unique tactile properties.",
    explore: ["Metal Wire", "Bumpy", "Hard", "Crystal Rose", "Navy Blue"],
    image: "",
    alt: "",
  },
  "Papier-Mâché": {
    blurb: "Layered, hardened paper with a slightly rough, sculptable texture. Lightweight yet sturdy.",
    description: "Papier-mâché is a composite material made from paper pulp or strips bound with adhesive. It can be molded into complex shapes and dries to a sturdy but lightweight form. The surface can be smooth or intentionally textured, and it accepts paint and other finishes well.",
    techniques: ["Layering", "Molding", "Surface building", "Sculpting", "Texturing"],
    availability: "Can be made from basic materials like paper and glue, or purchased as a prepared pulp. Its low cost and accessibility make it perfect for large-scale projects.",
    explore: ["Air-Dry Clay", "Rough", "Hard", "Charcoal Gray", "Golden Yellow"],
    image: "",
    alt: "",
  },
  "Natural Fibers": {
    blurb: "Organic materials like jute, hemp, or cotton for texture and strength",
    description: "Natural fibers provide organic texture and varying degrees of strength, perfect for creating both structural and decorative elements. These materials can be twisted, woven, or layered to create complex textures and patterns. Their natural variations add unique character to each piece.",
    techniques: ["Weaving", "Knotting", "Braiding", "Surface application", "Texture building"],
    availability: "Available from craft stores and specialty fiber shops. Many natural fibers can also be sourced directly from agricultural suppliers.",
    explore: ["Felt", "Fuzzy", "Soft", "Golden Yellow", "Sage Green"],
    image: "",
    alt: ""
  },
  "Glass Beads": {
    blurb: "Transparent or frosted beads for catching light and adding texture",
    description: "Glass beads offer both visual and tactile interest through their smooth surfaces and ability to catch and reflect light. They can be used to create patterns, add weight to pieces, or create areas of visual focus. Their durability makes them excellent for frequently touched artwork.",
    techniques: ["Stringing", "Surface mounting", "Pattern creation", "Light play", "Texture mapping"],
    availability: "Found in bead stores and craft shops in various sizes and finishes. Quality and price range from basic to artistic grade.",
    explore: ["Beads", "Smooth", "Hard", "Crystal Rose", "Blue Turquoise"],
    image: "",
    alt: ""
  },
};

const ARTWORK = {
  "Dance (I)": {
    image: "Dance (I).jpg", // IMAGE_FILE under /img
    alt: "PLACEHOLDER",
    description: `Matisse created Dance (I) as a study for a painting commissioned by the Russian businessman and arts patron Sergei Shchukin. The final work and its pendant painting, Music (both completed in 1910), are housed in the collection of the Hermitage Museum in St. Petersburg. Dance (I) marks a moment in Matisse’s career when he embraced a reductive approach to painting, seeking the expressive potentials of fundamental elements: line, color, and form.

This daring approach was influenced by the increasing sophistication of photographic technology. In 1909 the artist observed, “The painter no longer has to preoccupy himself with details. The photograph is there to render the multitude of details a hundred times better and more quickly. Plastic form will present emotion as directly as possible and by the simplest means.” Across this monumental canvas Matisse used only four naturalistic colors: blue for the sky, green for the ground, and black and pale pink in rendering the five figures. Although he made adjustments to the composition, Matisse’s final lines convey a remarkable fluidity and sense of dynamic movement in their economical application—in the sweeping curve along the front side of the left figure, for example, and along the outstretched arms of the dancers as they come together in an unhampered expression of joy.`,
    notes: {
      artist: "Henri Matisse",
      medium: "Oil on canvas",
      dimensions: "259.7 cm x 390.1 cm (102.2 in x 153.6 in)",
      year: "1909",
      creation: "Paris, Boulevard des Invalides",
      location: "Museum of Modern Art, New York City",
    },
    audio: "Matisse Dance I Verbal Description.mp3", // AUDIO_FILE under /audio
    credit: "Museum of Modern Art (MoMA)",
    explore: ["Emerald", "Navy Blue", "Slippery", "Soft", "Oil Paints", "Felt", "Papier-Mâché"]
  }
}