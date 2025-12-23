import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import {motion} from 'framer-motion'
import axios from 'axios';
import {toast} from 'react-toastify';

const Login = () => {
    const [state,setState] = useState('Login');
    const {setShowLogin, backendUrl , setToken, isUser}= useContext(AppContext);
    
    const [name, setName] = useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try{
                if(state === 'Login'){
                    const {data} = await axios.post(`${backendUrl}/api/user/login`, {email, password});
                    if(data.success){
                        setToken(data.token);
                        isUser(data.user);
                        localStorage.setItem('token', data.token);
                        setShowLogin(false);
                    }else{
                    toast.error(data.message);
                    }
                }else{
                    const {data} = await axios.post(`${backendUrl}/api/user/register`, {name,email, password});
                    if(data.success){
                        setToken(data.token);
                        isUser(data.user);
                        localStorage.setItem('token', data.token); // do changes getItem
                        setShowLogin(false);
                    }else{
                    toast.error(data.message);
                    }
                }
        }catch(err){
                console.log(err);
                toast.error(err.message);
        }
    }

    useEffect(() => {
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = 'unset';
            }
    },[])

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <motion.form className='relative bg-white p-10 rounded-xl text-slate-500'
            initial={{opacity:0.2, y:50}} transition={{duration:0.3}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} 
            onSubmit={onSubmitHandler}>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className=' text-center text-sm'>Welcome back ! Please sign in to continue</p>

            {state !== 'Login' && <div className='border  text-lg px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <i className="fa-regular fa-user"></i>
                <input  onChange={e =>setName(e.target.value)} value={name} className='outline-none text-sm' type='text' placeholder='Full Name' required />
            </div>}

            <div className='border text-lg px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <i className="fa-regular fa-envelope"></i>
                <input onChange={e =>setEmail(e.target.value)} value={email} className='outline-none text-sm' type='email' placeholder='Email id' required />
            </div>

            <div className='border text-lg px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <i className="fa-solid fa-shield-halved"></i>
                <input onChange={e =>setPassword(e.target.value)} value={password} className='outline-none text-sm' type='password' placeholder='Password' required />
            </div>

            <p className='text-sm text-blue-600 hover:text-blue-400 my-4 cursor-pointer'>
                Forgot Password?
            </p>
            <button className='w-full bg-zinc-600 hover:bg-blue-700 text-white py-2 rounded-full mt-5'>{state === 'Login' ? 'Login' : 'create account'}</button>
            
            { state === 'Login' ?
            <p className='mt-4'>Don't have an account?
                <span className='text-blue-600 hover:text-blue-400 cursor-pointer' onClick={()=>setState('Sign Up')}>
                    Sign Up</span></p>
            :<p className='mt-4'>Already have an account? 
                <span className='text-blue-600 hover:text-blue-400 cursor-pointer' onClick={()=>setState('Login')}>
                    Login In</span></p>
            }

            <button onClick={()=>setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer'>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </motion.form>
    </div>
  )
}

export default Login