import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    otp: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },
    
},{timestamps: true})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;