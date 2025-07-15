import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


// Create a context
export const DoctorContext = createContext(); // Named export

// Create a provider component
export const DoctorContextProvider = (props) => {
  const [dToken, setdToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dToken }
      });
      if (data.success) {
        setAppointments(data.message.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointment-complete`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Appointment marked as completed");
        getAppointments();
      } else {
        toast.error(data.message || "Failed to complete appointment");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointment-cancel`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        getAppointments();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // ✅ Fetch Dashboard Data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashBoard`,
        { headers: { dToken } }
      );

      if (data.success) {
        console.log("Dashboard Data:", data.message);
        setDashData(data.message);
        getAppointments();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  const doctorProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers: { dToken } });
      if (data.success) {
        console.log(data.message);
        setProfileData(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error(err);
    }
  };

  // Context value
  const value = {
    dToken, setdToken, getAppointments, appointments,
    completeAppointment, cancelAppointment,
    doctorProfile, profileData, setProfileData,
    getDashData, dashData, setDashData, backendUrl
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider; // Default export (optional)