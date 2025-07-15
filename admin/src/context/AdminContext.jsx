import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';




// Create a context
export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctorData, setDoctorData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // Calculate the Age 
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  }


  // Fetch all doctors 
  const getAllDoctor = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/all-doctor`, { headers: { aToken } });
      setDoctorData(response.data.message); // Update state

    } catch (error) {
      console.log("Error fetching doctors:", error);
    }
  };
  // changeAvailability function
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers: { aToken } })
      console.log(data);
      if (data.success) {
        toast.success(data.message)
        getAllDoctor()
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error);

    }
  };
  // get all Appointment
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.message.reverse());
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: { aToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        adminDashboard();
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };
  // Admin Dashboard
  const adminDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/admin-dashboard`,
        {
          headers: { aToken },
        }
      );
      if (data.success) {
        console.log(data.dashData);
        setDashData(data.dashData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };


  // Context value
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctorData,
    getAllDoctor,
    changeAvailability,
    appointments,
    getAppointments,
    cancelAppointment,
    calculateAge,
    adminDashboard,
    dashData
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;
