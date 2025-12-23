import express from 'express';
import userAuth from '../middlewares/auth.js';
import { generateImage } from '../controllers/imageController.js';
const imageRouter = express.Router();

// Route to upload an image
imageRouter.post('/generate-image', userAuth,  generateImage ); //userAuth,

export default imageRouter;