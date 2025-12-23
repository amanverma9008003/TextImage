import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const {user, setShowLogin} = useContext(AppContext);
    const navigate = useNavigate();
    const onClickHandler = () => {
        if(user){
            navigate('/result')
        }
        else{
            setShowLogin(true)
        }
    }

  return (
    <motion.div className='flex flex-col justify-center items-center text-center my-20'
    initial={{opacity:0.2, y:100}} transition={{duration:1}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
        <motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500'
        initial={{opacity:0.2, y:-20}} animate={{opacity:1, y:0}} transition={{duration:0.8, delay:0.2}} viewport={{once:true}}>
            <p>Best text to image converter</p>
            <img src={assets.star_icon} alt='' />
        </motion.div>

        <motion.h1 className='text-4xl max-w-[300px] font-bold-400 sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'
        initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2, delay:0.4}} >
            Turn your text to <span className='text-blue-600'>image</span>, in seconds.
        </motion.h1>

        <motion.p className=' max-w-xl mx-auto mt-5 text-center'
        initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8, delay:0.6}} >
            Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.
        </motion.p>

        <motion.button className='sm:text-lg text-white bg-black w-auto mt-8 px-6 py-2.5 flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-black hover:bg-linear-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
        initial={{opacity:0}} animate={{opacity:1}} transition={{default: {duration:0.5}, opacity:{delay:0.8, duration:1}}} whileHover={{scale:1.05}} whileTap={{scale:0.95}} 
        onClick={()=>{onClickHandler()}}>
            Generate Images
            <img  className='h-7 px-1' src={assets.star_group} alt='' />
        </motion.button>

        <motion.div className='flex flex-wrap justify-center mt-16 gap-3'
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1, delay:1}}>
            {Array(6).fill('').map((item, index) => (
                <motion.img key={index} className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10 ' src={ index%2 ===0 ?assets.sample_img_2 : assets.sample_img_1} alt='' width={70} 
                transition={{duration:0.1, scale:1.05}} />
            ))}
        </motion.div>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8, delay:1.2}}>Generated images from Tex@ge</motion.p>
    </motion.div>
  )
}

export default Header