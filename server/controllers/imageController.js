import axios from 'axios';
import User from '../models/userModel.js';
import FormData from 'form-data';

export const generateImage = async (req, res) => {
    try{
        const {prompt} = req.body;
        const userId = req.userId || (req.body && req.body.userId);
        const user = await User.findById(userId);

        if(!user || !prompt){
            return res.json({success:false,message: "Invalid user or prompt"})
        }
        if(user.creditBalance < 1){
            return res.json({success:false,message: "Insufficient credit balance",creditBalance: user.creditBalance})
        }
        const formData = new FormData();
        formData.append('prompt', prompt);

        // ensure API key is provided
        const clipdropKey = process.env.CLIPDROP_API;
        if(!clipdropKey){
            //console.log('Missing CLIPDROP_API_KEY in environment');
            return res.status(500).json({success:false, message: 'Server misconfiguration: missing CLIPDROP_API_KEY'});
        }

        // merge form-data headers (boundary) with the API key header
        const headers = {
            ...formData.getHeaders(),
            'x-api-key': clipdropKey,
            'Accept': 'image/png'
        };

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers,
            responseType: 'arraybuffer'
        });
        const base64image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64image}`;
        await User.findByIdAndUpdate(user._id, { creditBalance:user.creditBalance -1 });
        //console.log(resultImage);
        res.json({success:true,message: "Image generated successfully", resultImage: resultImage, creditBalance: user.creditBalance})
    }catch(error){
        // axios errors include response with status and data
        if(error.response){
            //console.log('ClipDrop API error:', error.response.status, error.response.data);
            return res.status(error.response.status).json({success:false, message: `ClipDrop API error: ${error.response.status}`, details: error.response.data});
        }
        //console.log(error ,"catch generateImage");
        res.json({success:false,message: error.message})
    }
}