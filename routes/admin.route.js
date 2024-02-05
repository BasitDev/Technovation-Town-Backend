import express from "express";
import { testRoute, getTest } from "../controllers/admin.controller.js";

import {
  register,
  login,
  getSuperAdmin,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
} from "../controllers/superAdmin.controller.js";
import {
  registerDealer,
  loginDealer,
  getDealerAdmin,
  updateDealerAdmin,
  deleteDealerAdmin,
} from "../controllers/dealerAdmin.controller.js";

import {
  registerDealerRep,
  loginDealerRep,
  getDealerRep,
  updateRealerRep,
  deleteDealerRep,
} from "../controllers/dealerRep.controller.js";

import {
  createDealerBySuperAdmin,
  updateDealerAdminBySuperAdmin,
  deleteDealerAdminBySuperAdmin,
} from "../controllers/dealerAdminBySuperAdmin..controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// -------------- Admin APIs ---------------
// Create
router.post("/test", testRoute);
// get
router.get("/test", getTest);

//super admin routes
router.post("/register/super-admin", verifyToken, register);
router.post("/login/super-admin", login);
router.get("/super-admin/:id", getSuperAdmin);
router.get("/super-admin/users/all", verifyToken, getAllUsers);
router.patch("/super-admin/update", updateAdmin);
router.delete("/super-admin/delete", deleteAdmin);

//dealer admin routes
router.post("/register/dealer-admin", verifyToken, registerDealer);
router.post("/login/dealer-admin", loginDealer);
router.get("/dealer-admin/:id", verifyToken, getDealerAdmin);
router.patch("/dealer-admin/update", verifyToken, updateDealerAdmin);
router.delete("/dealer-admin/delete", verifyToken, deleteDealerAdmin);

//dealer Rep routes

router.post("/register/dealer-rep", registerDealerRep);
router.post("/login/dealer-rep", loginDealerRep);
router.get("/dealer-rep/:id", getDealerRep);
router.put("/dealer-rep/update", updateRealerRep);
router.delete("/dealer-rep/delete", deleteDealerRep);

//dealer admin by super admin

router.post("/register/dealer-admin-by-super-admin", createDealerBySuperAdmin);
router.put("/dealer-admin/updateBySuperAdmin", updateDealerAdminBySuperAdmin);
router.delete(
  "/dealer-admin/deleteBySuperAdmin",
  deleteDealerAdminBySuperAdmin
);

//ot routes

export default router;
