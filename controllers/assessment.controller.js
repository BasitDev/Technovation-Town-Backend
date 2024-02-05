import Assessment from "../models/assessment.model.js";
import createError from "../utils/createError.js";

export const createAssessment = async (req, res, next) => {
  try {
    const { content, user } = req.body;

    // Validate the request data
    console.log(req.body);
    if (!content || !user) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product instance
    const newAssessment = new Assessment({
      content,
      user,
    });

    // Save the product to the database
    const savedAssesment = await newAssessment.save();

    res.status(201).json(savedAssesment);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all assessments

export const getAllAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find();
    if (assessments) {
      res.status(201).json({ success: 1, data: assessments });
    } else {
      res.status(500).json({ success: 0, message: "not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

//get assessment by id
export const getAssessmentByID = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Find all products that belong to the specified user_id
    const assessment = await Assessment.findOne({ _id: user_id });

    res.status(200).json(assessment);
  } catch (error) {
    console.error("Error fetching products by user_id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update assessment
export const updateAssessment = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const assessment = await Assessment.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
      }
    );
    if (!assessment) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: assessment });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAssessmentByID = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Assessment.deleteOne({ _id: req.body._id });
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
