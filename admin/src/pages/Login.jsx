import React, { useState } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

function Login() {
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setdToken} = useContext(DoctorContext);
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async e => {
    e.preventDefault(); 
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        console.log('Full Response:', data); 
        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
        }
      }
      else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        console.log('Full Response:', data); 
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setdToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={onSubmitHandler} className="bg-white p-6 rounded-lg shadow-lg w-72 md:w-96">
        <p className="text-2xl font-semibold text-center text-gray-700 mb-4">
          <span className="text-2xl font-semibold text-primary">{state}</span> Login
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full font-semibold bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
        {state === 'Admin'
          ? <p className="my-6 text-gray-700">
              Doctor Login?{' '}
              <span
                className="cursor-pointer text-primary hover:text-blue-700"
                onClick={() => setState('Doctor')}
              >
                Click Here
              </span>
            </p>
          : <p className="my-6 text-gray-700">
              Admin Login?{' '}
              <span
                className="cursor-pointer text-primary hover:text-blue-700"
                onClick={() => setState('Admin')}
              >
                Click Here
              </span>
            </p>}
      </form>
    </div>
  );
}

export default Login;
