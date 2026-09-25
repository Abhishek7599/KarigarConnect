const Product = require("../models/product.model");

/*
=====================================================
LOCALIZE PRODUCT
=====================================================
*/

const localizeProduct = (
  product,
  language = "en"
) => {
  const productObject =
    product.toObject
      ? product.toObject()
      : product;

  /*
  ---------------------------------------------------
  ENGLISH
  ---------------------------------------------------
  */

  if (language === "en") {
    return productObject;
  }

  /*
  ---------------------------------------------------
  GET SAVED TRANSLATION
  ---------------------------------------------------
  */

  let languageTranslation =
    null;

  /*
    Mongoose Map
  */

  if (
    product.translations &&
    typeof product.translations.get ===
      "function"
  ) {
    languageTranslation =
      product.translations.get(
        language
      );
  }

  /*
    Normal JavaScript object fallback
  */

  if (
    !languageTranslation &&
    productObject.translations
  ) {
    languageTranslation =
      productObject.translations[
        language
      ];
  }

  /*
  ---------------------------------------------------
  NO TRANSLATION
  ---------------------------------------------------
  */

  if (!languageTranslation) {
    return productObject;
  }

  /*
  ---------------------------------------------------
  MERGE TRANSLATED FIELDS
  ---------------------------------------------------
  */

  return {
    ...productObject,

    name:
      languageTranslation.name ||
      productObject.name,

    category:
      languageTranslation.category ||
      productObject.category,

    region:
      languageTranslation.region ||
      productObject.region,

    description:
      languageTranslation.description ||
      productObject.description,
  };
};


/*
=====================================================
CREATE PRODUCT
=====================================================
*/

const createProduct = async (
  req,
  res
) => {
  try {
    const {
      artisan,
      name,
      category,
      description,
      material,
      color,
      craftType,
      craftTechnique,
      region,
      dimensions,
      productionTimeDays,
      costPrice,
      sellingPrice,
      stock,
      image,
      originalImage,
      status,
      studioImage,
      lifestyleImage,
      modelImage,
      closeupImage,
    } = req.body;

    /*
    -------------------------------------------------
    REQUIRED FIELDS
    -------------------------------------------------
    */

    if (
      !artisan ||
      !name ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Artisan, name and category are required",
      });
    }

    /*
    -------------------------------------------------
    CREATE PRODUCT
    -------------------------------------------------
    */

    const product =
      await Product.create({
        artisan: req.user._id,
        name,
        category,
        description,
        material,
        color,
        craftType,
        craftTechnique,
        region,
        dimensions,
        productionTimeDays,
        costPrice,
        sellingPrice,
        stock,
        image,
        originalImage,
        status: status === "published" ? "published" : "draft",
        studioImage,
        lifestyleImage,
        modelImage,
        closeupImage,
      });

    res.status(201).json({
      message:
        "Product created successfully",

      product,
    });
  } catch (error) {
    console.error(
      "Product creation error:",
      error.message
    );

    res.status(500).json({
      message:
        "Something went wrong",
    });
  }
};


/*
=====================================================
GET PRODUCTS
=====================================================
*/

const getProducts = async (
  req,
  res
) => {
  try {
    const {
      artisan,
      lang = "en",
    } = req.query;

    /*
    -------------------------------------------------
    VALIDATE ARTISAN
    -------------------------------------------------
    */

    const currentArtisan = req.user._id;

    /*
    -------------------------------------------------
    FETCH PRODUCTS
    -------------------------------------------------
    */

    const products =
      await Product.find({
        artisan: currentArtisan,
      });

    /*
    -------------------------------------------------
    LOCALIZE PRODUCTS
    -------------------------------------------------
    */

    const localizedProducts =
      products.map(
        (product) =>
          localizeProduct(
            product,
            lang
          )
      );

    res.status(200).json({
      message:
        "Products fetched successfully",

      language: lang,

      products:
        localizedProducts,
    });
  } catch (error) {
    console.error(
      "Fetching products error:",
      error.message
    );

    res.status(500).json({
      message:
        "Something went wrong",
    });
  }
};


/*
=====================================================
GET PRODUCT BY ID
=====================================================
*/

const getProductById =
  async (req, res) => {
    try {
      const {
        lang = "en",
      } = req.query;

      /*
      -------------------------------------------------
      FIND PRODUCT
      -------------------------------------------------
      */

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      /*
      -------------------------------------------------
      LOCALIZE PRODUCT
      -------------------------------------------------
      */

      const localizedProduct =
        localizeProduct(
          product,
          lang
        );

      res.status(200).json({
        message:
          "Product fetched successfully",

        language: lang,

        product:
          localizedProduct,
      });
    } catch (error) {
      console.error(
        "Fetching product error:",
        error.message
      );

      res.status(500).json({
        message:
          "Something went wrong",
      });
    }
  };


/*
=====================================================
UPDATE PRODUCT
=====================================================
*/

const updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      message:
        "Product updated successfully",

      product,
    });
  } catch (error) {
    console.error(
      "Product update error:",
      error.message
    );

    res.status(500).json({
      message:
        "Something went wrong",
    });
  }
};


/*
=====================================================
DELETE PRODUCT
=====================================================
*/

const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Product deletion error:",
      error.message
    );

    res.status(500).json({
      message:
        "Something went wrong",
    });
  }
};


/*
=====================================================
BUSINESS INSIGHTS
=====================================================
*/

const getBusinessInsights =
  async (req, res) => {
    try {
      const artisan = req.user._id;

      /*
      -------------------------------------------------
      FETCH PRODUCTS
      -------------------------------------------------
      */

      const products =
        await Product.find({
          artisan,
        });

      /*
      -------------------------------------------------
      BASIC COUNTS
      -------------------------------------------------
      */

      const totalProducts =
        products.length;

      const publishedProducts =
        products.filter(
          (product) =>
            product.status ===
            "published"
        ).length;

      const draftProducts =
        products.filter(
          (product) =>
            product.status ===
            "draft"
        ).length;

      /*
      -------------------------------------------------
      STOCK
      -------------------------------------------------
      */

      const totalStock =
        products.reduce(
          (total, product) =>
            total +
            (Number(
              product.stock
            ) || 0),
          0
        );

      /*
      -------------------------------------------------
      LOW STOCK
      -------------------------------------------------
      */

      const lowStockProducts =
        products.filter(
          (product) => {
            const stock =
              Number(
                product.stock
              ) || 0;

            return (
              stock > 0 &&
              stock <= 3
            );
          }
        ).length;

      /*
      Products with zero stock
      */

      const outOfStockProducts =
        products.filter(
          (product) => {
            return (
              (Number(
                product.stock
              ) || 0) === 0
            );
          }
        ).length;

      /*
      -------------------------------------------------
      PRICES
      -------------------------------------------------
      */

      const sellingPrices =
        products
          .map(
            (product) =>
              Number(
                product.sellingPrice
              ) || 0
          )
          .filter(
            (price) =>
              price > 0
          );

      const costPrices =
        products
          .map(
            (product) =>
              Number(
                product.costPrice
              ) || 0
          )
          .filter(
            (price) =>
              price > 0
          );

      /*
      -------------------------------------------------
      AVERAGE SELLING PRICE
      -------------------------------------------------
      */

      const averageSellingPrice =
        sellingPrices.length
          ? Math.round(
              sellingPrices.reduce(
                (total, price) =>
                  total + price,
                0
              ) /
                sellingPrices.length
            )
          : 0;

      /*
      -------------------------------------------------
      HIGHEST / LOWEST PRICE
      -------------------------------------------------
      */

      const highestSellingPrice =
        sellingPrices.length
          ? Math.max(
              ...sellingPrices
            )
          : 0;

      const lowestSellingPrice =
        sellingPrices.length
          ? Math.min(
              ...sellingPrices
            )
          : 0;

      /*
      -------------------------------------------------
      TOTAL COST
      -------------------------------------------------
      */

      const totalProductionCost =
        products.reduce(
          (total, product) => {
            const cost =
              Number(
                product.costPrice
              ) || 0;

            const stock =
              Number(
                product.stock
              ) || 0;

            return (
              total +
              cost * stock
            );
          },
          0
        );

      /*
      -------------------------------------------------
      TOTAL INVENTORY VALUE
      -------------------------------------------------
      */

      const totalInventoryValue =
        products.reduce(
          (total, product) => {
            const price =
              Number(
                product.sellingPrice
              ) || 0;

            const stock =
              Number(
                product.stock
              ) || 0;

            return (
              total +
              price * stock
            );
          },
          0
        );

      /*
      -------------------------------------------------
      POTENTIAL PROFIT
      -------------------------------------------------
      */

      const potentialProfit =
        totalInventoryValue -
        totalProductionCost;

      /*
      -------------------------------------------------
      PROFIT MARGIN
      -------------------------------------------------
      */

      const potentialProfitMargin =
        totalInventoryValue > 0
          ? Math.round(
              (potentialProfit /
                totalInventoryValue) *
                100
            )
          : 0;

      /*
      -------------------------------------------------
      CATEGORY BREAKDOWN
      -------------------------------------------------
      */

      const categoryMap =
        {};

      products.forEach(
        (product) => {
          const category =
            product.category ||
            "Other";

          if (
            !categoryMap[
              category
            ]
          ) {
            categoryMap[
              category
            ] = 0;
          }

          categoryMap[
            category
          ] += 1;
        }
      );

      const categoryBreakdown =
        Object.entries(
          categoryMap
        )
          .map(
            ([
              category,
              count,
            ]) => ({
              category,
              count,
            })
          )
          .sort(
            (a, b) =>
              b.count -
              a.count
          );

      /*
      -------------------------------------------------
      PRODUCT PERFORMANCE HELPERS
      -------------------------------------------------
      */

      const topPricedProducts =
        [...products]
          .sort(
            (a, b) =>
              (Number(
                b.sellingPrice
              ) || 0) -
              (Number(
                a.sellingPrice
              ) || 0)
          )
          .slice(0, 5)
          .map(
            (product) => ({
              id:
                product._id,

              name:
                product.name,

              sellingPrice:
                Number(
                  product.sellingPrice
                ) || 0,

              stock:
                Number(
                  product.stock
                ) || 0,
            })
          );

      const lowStockList =
        products
          .filter(
            (product) =>
              (Number(
                product.stock
              ) || 0) <= 3
          )
          .sort(
            (a, b) =>
              (Number(
                a.stock
              ) || 0) -
              (Number(
                b.stock
              ) || 0)
          )
          .slice(0, 10)
          .map(
            (product) => ({
              id:
                product._id,

              name:
                product.name,

              stock:
                Number(
                  product.stock
                ) || 0,
            })
          );

      /*
      -------------------------------------------------
      RESPONSE
      -------------------------------------------------
      */

      return res.status(200).json({
        message:
          "Business insights generated successfully.",

        artisan,

        insights: {
          totalProducts,

          publishedProducts,

          draftProducts,

          totalStock,

          lowStockProducts,

          outOfStockProducts,

          averageSellingPrice,

          highestSellingPrice,

          lowestSellingPrice,

          totalProductionCost,

          totalInventoryValue,

          potentialProfit,

          potentialProfitMargin,

          categoryBreakdown,

          topPricedProducts,

          lowStockList,
        },
      });
    } catch (error) {
      console.error(
        "Business insights error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to generate business insights.",
      });
    }
  };


/*
=====================================================
EXPORT
=====================================================
*/

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBusinessInsights,
};
