import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:"String",
        unique:true,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["employee","admin"]
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type:Date
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    }
});

const User = mongoose.model("User",UserSchema);

export default User;