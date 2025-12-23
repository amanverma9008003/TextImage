import {registerUser, loginUser, userCredits, paymentRazorpay, verifyPayment} from '../controllers/userController.js';
import express from 'express';
import userAuth from '../middlewares/auth.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits',userAuth, userCredits);
userRouter.post('/pay-razor',userAuth, paymentRazorpay);
userRouter.post('/verify-razor', verifyPayment);

export default userRouter;

//localhost:4000/api/user/register
//localhost:4000/api/user/login
//localhost:4000/api/user/credits