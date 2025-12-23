import User from '../models/userModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from 'razorpay';
import TransactionModel from '../models/transactionModel.js';

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        //console.log(" Printing the value ",req.body);

        if(!name ||!email ||!password){
            return res.json({success:false ,message: "Please provide all required fields"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData ={
            name, email, password: hashedPassword
        };

        const newUser = await new User(userData);
        const user   = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({success: true, token, user:{name:user.name}});

    }catch(err){
        //console.log('Error in registerUser controller',err);
        res.json({success: false, message: err.message});
    }
}

export const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            return res.json({success:true, token, user:{name:user.name}});
        }else{
            return res.json({success: false, message: "Invalid credentials"});
        }
        
    }catch(err){
        res.json({success: false, message: "Invalid credentials"});
    
    }
}

export const userCredits = async (req, res)=>{
    try{
        // read authenticated user id from middleware (req.userId)
        const userId = req.userId || (req.body && req.body.userId);
        if(!userId){
            return res.status(400).json({success:false, message: 'User id missing'});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false, message: 'User not found'});
        }
        res.json({success: true, credits: user.creditBalance, user:{name:user.name}});
        
    }catch(err){
        //console.log('Error in userCredits controller',err);
        res.json({success: false, message: err.message});
    }
}

export const paymentRazorpay = async (req,res) =>{
    try{
        // read authenticated user id from middleware (req.userId)
        const userId = req.userId || (req.body && req.body.userId);
        const {planId} = req.body || {};

        if(!userId || !planId){
            console.log("Please provide all required fields")
            return res.status(400).json({success: false, message: "Please provide all required fields"});
        }
        const userData = await User.findById(userId);

        let credits, plan, amount;
        switch(planId){
            case 'Basic':
                credits = 100;
                plan = 'Basic';
                amount = 10;
                break;
            
            case 'Advanced':
                credits = 500;
                plan = 'Advanced';
                amount = 50;
                break;
            
            case 'Business':
                credits = 5000;
                plan = 'Business';
                amount = 250;
                break;
            
            default:
                return res.json({success: false, message: "plan not found"});
        }

        const transactionData ={
            userId, plan, amount, credits
        }
        const newTransaction = await TransactionModel.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: newTransaction._id,

        }

        await razorpayInstance.orders.create(options, (error, order) =>{
            
            if(error){
                console.log(error);
                return res.json({success: false, message: error});
            }
            res.json({success: true, order})
        } )
    
    }catch(error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

export const verifyPayment = async (req, res) =>{
    try{
        const {razorpay_payment_id, razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'authorized' || orderInfo.status === 'paid'){
            const transactionData = await TransactionModel.findById(orderInfo.receipt);
            if (transactionData.payment){
                return res.json({success: false, message: "Payment already done"});
            }
            const userData = await User.findById(transactionData.userId);
            const creditBalance = userData.creditBalance + transactionData.credits;
            await User.findByIdAndUpdate(userData._id, {creditBalance});
            await TransactionModel.findByIdAndUpdate(transactionData._id, {payment: true});
            return res.json({success: true, message: "Payment successfull added"});
        }else{
            return res.json({success: false, message: "Payment failed"});
        }
    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}