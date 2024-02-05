import Product from "../models/superAdmin/product.model.js";
import createError from "../utils/createError.js";

export const createProduct = async (req, res, next) => {
  try {
    const {
      product_title,
      product_price,
      product_description,
      classes,
      product_sku,
    } = req.body;

    // Validate the request data
    console.log(req.body);
    if (
      !product_title ||
      !product_price ||
      !product_description ||
      !classes ||
      !product_sku
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product instance
    const newProduct = new Product({
      product_sku,
      product_title,
      product_price,
      product_description,
      classes,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get locations

export const getAllProducts = async (req, res, next) => {
  try {
    const location = await Product.find();
    if (location) {
      res.status(201).json({ success: 1, data: location });
    } else {
      res.status(500).json({ success: 0, message: "not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const getProductsByUSerID = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Find all products that belong to the specified user_id
    const products = await Product.findOne({ _id: user_id });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by user_id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update product
export const updateProductById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const location = await Product.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!location) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: location });
    }
  } catch (error) {
    next(error);
  }
};

//delete product
export const deleteProduct = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Product.deleteOne({ _id: req.body._id });
    if (deleted.deletedCount == 0) {
      res.status(404).json({ success: 0, message: "No found!", data: {} });
    } else if (deleted.deletedCount == 1) {
      res
        .status(200)
        .json({ success: 1, message: "Deleted successfully", data: {} });
    } else {
      res.status(500).json({ success: 0, message: "server error", data: {} });
    }
  } catch (error) {
    next(error);
  }
};
