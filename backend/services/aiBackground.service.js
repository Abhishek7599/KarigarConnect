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

NON-NEGOTIABLE REFERENCE-FIDELITY RULES:
- The uploaded photograph is the sole source of truth for the product.
- Preserve its exact silhouette, construction, color, material, pattern,
  hardware, proportions and handmade details.
- Do not replace, redraw, merge, duplicate, crop away or invent any part of
  the product.
- Do not add logos.
- Do not add text.
- Do not duplicate the product.
- Output one photorealistic commercial e-commerce photograph, never an
  illustration, CGI render, collage, cutout, or painted scene.
`;

  const stylePrompts = {
    studio: `
PHOTO STYLE:
Premium studio product photograph.

Create a clean professional studio environment suitable
for this specific product.

Use:
- a seamless warm-neutral studio backdrop
- large softbox key light, subtle fill light and controlled rim light
- realistic contact shadow directly beneath the product
- a sharp product, clean highlight control and natural material texture
- an editorial, premium e-commerce composition with generous negative space
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

Choose the most appropriate presentation for the product. Only show an adult
model when the product is wearable or intended to be carried/used by a person.

For wearable products such as sarees, shawls, scarves,
bags or jewellery, create a realistic fashion/display
presentation.

For non-wearable products, create an appropriate human-free
display arrangement instead of forcing a person into the scene.

Keep the actual product faithful to the uploaded reference.
Use a relatable adult Indian model, natural hands and anatomy, a natural pose,
and professional commercial lighting. The product must remain fully visible
and be the visual focus; never obscure, alter or duplicate it.
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

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image",
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType, data: imageBase64 } },
        { text: prompt },
      ],
    }],
    config: {
      responseModalities: ["IMAGE"],
      responseFormat: {
        image: {
          aspectRatio: "1:1",
          imageSize: "2K",
        },
      },
    },
  });

  const parts = response?.candidates?.flatMap(
    (candidate) => candidate?.content?.parts || []
  ) || [];
  const imagePart = parts.find((part) => part?.inlineData?.data);

  if (!imagePart) {
    throw new Error(
      "The AI service did not return an image. Please try again with a clear, well-lit product photo."
    );
  }

  return {
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/jpeg",

    style,
  };
};

module.exports = {
  generateStyledProductImage,
  buildBackgroundPrompt,
};
