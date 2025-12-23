import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'

const Description = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center my-24 p-6 md:px-28'
      initial={{opacity:0.2, y:100}} transition={{duration:1}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
        <h1 className='text-3xl sm:text-4xl fot-semibold mb-2'>Create AI Images</h1>
        <p className='text-gray-500 mb-8'>Turn your imagination ito visuals</p>
    
        <div className='flex flex-col md:flex-row w-full max-w-screen-xl mx-auto gap-5 md:gap-14 items-center'>
        <img src={assets.sample_img_2} alt="" className='w-70 xl:w-96 rounded-lg' />
    
    <div id='2'>
        <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-Powered Text to Image Generator</h2>
        <p className='text-gray-600 mb-4'>Easily bring your ideas to life with the power of AI.With the help of AI, we can create images that capture the essence of your text.Just enter your text and let the AI do the rest.</p>
        <p className='text-gray-600'>Simply type in a text prompt, and our cutting-edge AI will generate a unique image that captures the essence of your idea. You can customize the image by adding text, changing the background, and adding filters. The AI-powered text to image generator is a fun and creative way to express your ideas. Whether you're a student, a hobbyist, or a professional, the AI-powered text to image generator is a great way to create engaging images.</p>
    </div>
</div>
    </motion.div>
  )
}

export default Description