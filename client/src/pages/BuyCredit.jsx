import { useContext } from 'react'
import { plans,assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const BuyCredit = () => {
  const {user, backendUrl, loadCreditData, token ,setShowLogin} = useContext(AppContext)
  const navigate = useNavigate();
  
  const initPay = async (order) => {
      if (!window || !window.Razorpay) {
        toast.error('Razorpay script not loaded. Please try again later.');
        return;
      }
      // read public Razorpay key exposed by Vite (must start with VITE_)
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if(!razorpayKey){
        toast.error('Razorpay public key not found. Add VITE_RAZORPAY_KEY_ID to client/.env and restart the dev server.');
        return;
      }

      const options={
        key: razorpayKey,
        amount: order.amount,
        currency: 'INR',
        name:'Credits Payment',
        description: 'Credits Payment',
        order_id: order.id,
        receipt: order.receipt,
        handler: async (response)=>{
          try{
            const { data } = await axios.post(`${backendUrl}/api/user/verify-razor`, response , { headers: { token } })
            if(data.success){
              toast.success('Payment successful')
              loadCreditData();
              navigate('/')
            }
            else{
              toast.error('Payment failed')
            }
          }catch(error){
            toast.error(error.message);
          }
        }
      }

      const rzy = new window.Razorpay(options);
      rzy.open()
  }
  

  const paymentRazorpay = async (planId)=>{
    toast.info('Processing Payment')
    try{
      if (!user){
        setShowLogin(true)
      }
      const { data } = await axios.post(`${backendUrl}/api/user/pay-razor`, { planId }, { headers: { token } })
      
      console.log(data);
      if(data.success){
        initPay(data.order)
      } else {
        toast.error(data.message || 'Payment initialization failed')
      }
    }catch(error){
      console.log(error.message);
      toast.error(error.message)
    }
  }
  return (
    <motion.div className='min-h-[80vh] text-center pt-14 mb-10'
      initial={{opacity:0.2, y:100}} animate={{opacity:1}} transition={{duration:1}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} 
        >
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1  className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan </h1>
      
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
            <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-110 transition-all duration-500'>
              <img width={40} src={assets.credits} alt="" />
              <p className='font-semibold mb-1 mt-3'>{item.id}</p>
              <p className='text-sm'>{item.desc}</p>
              <p className='mt-6'>
                <span className=' text-3xl font-medium'>₹ {item.price}</span> / {item.credits} credits
              </p>
              <button onClick={()=>{paymentRazorpay(item.id)}} className='w-full bg-gray-800 text-white text-sm py-2.5 rounded-md mt-6'>
                {user ? 'Purchase' : 'Get Started'}</button>
            </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit