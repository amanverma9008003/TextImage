import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()

app.use(express.json())
app.use(cors())
await connectdb()
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000

app.use('/api/user',userRouter);
app.use('/api/image',imageRouter);

app.listen(PORT, async() => {
    console.log(`Server running on port http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('API is running!')
})