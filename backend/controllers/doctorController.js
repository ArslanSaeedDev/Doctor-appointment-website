
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from '../models/appointmentModel.js';




//changeAvailability
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availibity Changed' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// doctorList
const doctorList = async (req, res) => {
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

// doctor Login 
const doctorLogin = async (req, res) => {
    try {
        // Validate JWT secret exists
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret not configured");
        }

        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: doctor._id,
                email: doctor.email
            },
            process.env.JWT_SECRET,
        );

        res.json({
            success: true,
            token,
            doctor: {
                id: doctor._id,
                email: doctor.email
            }
        });

    } catch (error) {
        console.error("Error logging in doctor:", error);
        res.status(500).json({
            success: false,
            message: error.message.includes("JWT secret")
                ? "Server configuration error"
                : "Internal server error"
        });
    }
};
// Api to get doctor  appointment for doctor pannel 
const getDoctorAppointment = async (req, res) => {
    try {
        const { docId } = req.body;
        console.log("Received docId:", docId);

        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, message: appointments });

    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// Api to get mark appointment complete for doctor pannel 
const appointmentComplete = async (req, res) => {
    try {

        const { appointmentId, docId } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);
        if (appointment && appointment.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId, docId } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);
        if (appointment && appointment.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
// Api to get Doctor dashboard data
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;

        const appointments = await appointmentModel.find({ docId });

        let patients = [];
        appointments.forEach(item => {
            if (!patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const dashData = {
            totalAppointments: appointments.length,
            totalPatients: patients.length,
            latestAppointment: appointments.reverse().slice(0, 5),
        };

        res.status(200).json({ success: true, message: dashData });

    } catch (error) {
        console.error("Error in doctorDashboard:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get doctor profile
const getDoctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId).select('-password'); // exclude password

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ success: true, message: doctor });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// 2. Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
    try {
      const { docId, available, fees, address } = req.body;
      await doctorModel.findByIdAndUpdate(docId, { available, fees, address }).select('-password');
      res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  

export { changeAvailability, doctorList, doctorLogin, getDoctorAppointment, appointmentComplete, appointmentCancel, doctorDashboard, getDoctorProfile, updateDoctorProfile }; 