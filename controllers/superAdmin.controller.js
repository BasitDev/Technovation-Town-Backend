import { COOKIE_MAX_AGE } from "../constants/cookie.js";
import Admin from "../models/superAdmin/superAdmin.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    console.log("hash : ", req);
    const newUser = new Admin({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).json({ success: 1, message: "User Created Successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {

    const user = await Admin.findOne({ email: req.body.email }).select("+password");

    if (!user) return next(createError(404, "User not found!"));

    const { role } = user;
    if (role !== "SUPERADMIN") return next(createError(404, "Not Authorized!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_KEY,
      { expiresIn: "60d" }
    );

    const { password, ...info } = user._doc;
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE
    })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

// Get SuperAdmin By Id
export const getSuperAdmin = async (req, res, next) => {
  //need to change get param to query param
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ success: 0, message: "Id is required", data: {} });
    }
    const user = await Admin.findById(req.params.id);
    if (user) {
      res.status(201).json({ success: 1, data: user });
    } else {
      res.status(500).json({ success: 0, message: "Not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};


// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(500).json({ success: 0, message: "Not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};


//update User

export const updateAdmin = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const location = await Admin.findByIdAndUpdate(req.body._id, req.body);
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

//delete Super Admin

export const deleteAdmin = async (req, res, next) => {
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
