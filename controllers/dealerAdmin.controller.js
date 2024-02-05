import { ObjectId } from "mongodb";
import DealerAdmin from "../models/dealerAdmin/dealerAdmin.model.js";
import User from "../models/user.model.js";
import SuperAdmin from "../models/superAdmin/superAdmin.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerDealer = async (req, res, next) => {
  console.log(req.userId);
  console.log(req.role);

  try {
    const role = req.role; // Assuming you have a role field in the request body
    if (role !== "SUPERADMIN") {
      return res
        .status(403)
        .json({ message: "Only super admins can create dealer admins." });
    }

    // Create a new user for the dealer admin
    const { fullName, email, password, country, phone } = req.body; // Get user details from the request
    const hash = bcrypt.hashSync(password, 5);
    const user = new User({
      fullName: fullName,
      password: hash,
      email: email,
      country: country,
      phone: phone,
      role: "DEALERADMIN",
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Create the dealer admin with the assigned class
    const { classes } = req.body; // Assuming you have a classes field in the request body
    const dealerAdmin = new DealerAdmin({
      user: savedUser._id,
      classes,
    });

    // Save the dealer admin to the database
    await dealerAdmin.save();

    res.status(201).json({ message: "Dealer admin created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const loginDealer = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "60d" }
    );

    const { password, ...info } = user._doc;
    // console.log("user ID : ", req.userId)
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

// Get SuperAdmin By Id
export const getDealerAdmin = async (req, res, next) => {
  try {
    console.log(req.params.id)
    const dealerAdmin = await DealerAdmin.findOne({ user: req.params.id }).populate(
      "user"
    );
    console.log(dealerAdmin)
    if (!dealerAdmin) {
      return res.status(400).send("Dealer admin not found");
    }

    res.send({ dealerAdmin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Update Dealer Admin
export const updateDealerAdmin = async (req, res, next) => {
  try {
    const dealerAdmin = await DealerAdmin.findOne({ user: req.body?._id }).populate("user");

    if (!dealerAdmin) {
      return res.status(404).send("Dealer admin not found");
    }

    const { fullName, email, role, phone, country, classes } = req.body;

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

    if (classes) {
      dealerAdmin.classes = classes;
    }

    // Save the changes to the User document and catch any errors
    try {
      await dealerAdmin.user.save();
    } catch (userSaveError) {
      console.error('Error saving user:', userSaveError);
      return res.status(500).send(`Error saving user: ${userSaveError.message}`);
    }

    // Save the changes to the DealerAdmin document
    const updatedDealerAdmin = await dealerAdmin.save();

    res.send({ dealerAdmin: updatedDealerAdmin });
  } catch (error) {
    console.error('General error:', error);
    res.status(500).send(error.message);
  }
};



//delete Dealer Admin

export const deleteDealerAdmin = async (req, res, next) => {
  try {

    const dealerAdmin = await DealerAdmin.findOne({ user: req.body._id });

    if (!dealerAdmin) {
      return res.status(404).send("Dealer admin not found");
    }

    const userId = dealerAdmin.user;
    await User.findByIdAndRemove(userId);

    await DealerAdmin.deleteOne({ _id: dealerAdmin._id });

    res.send({
      message: "Dealer admin and associated user deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
