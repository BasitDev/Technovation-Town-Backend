import Admin from "../models/ot/ot.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//register ot
export const registerOt = async (req, res, next) => {
  try {
    // Check if the user making the request is a super admin
    const { role } = req.body; // Assuming you have a role field in the request body

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
      isActive: false,
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

//register OT by Super Admin
export const registerOtBySuperAdmin = async (req, res, next) => {
  try {
    // Check if the user making the request is a super admin
    const { role } = req.body; // Assuming you have a role field in the request body

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
      isActive: true,
    });

    // Save the dealer admin to the database
    await dealerRep.save();

    res.status(201).json({ message: "OT created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//login ot

export const loginOt = async (req, res, next) => {
  // try {
  //   const user = await Admin.find()
  //     .populate("user")
  //     .findOne({ user: { email: req.body.email } });

  //   console.log("User", user);
  //   // const current = user.findOne({ email: req.body.email });
  //   res.status(201).json({ success: 1, data: user });
  //   // const user = await User.findOne({ email: req.body.email });

  //   // if (!user) return next(createError(404, "User not found!"));

  //   // const isCorrect = bcrypt.compareSync(req.body.password, user.password);
  //   // if (!isCorrect)
  //   //   return next(createError(400, "Wrong password or username!"));

  //   // const token = jwt.sign(
  //   //   {
  //   //     id: user._id,
  //   //   },
  //   //   process.env.JWT_KEY,
  //   //   { expiresIn: "60d" }
  //   // );

  //   // const { password, ...info } = user._doc;
  //   // // console.log("user ID : ", req.userId)
  //   // res
  //   //   .cookie("accessToken", token, {
  //   //     httpOnly: true,
  //   //   })
  //   //   .status(200)
  //   //   .send(info);
  // } catch (err) {
  //   next(err);
  // }
  const { email, password } = req.body;

  try {
    // Find the OT by email and role
    const ot = await User.findOne({ email, role: "OT" });

    if (!ot) {
      return res
        .status(401)
        .json({ message: "Authentication failed. OT not found." });
    }

    // Check the OT's status
    const otStatus = await Admin.findOne({ user: ot._id });

    if (!otStatus || !otStatus.isActive) {
      return res
        .status(401)
        .json({ message: "Authentication failed. OT is not active." });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, ot.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: ot._id,
        role: ot.role,
      },
      "your-secret-key", // Replace with your actual secret key
      { expiresIn: "1h" } // Token expiration time
    );

    res.status(200).json({ token, role: ot.role, user: ot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get Ot By Id
export const getOTById = async (req, res, next) => {
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
      return res.status(400).send("OT not found");
    }

    res.send({ dealerAdmin });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update Ot By Id
export const updateOtById = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter

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

//Delte Ot by Id

export const deleteOt = async (req, res, next) => {
  try {
    const { id } = req.body; // Assuming you're passing the dealer admin's ID as a route parameter

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
