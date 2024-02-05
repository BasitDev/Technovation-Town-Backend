import Questionnaire from "../models/questionnaire.model.js";
import createError from "../utils/createError.js";

export const createQuestionnaire = async (req, res, next) => {
  try {
    const { content, user } = req.body;

    // Validate the request data
    console.log(req.body);
    if (!content || !user) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product instance
    const newQuestionnaire = new Questionnaire({
      content,
      user,
    });

    // Save the product to the database
    const savedQuestionnaire = await newQuestionnaire.save();

    res.status(201).json(savedQuestionnaire);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get alll questionnaire

export const getAllQuestionnaires = async (req, res, next) => {
  try {
    const questionnaire = await Questionnaire.find();
    if (questionnaire) {
      res.status(201).json({ success: 1, data: questionnaire });
    } else {
      res.status(500).json({ success: 0, message: "not found", data: {} });
    }
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

//get questionnaire by id
export const getQuestionnaireByID = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Find all products that belong to the specified user_id
    const questionnaire = await Questionnaire.findOne({ _id: user_id });

    res.status(200).json(questionnaire);
  } catch (error) {
    console.error("Error fetching products by user_id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update questionnaire
export const updateQuestionnaireById = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
      }
    );
    if (!questionnaire) {
      res
        .status(404)
        .json({ success: 0, message: "permission not found", data: {} });
    } else {
      res.status(200).json({ success: 1, data: questionnaire });
    }
  } catch (error) {
    next(error);
  }
};
export const deleteQuestionnaireByID = async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(400).json({ success: 0, message: "Id is required", data: {} });
    }
    const deleted = await Questionnaire.deleteOne({ _id: req.body._id });
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
