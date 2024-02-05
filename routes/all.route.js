import express from "express";

const router = express.Router();
import {
  registerOt,
  loginOt,
  getOTById,
  updateOtById,
  deleteOt,
} from "../controllers/ot.controller.js";

import {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";

import {
  createProduct,
  getAllProducts,
  getProductsByUSerID,
  updateProductById,
  deleteProduct,
} from "../controllers/products.controller.js";

import {
  createClasses,
  getAllClasses,
  updateClassById,
  deleteClass,
} from "../controllers/classes.controller.js";

import {
  registerOtBySuperAdmin,
  updateOtBySuperAdmin,
  deleteOtBySuperAdmin,
} from "../controllers/otBySuperAdmin.controller.js";

import {
  createQuestionnaire,
  getAllQuestionnaires,
  getQuestionnaireByID,
  updateQuestionnaireById,
  deleteQuestionnaireByID,
} from "../controllers/questionnaire.controller.js";

import {
  createAssessment,
  getAllAssessments,
  getAssessmentByID,
  updateAssessment,
  deleteAssessmentByID,
} from "../controllers/assessment.controller.js";

import {
  createSettings,
  getSettingsByID,
  updateSettingsById,
  updateUserSettingsById,
  deleteSettingByID,
} from "../controllers/settings.controller.js";
import { verifyToken } from "../middleware/jwt.js";

//OT Routes
router.post("/register/ot", registerOt);
router.post("/registerBySuperAdmin/ot", registerOtBySuperAdmin);
router.post("/login/ot", loginOt);
router.get("/ot/:id", getOTById);
router.put("/ot/update", updateOtById);
router.delete("/ot/delete", deleteOt);

//OT Routes By Super Admin
router.post("/registerBySuperAdmin/ot", registerOtBySuperAdmin);
router.patch("/ot/updateBySuperAdmin", updateOtBySuperAdmin);
router.delete("/ot/deleteBySuperAdmin", deleteOtBySuperAdmin);

//Client Profile Routes
router.post("/register/client", createClient);
router.get("/client/:id", getClientById);
router.put("/client/update", updateClient);
router.delete("/client/delete", deleteClient);

//Product Routes
router.post("/product", createProduct);
router.get("/product", getAllProducts);
router.get("/product/:user_id", getProductsByUSerID);
router.patch("/product", updateProductById);
router.delete("/product", deleteProduct);

//Classes Routes
router.post("/class", verifyToken, createClasses);
router.get("/class", verifyToken, getAllClasses);
router.patch("/class", verifyToken, updateClassById);
router.delete("/class", verifyToken, deleteClass);
//
//Questionnaire Routes
router.post("/questionnaire", createQuestionnaire);
router.get("/questionnaire", getAllQuestionnaires);
router.get("/questionnaire/:user_id", getQuestionnaireByID);
router.patch("/questionnaire", updateQuestionnaireById);
router.delete("/questionnaire", deleteQuestionnaireByID);

// Assessment Route
router.post("/assessment", createAssessment);
router.get("/assessment", getAllAssessments);
router.get("/assessment/:user_id", getAssessmentByID);
router.patch("/assessment", updateAssessment);
router.delete("/assessment", deleteAssessmentByID);

//Setting Route
router.post("/setting", createSettings);
router.get("/setting/:user_id", getSettingsByID);
router.patch("/setting", updateSettingsById);
router.patch("/user-setting", updateUserSettingsById);
router.delete("/setting", deleteSettingByID);
export default router;
