import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';
dotenv.config();

//payment gaetway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  console.log("Creating product");
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required.." });
      case !description:
        return res.status(400).send({ message: "description is required.." });
      case !price:
        return res.status(400).send({ message: "price is required.." });
      case !category:
        return res.status(400).send({ message: "category is required.." });
      case !quantity:
        return res.status(400).send({ message: "quantity is required.." });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "photo is required and should be less then 1mb" });
    }
    const products = await productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong",
      error,
    });
  }
};
//getProductController
export const getProductController = async (req, res) => {
  console.log("get products");
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      messsage: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong",
      error: error.message,
    });
  }
};
//getSingleProductController
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "single product found",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Sorry, something went wrong",
      error: error.message,
    });
  }
};
//getProductPhotoController
export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
//deleteProductController
export const deleteProductController = async (req, res) => {
  console.log("deleteProductController");
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "product deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong while deleting product",
      error,
    });
  }
};
//updateProductController
export const updateProductController = async (req, res) => {
  console.log("REQ: ", req.files);

  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;

    console.log("fileds: ", req.fields);

    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(400).send({ message: "Name is required.." });
      case !description:
        return res.status(400).send({ message: "description is required.." });
      case !price:
        return res.status(400).send({ message: "price is required.." });
      case !category:
        return res.status(400).send({ message: "category is required.." });
      case !quantity:
        return res.status(400).send({ message: "quantity is required.." });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ message: "photo is required and should be less then 1mb" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product update successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong while updating product",
      error,
    });
  }
};

//filters product

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.lenth > 0) args.category = checked;
    if (radio.lenth) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong while",
      error,
    });
  }
};

// product count contriller

export const productsCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Sorry, something went wrong while counting products",
      error,
      success: false,
    });
  }
};

//product per page count

export const productListContrller = async (req, res) => {
  try {
    const perpage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong while counting products",
      error,
    });
  }
};

//search for products
export const searchProductContrller = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          {
            description: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Sorry, something went wrong while Api",
      error,
    });
  }
};
//realted product controller

export const realtedProductContrller = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Sorry, something went wrong while related produt",
      error,
    });
  }
};

//get prduct vise category
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Sorry, something went wrong getting products",
    });
  }
};

// payemrnt token contrller
export const briantreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//payemnt controller
export const braintreepaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ok:true})
        }else{
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
