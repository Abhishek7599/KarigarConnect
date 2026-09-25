const express = require("express");
const auth = require("../middleware/auth");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getBusinessInsights,
} = require("../controllers/product.controller");

const router = express.Router();
router.use(auth);

/*
=====================================================
CREATE PRODUCT
=====================================================
*/

router.post(
  "/create",
  createProduct
);

/*
=====================================================
BUSINESS INSIGHTS
IMPORTANT:
Must be BEFORE /:id
=====================================================
*/

router.get(
  "/insights",
  getBusinessInsights
);

/*
=====================================================
GET ALL PRODUCTS
=====================================================
*/

router.get(
  "/",
  getProducts
);

/*
=====================================================
GET PRODUCT BY ID
=====================================================
*/

router.get(
  "/:id",
  getProductById
);

/*
=====================================================
UPDATE PRODUCT
=====================================================
*/

router.put(
  "/:id",
  updateProduct
);

/*
=====================================================
DELETE PRODUCT
=====================================================
*/

router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;
