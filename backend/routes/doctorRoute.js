import express from "express";
import { doctorList , doctorLogin ,getDoctorAppointment ,appointmentComplete ,appointmentCancel ,doctorDashboard ,getDoctorProfile, updateDoctorProfile} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";




const doctorRouter = express.Router();


doctorRouter.get("/list",doctorList);
doctorRouter.post("/login",doctorLogin);
doctorRouter.get("/appointments",authDoctor,getDoctorAppointment);
doctorRouter.post("/appointment-complete",authDoctor,appointmentComplete);
doctorRouter.post("/appointment-cancel",authDoctor,appointmentCancel);
doctorRouter.get("/dashBoard",authDoctor,doctorDashboard);
doctorRouter.get("/profile",authDoctor,getDoctorProfile);
doctorRouter.post("/update-profile",authDoctor,updateDoctorProfile);

export default doctorRouter;