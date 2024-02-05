import Admin from "../models/client/client.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register Client
export const createClient = async (req, res, next) => {
  try {
    const { email, otId, fullName, phone, country } = req.body;

    // Validate the request data
    if (!email || !otId || !fullName || !phone || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product instance
    const newProduct = new Admin({
      otId,
      email,
      fullName,
      phone,
      country,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Client By Id
export const getClientById = async (req, res, next) => {
  //need to change get param to query param
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ success: 0, message: "Id is required in url", data: {} });
    }
    const location = await Admin.findOne({ otId: req.params.id });
    console.log(req.params.id);
    if (location) {
      res.status(201).json({ success: 1, data: location });
    } else {
      res.status(500).json({ success: 0, message: "not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

//update Client By Id
export const updateClient = async (req, res, next) => {
  try {
    console.log("Try Block Run");
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const location = await Admin.findByIdAndUpdate(req.body._id, req.body, {
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
    console.log("Error", error);
    next(error);
  }
};

//Delete Client By Id
export const deleteClient = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Admin.deleteOne({ _id: req.body._id });
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
