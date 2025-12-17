import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect(process.env.MONGOOSE_DB)
    .then(()=>console.log('DB CONNECTED'))
}