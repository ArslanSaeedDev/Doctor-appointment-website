import express from "express";
import upload from "../middlewares/multer.js";
import { addDoctor, adminLogin, allDoctor, appointmentAdmin, appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import { changeAvailability } from "../controllers/doctorController.js";
import authAdmin from '../middlewares/authAdmin.js';



const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctor", authAdmin, allDoctor);
adminRouter.post("/change-availability", authAdmin, changeAvailability)
adminRouter.get("/appointments", authAdmin, appointmentAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/admin-dashboard", authAdmin, adminDashboard)
adminRouter.post("/login", adminLogin);

export default adminRouter;
