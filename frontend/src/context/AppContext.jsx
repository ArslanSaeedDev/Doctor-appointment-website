import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// Create a context
export const AppContext = createContext();
// Create a provider component
export const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [userData, setUserData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


// Get All doctor Data
  const getAllDoctor = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      setDoctors(data.message)
    } catch (error) {
      console.log("Error fetching doctors:", error);
      toast.error(error.message)
    }
  };
  // Load User ProfileData 
  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAllDoctor()
  }, [backendUrl])

  useEffect(() => {
    if (token) {
      getUserProfile()
    }
    else {
      setUserData(false)
    }
  }, [token])

  // Context value
  const value = {
    doctors,getAllDoctor,
    backendUrl,
    token, 
    setToken,
    userData,
    setUserData,
    getUserProfile
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider; // Default export (optional)