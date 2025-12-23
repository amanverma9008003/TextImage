import {useContext} from 'react'
import {assets} from '../assets/assets'
import {motion} from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import {AppContext} from '../context/AppContext'
const GenerateBtn = () => {
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
    <motion.div className='pb-10 text-center items-center justify-center flex flex-col gap-3 md:gap-2'
    initial={{opacity:0.2, y:100}} transition={{duration:1}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
        <h1 className=' text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800  py-6 md:py-9 lg:py-15' >See the magic. Try now</h1>
        <motion.button className='sm:text-lg text-white bg-black w-auto mt-8 px-6 py-2.5 flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-black hover:bg-linear-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
                initial={{opacity:0}} animate={{opacity:1}} transition={{default: {duration:0.5}, opacity:{delay:0.8, duration:1}}} whileHover={{scale:1.05}} whileTap={{scale:0.95}} 
                onClick={()=>{onClickHandler()}}>
                    Generate Images
                    <img  className='h-7 px-1' src={assets.star_group} alt='' />
                </motion.button>
    </motion.div>
  )
}

export default GenerateBtn