import Settings from "../models/settings.model.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
export const createSettings = async (req, res, next) => {
  try {
    const { user, fullName, email, phone, password, confirm_password } =
      req.body;

    // Validate the request data
    console.log(req.body);
    if (
      !fullName ||
      !user ||
      !email ||
      !phone ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hash = bcrypt.hashSync(password, 5);
    // Create a new product instance
    if (password == confirm_password) {
      const newSettings = new Settings({
        user,
        fullName,
        email,
        phone,
        password: hash,
        confirm_password: hash,
      });

      // Save the product to the database
      const savedSettings = await newSettings.save();

      res.status(201).json(savedSettings);
    } else {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password fields not matched" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get settings by id
export const getSettingsByID = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Find all products that belong to the specified user_id
    const settings = await Settings.findOne({ user: user_id });

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching products by user_id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update settings
export const updateSettingsById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const settings = await Settings.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!settings) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: settings });
    }
  } catch (error) {
    next(error);
  }
};

//update user settings
export const updateUserSettingsById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const settings = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!settings) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: settings });
    }
  } catch (error) {
    next(error);
  }
};

//delete settings

export const deleteSettingByID = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Settings.deleteOne({ _id: req.body._id });
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
