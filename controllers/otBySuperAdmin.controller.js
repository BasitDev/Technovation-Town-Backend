import Admin from "../models/ot/ot.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import SuperAdmin from "../models/superAdmin/superAdmin.model.js";

export const registerOtBySuperAdmin = async (req, res, next) => {
  try {
    // Check if the user making the request is a super admin
    const { role } = req.body; // Assuming you have a role field in the request body
    const Adminuser = await SuperAdmin.findById(req.body.superAdminId);

    if (Adminuser?.role !== "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "Only super admins can create OT." });
    }

    // Create a new user for the dealer admin
    const { fullName, email, password, country, phone, isActive } = req.body; // Get user details from the request
    const hash = bcrypt.hashSync(password, 5);
    const user = new User({
      fullName: fullName,
      password: hash,
      email: email,
      country: country,
      phone: phone,
      role: "OT",
      isActive: true,
    });

    // Save the user to the database
    await user.save();

    // Create the dealer admin with the assigned class
    const { classes } = req.body; // Assuming you have a classes field in the request body
    const dealerRep = new Admin({
      user: user._id,
      classes,
      isActive: false,
    });

    // Save the dealer admin to the database
    await dealerRep.save();

    res.status(201).json({ message: "OT created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update Ot By Id
export const updateOtBySuperAdmin = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter
    const Adminuser = await SuperAdmin.findById(req.body.superAdminId);

    if (Adminuser?.role !== "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "Only super admins can update OT." });
    }

    // Retrieve the combined data of the dealer admin and user
    const dealerAdmin = await Admin.findOne({ user: id }).populate("user");

    if (!dealerAdmin) {
      return res.status(404).send("OT not found");
    }

    // Update only the fields that are provided in the request body
    const { fullName, email, role, phone, country } = req.body;

    if (fullName) {
      dealerAdmin.user.fullName = fullName;
    }

    if (email) {
      dealerAdmin.user.email = email;
    }

    if (phone) {
      dealerAdmin.phone = phone;
    }

    if (country) {
      dealerAdmin.user.country = country;
    }

    // Save the updated combined data
    const updatedDealerAdmin = await dealerAdmin.save();

    res.send({ dealerAdmin: updatedDealerAdmin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Delte Ot by Super Admin

export const deleteOtBySuperAdmin = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter
    const Adminuser = await SuperAdmin.findById(req.body.superAdminId);

    if (Adminuser?.role !== "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "Only super admins can delete OT." });
    }

    // Retrieve the combined data of the dealer admin and user
    const dealerAdmin = await Admin.findOne({ user: id });

    if (!dealerAdmin) {
      return res.status(404).send("OT not found");
    }

    // Delete the User associated with the dealer admin
    const userId = dealerAdmin.user;
    await User.findByIdAndRemove(userId);

    // Delete the Dealer Admin
    await Admin.deleteOne({ _id: dealerAdmin._id });

    res.send({
      message: "OT and associated user deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
