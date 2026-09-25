const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const buildBackgroundPrompt = ({
  name,
  category,
  material,
  color,
  craftType,
  craftTechnique,
  region,
  style,
}) => {
  const materialText = Array.isArray(material)
    ? material.join(", ")
    : material || "";

  const colorText = Array.isArray(color)
    ? color.join(", ")
    : color || "";

  const baseRules = `
You are creating a professional e-commerce photograph for an
Indian artisan marketplace called KarigarConnect.

PRODUCT INFORMATION:
Name: ${name || ""}
Category: ${category || ""}
Material: ${materialText}
Color: ${colorText}
Craft type: ${craftType || ""}
Craft technique: ${craftTechnique || ""}
Region: ${region || ""}

CRITICAL PRODUCT RULES:
- Preserve the actual uploaded product.
- Do not redesign the product.
- Do not change its shape.
- Do not change its colors.
- Do not change its patterns.
- Do not remove authentic handmade details.
- Do not add logos.
- Do not add text.
- Do not duplicate the product.
- Create a realistic commercial photograph.
`;

  const stylePrompts = {
    studio: `
PHOTO STYLE:
Premium studio product photograph.

Create a clean professional studio environment suitable
for this specific product.

Use:
- appropriate neutral or softly colored background
- professional softbox-style lighting
- realistic grounding shadow
- clean composition
- premium e-commerce photography
- enough negative space around the product
`,

    lifestyle: `
PHOTO STYLE:
Lifestyle product photograph.

Choose a realistic environment that naturally fits the
product and its craft tradition.

Examples:
- textile products → elegant textile/interior setting
- pottery → tasteful artisan pottery setting
- jewellery → premium elegant display
- wooden crafts → warm artisan environment
- home decor → refined home interior

The background should support the product without
overpowering it.
Use realistic depth, shadows and lighting.
`,

    model: `
PHOTO STYLE:
Professional product display/model photograph.

Choose the most appropriate presentation for the product.

For wearable products such as sarees, shawls, scarves,
bags or jewellery, create a realistic fashion/display
presentation.

For non-wearable products, create an appropriate human-free
display arrangement instead of forcing a person into the scene.

Keep the actual product faithful to the uploaded reference.
Use professional commercial lighting.
`,

    closeup: `
PHOTO STYLE:
Premium close-up craftsmanship photograph.

Create a visually rich background appropriate to the product.

The camera should frame the product more tightly and emphasize:
- handmade craftsmanship
- texture
- material
- weaving
- carving
- embroidery
- fine details

Use realistic professional macro/product photography.
The background should remain subtle and secondary.
`,
  };

  return `
${baseRules}

${stylePrompts[style] || stylePrompts.studio}

Generate a polished marketplace-ready image.
The final result should look like a professional photographer
prepared the product for an online artisan marketplace.
`;
};

const generateStyledProductImage = async ({
  imageBase64,
  mimeType,
  product,
  style,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing in backend .env"
    );
  }

  if (!imageBase64) {
    throw new Error(
      "Product image data is required."
    );
  }

  const prompt = buildBackgroundPrompt({
    ...product,
    style,
  });

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-image",

    input: [
      {
        type: "image",
        mime_type: mimeType,
        data: imageBase64,
      },
      {
        type: "text",
        text: prompt,
      },
    ],

    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: "1:1",
      image_size: "1K",
    },
  });

  if (!interaction.output_image) {
    throw new Error(
      "AI did not return an image."
    );
  }

  return {
    imageBase64:
      interaction.output_image.data,

    mimeType:
      interaction.output_image.mime_type ||
      "image/png",

    style,
  };
};

module.exports = {
  generateStyledProductImage,
  buildBackgroundPrompt,
};