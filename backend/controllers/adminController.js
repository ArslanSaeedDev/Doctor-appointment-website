import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";







const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields, including image, are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid Email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const newDoctor = new doctorModel({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        });

        await newDoctor.save();
        res.status(201).json({ success: true, message: "Doctor added successfully" });

    } catch (error) {
        console.error("Not Added Doctor Successfully:", error);
        res.status(500).json({ success: false, message: error.message });
    }

};
// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// get all Doctor 
const allDoctor = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        if (doctors.length > 0) {
            res.json({ success: true, message: doctors });
        } else {
            res.json({ success: false, message: "No doctors found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Api to get All Appointment 
const appointmentAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, message: appointments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// Api to Cancel Appointment 
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId).select("-password");
        let slots_booked = docData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter((time) => time !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        res.json({ success: true, message: "Appointment cancelled " });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        return res.status(500).json({ success: false, message: "Failed to cancel appointment", });
    }
}
// Api Admin Dashboard
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointment = await appointmentModel.find({})
        const dashData = {
            doctors: doctors.length,
            users: users.length,
            appointment: appointment.length,
            latestAppointment: appointment.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to access dashData " });
    }
}
export { addDoctor, adminLogin, allDoctor, appointmentAdmin, appointmentCancel, adminDashboard };
