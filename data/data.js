const COLORS = {
  "Crimson": {
    hex: "#ad1c42",
    description: "Crimson is a deep, cool red with a hint of blue, making it darker and more intense than ruby or cherry red. It stands apart from warmer reds like scarlet and vermilion, and is deeper than pink or lighter reds like coral.",
    seen:"Crimson can be seen in deep red roses, autumn leaves, or royal clothing. It symbolizes passion, love, power, and intensity, often evoking strong emotions like desire or courage. It can also represent luxury and mystery.",
    explore:["Burnt Orange", "Hard", "Crystal Rose", "Blue Turquoise"],
  },
  "Golden Yellow": {
    hex: "#cb8f16",
    description: "",
    seen:"",
    explore:[],
  },
  "Emerald": {
    hex: "#009877",
    description: "",
    seen:"",
    explore:[],
  },
  "Navy Blue": {
    hex: "#403f6f",
    description: "",
    seen:"",
    explore: [],
  },
  "Lavender": {
    hex: "#b2a4d4",
    description: "",
    seen:"",
    explore: [],
  },
  "Burnt Orange": {
    hex: "#c7632c",
    description: "",
    seen:"",
    explore: [],
  },
  "Charcoal Gray": {
    hex: "#6a6a6a",
    description: "",
    seen:"",
    explore: [],
  },
  "Blue Turquoise": {
    hex: "#52b0ae",
    description: "",
    seen:"",
    explore: [],
  },
  "Crystal Rose": {
    hex: "#fdc4c7",
    description: "",
    seen:"",
    explore: [],
  }
};

const TEXTURES = {
  "Smooth": {
    blurb: "Even, polished surface with no roughness",
    create: "To achieve a smooth surface in tactile art, explore materials that naturally lend themselves to a polished feel, such as fine clay, soft fabric, or sanded wood. Consider layering techniques—building up thin, even coats of paint, glue, or plaster can help smooth out rough areas. Tools like sandpaper, sponges, or even a damp cloth can refine textures, while sealing with varnish, wax, or resin can enhance the sleekness.",
    explore: ["Air-Dry Clay", "Papier-Mâché", "Soft", "Blue Turquoise", "Charcoal Gray"]
  },
  "Rough": {
    blurb: "Coarse, uneven surface with bumps or ridges",
    create: "",
    explore: [],
  },
  "Fuzzy": {
    blurb: "Soft, slightly hairy or fluffy texture",
    create: "",
    explore: [],
  },
  "Bumpy": {
    blurb: "Raised areas creating an irregular surface",
    create: "",
    explore: [],
  },
  "Slippery": {
    blurb: "Slick, hard to grip, often glossy or wet",
    create: "",
    explore: [],
  },
  "Gritty": {
    blurb: "Small, grainy particles creating a sandy feel",
    create: "",
    explore: [],
  },
  "Sticky": {
    blurb: "Tacky, adhesive surface that clings to touch",
    create: "",
    explore: [],
  },
  "Soft": {
    blurb: "Gentle, cushion-like feel, easy to press into",
    create: "",
    explore: [],
  },
  "Hard": {
    blurb: "Firm, unyielding surface with no give",
    create: "",
    explore: [],
  }
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
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Foam Sheets": {
    blurb: "Soft, lightweight, easy to cut, good for beginners",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Metal Wire": {
    blurb: "Flexible, thin, ideal for intricate shapes",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Felt": {
    blurb: "Soft, versatile fabric for layering and stitching",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Oil Paints": {
    blurb: "Rich, smooth texture, great for adding colors and blending",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Acrylic Paint": {
    blurb: "Fast-drying, versatile, vibrant colors",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Pipe Cleaners": {
    blurb: "Fuzzy, flexible, easy to bend, good for shaping",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Beads": {
    blurb: "Small, textured, perfect for adding detail",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  },
  "Papier-Mâché": {
    blurb: "Layered, hardened paper with a slightly rough, sculptable texture. Lightweight yet sturdy.",
    description: "",
    techniques: [],
    availability: "",
    explore: [],
    image: "",
    alt: "",
  }
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