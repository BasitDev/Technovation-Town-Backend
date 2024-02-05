import Classes from "../models/superAdmin/classes.model.js";

export const createClasses = async (req, res, next) => {
  try {

    const reqClass = req.body;
    // Create a new product instance
    const newClass = new Classes(reqClass);

    // Save the product to the database
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get All Classes
export const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Classes.find();
    if (classes) {
      res.status(201).json({ success: 1, data: classes });
    } else {
      res.status(500).json({ success: 0, message: "not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

//update class
export const updateClassById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const classes = await Classes.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    if (!classes) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: classes });
    }
  } catch (error) {
    next(error);
  }
};

//delete class
export const deleteClass = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Classes.deleteOne({ _id: req.body._id });
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
