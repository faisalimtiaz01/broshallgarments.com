import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productsCountController,
  productListContrller,
  searchProductContrller,
  realtedProductContrller,
  productCategoryController,
  briantreeTokenController,
  braintreepaymentsController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//routes

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single products
router.get("/get-product/:slug", getSingleProductController);
//get photo
router.get("/product-photo/:pid", getProductPhotoController);
//delet product
router.delete("/delete-product/:pid", deleteProductController);
//filter product
router.post("/product-filters", productFiltersController);

//count products
router.get("/product-count", productsCountController);

//product perpage
router.get("/product-list/:page" , productListContrller)
//search product
router.get("/search/:keyword" , searchProductContrller)
//similar products
router.get('/related-product/:pid/:cid',realtedProductContrller)
//category wise products
router.get('/product-category/:slug',productCategoryController)

//payment route
// token
router.get('/braintree/token',briantreeTokenController)
//payments
router.post('/braintree/payments',requireSignIn,braintreepaymentsController)
export default router;
