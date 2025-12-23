import {useState, createContext, useEffect} from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, isUser]= useState(null);
    const [showLogin, setShowLogin]= useState(false);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token,setToken]= useState(localStorage.getItem('token'));
    const [credit, setCredit]= useState(null);

    const loadCreditData = async () => {
        try{
            const {data} = await axios.get(`${backendUrl}/api/user/credits`,{headers: {token}});
            console.log(data);
            if(data.success){
                setCredit(data.credits);
                toast.success(`You have ${data.credits} credits left`);
                isUser(data.user);
            }
        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }
    
    const generateImage =async (prompt)=>{
        try{
            const {data} = await axios.post(`${backendUrl}/api/image/generate-image`,{prompt},{headers: {token}});
            
            if(data.success){
                loadCreditData();
                toast.success('Image generated successfully',data);
                return data.resultImage  //changed name of the image
            }
            else{
                toast.error(data.message)
                loadCreditData();
                if(data.creditBalance ===0){
                    navigate('/buy')
                }
            }
        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        isUser(null);
        setShowLogin(true);
    };

    useEffect(() => {
        if(token){
            loadCreditData();
        }
    },[token])

    const value = {
        user,
        isUser,
        showLogin, setShowLogin,
        backendUrl,token,setToken,
        credit, setCredit,loadCreditData,
        logout,generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;

