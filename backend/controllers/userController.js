import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import razorpay from "razorpay";


// create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email " });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Create token and send response
    if (match) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed" });
  }
};

// register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Checking if the user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Create token and send response
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Api for getProfile Data 
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// update profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    let updateData = { name, phone, dob, gender };

    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (err) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res.status(400).json({ success: false, message: "Doctor not found." });
    }

    if (!docData.available) {
      return res.status(400).json({ success: false, message: "Doctor is not available for booking." });
    }

    let slots_booked = docData.slots_booked || {}; // handle if undefined

    // Check if slot is already booked
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({ success: false, message: "Slot not available" });
    }

    // If slotDate exists, push slotTime
    if (slots_booked[slotDate]) {
      slots_booked[slotDate].push(slotTime);
    } else {
      // If slotDate doesn't exist, create array and push slotTime
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: new Date()
    };

    const appointment = new appointmentModel(appointmentData);
    await appointment.save();

    // Update doctor slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ success: false, message: "Failed to book appointment" });
  }
};
// get Appointmnett by userId 
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId })
    res.json({ success: true, message: appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// Cancel appointment integration
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.status(404).json({ success: false, message: "Unathorized Action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    // realizing Doctor slots
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



export { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment };
