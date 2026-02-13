import express from 'express'
import cors from 'cors'

import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';

import path from 'path'
import { fileURLToPath } from 'url';
import itemRouter from './routes/productRoute.js';
import authMiddleware from './middleware/auth.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express()
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Middleware
app.use(cors({
    origin: (origin,callback)=>{
        const allowedOrigins = ['https://grocerystore-frontend-deh5.onrender.com','https://grocerystore-admin.onrender.com'];
         // !origin- Allow requests with no origin (like Postman or server-to-server)
         // includes origin - Allow this origin
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }

        // block others
        else {
      callback(new Error('Not allowed by CORS'));
    }
    
    },
    credentials: true, // if you are using cookies or authorization headers
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectDB();


// Routes
app.use('/api/user',userRouter)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/api/items',itemRouter)
app.use('/api/cart',authMiddleware,cartRouter)
app.use('/api/orders',orderRouter)

app.get('/', (req,res)=>{
    res.send('Api Working')
});


app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})