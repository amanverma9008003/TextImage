import { useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"

const Navbar = () => {
    //using app provider to get user data
    const {user, setShowLogin,logout,credit} = useContext(AppContext);
    const navigate = useNavigate();

  return (
    <motion.div className='flex items-center justify-between py-4'
    initial={{opacity:0.2, y:100}} transition={{duration:1}} whileInView={{opacity:1, y:0}}>
        <Link to='/'>
        <div className='flex items-center bg-tailwind-blue-500 text-sm rounded-full shadow-lg w-fit-100 px-2 sm:px-1.5 py-2 sm:py-1 rounded-full cursor-pointer hover:scale-110 drop-shadow transition-all duration-700'>
            <img src='../../public/icon.png' alt='logo' className='w-10 h-10 sm:w-10 sm:h-10 lg:w-15 lg:h-15 '/>
            <p className='text-xl font-medium text-center text-teal-600 sm:text-2xl px-2'>Tex<span className='text-purple-500 font-extrabold'>@</span>ge</p>
        </div>
        </Link>
        <div>
            {user ?
            <div className='flex items-center gap-2 sm:gap-3'>
                <button onClick={()=>{navigate('/buy')}} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-110 transition-all duration-700'>
                    <img className="w-5" src={assets.credit_star} alt="" />
                    <p className='text-sm font-bold sm:text-sm text-gray-600'>Credit left : {credit}</p>
                </button>
                <p className='text-gray-600 max-sm:hidden pl-4'>Hii, {user.name} </p>
                <div className='relative group'>
                    <img src={assets.profile_icon} className='w-10 drop-shadow' alt="user" />
                    <div className='absolute hidden group-hover:block  text-black rounded shadow-lg top-0 right-0 z-10 pt-12 '>
                        <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                            <li onClick={logout} className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                        </ul>
                    </div>
                </div>
            </div>
            :
            <div className='flex items-center gap-2 sm:gap-5'>
                <p onClick={()=>{navigate('/buy')}} className='cursor-pointer hover:text-blue-500'>Pricing</p>
                <button onClick={()=>setShowLogin(true)} className='bg-zinc-800 hover:bg-zinc-400 text-white text-sm font-bold py-2 px-4 sm:px-10 rounded-full'>Login</button>
            </div>
            }
        </div>
    </motion.div>
  )
}

export default Navbar