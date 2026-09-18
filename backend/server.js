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
import { connectRabbitMq } from './rabbitmq/connection.js';
import { startEmailConsumer } from './rabbitmq/consumers/emailConsumer.js';
import { startWelcomeConsumer } from './rabbitmq/consumers/welcomeConsumer.js';
import { startOtpConsumer } from './rabbitmq/consumers/otpConsumer.js';
import { startOrderStatusConsumer } from './rabbitmq/consumers/orderStatusConsumer.js';

const app = express()
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Middleware
app.use(cors({
  origin: (origin, callback) => {

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      .split(",")
      .map(origin => origin.trim());

    // Allow requests with no origin (Postman, server-to-server, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    }

    // Block others
    else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes
app.use('/api/user',userRouter)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/api/items',itemRouter)
app.use('/api/cart',authMiddleware,cartRouter)
app.use('/api/orders',orderRouter)

app.get('/', (req,res)=>{
    res.send('Api Working')
});


const startServer = async () => {
    try {
        await connectDB();

        await connectRabbitMq();

        await startEmailConsumer();

        await startWelcomeConsumer();

        await startOtpConsumer();

        await startOrderStatusConsumer();

        app.listen(port, () => {
            console.log(`🚀 Server started on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Server Startup Error:", error);
        process.exit(1);
    }
};

startServer();