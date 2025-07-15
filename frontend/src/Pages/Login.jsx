import React, { useState, useContext ,useEffect} from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { backendUrl, token, setToken } = useContext(AppContext); 
const navigate = useNavigate()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { email, password, name });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message)
        }
      } else {
        // Login API
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error)
    }
  };
  useEffect(()=>{
    if(token){
     navigate("/")
    }
   },[token])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>
          Please {state === 'Sign Up' ? 'sign up ' : 'log in '}to book your appointment
        </p>
        {state === 'Sign Up' && (
          <div className='w-full my-4'>
            <p>Full Name</p>
            <input
              className='w-full mt-1 p-2 rounded border border-zinc-300'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className='w-full'>
          <p>Email</p>
          <input
            className='w-full mt-1 p-2 rounded border border-zinc-300'
            type='text'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            className='w-full mt-1 p-2 rounded border border-zinc-300'
            type='password' 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type='submit'
          className='w-full rounded bg-primary py-2 text-white font-semibold'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-primary cursor-pointer underline'>
              Login
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer underline'>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

export default Login; 