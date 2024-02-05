import Admin from "../models/dealerRep/dealerRep.model.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerDealerRep = async (req, res, next) => {
  // try {
  //   const hash = bcrypt.hashSync(req.body.password, 5);
  //   const newUser = new Admin({
  //     ...req.body,
  //     password: hash,
  //   });

  //   await newUser.save();
  //   res.status(201).send("User has been created.");
  // } catch (err) {
  //   next(err);
  // }
  try {
    // Check if the user making the request is a super admin
    const { role } = req.body; // Assuming you have a role field in the request body
    if (role !== "DEALERADMIN") {
      return res
        .status(403)
        .json({ message: "Only dealer admins can create dealer Reps." });
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
      role: "DEALERREP",
    });

    // Save the user to the database
    await user.save();

    // Create the dealer admin with the assigned class
    const { classes, dealer_admin_id } = req.body; // Assuming you have a classes field in the request body
    const dealerRep = new Admin({
      user: user._id,
      classes,
      dealer_admin_id: dealer_admin_id,
    });

    // Save the dealer admin to the database
    await dealerRep.save();

    res.status(201).json({ message: "Dealer Rep created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//login delaer rep

export const loginDealerRep = async (req, res, next) => {
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

// Get DealerRep By Id
export const getDealerRep = async (req, res, next) => {
  //need to change get param to query param
  try {
    // const user = await User.findById(req.params.id).select("-password");
    // if (!user) {
    //   return res.status(400).send("User not found");
    // }

    const dealerAdmin = await Admin.findOne({ user: req.params.id }).populate(
      "user"
    );
    if (!dealerAdmin) {
      return res.status(400).send("Dealer Rep not found");
    }

    res.send({ dealerAdmin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//update User

export const updateRealerRep = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter

    // Retrieve the combined data of the dealer admin and user
    const dealerAdmin = await Admin.findOne({ user: id }).populate("user");

    if (!dealerAdmin) {
      return res.status(404).send("Dealer Rep not found");
    }

    // Update only the fields that are provided in the request body
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

    // Save the updated combined data
    const updatedDealerAdmin = await dealerAdmin.save();

    res.send({ dealerAdmin: updatedDealerAdmin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete Dealer Rep

export const deleteDealerRep = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter

    // Retrieve the combined data of the dealer admin and user
    const dealerAdmin = await Admin.findOne({ user: id });

    if (!dealerAdmin) {
      return res.status(404).send("Dealer Rep not found");
    }

    // Delete the User associated with the dealer admin
    const userId = dealerAdmin.user;
    await User.findByIdAndRemove(userId);

    // Delete the Dealer Admin
    await Admin.deleteOne({ _id: dealerAdmin._id });

    res.send({
      message: "Dealer Rep and associated user deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
