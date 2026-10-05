import User from "../models/User.js";
import bcrypt from "bcrypt";
import session from "express-session";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


export const getSignUpPage = (req,res)=>{
    res.render("signup");
}

export const signUpUser = async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,Number(process.env.SALT_ROUNDS));
        await User.create({
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
            password:hashedPassword
        });
        console.log(process.env.EMAIL_USER);
        console.log(process.env.EMAIL_PASS);
        await sendEmail(
            req.body.email,
            "Welcome to Employee Management System",
            "Your account has been created successfully."
        );
        res.redirect('/login');   
    } catch (error) {
        res.send("Error : "+error);
    }
}

export const getLoginPage = (req,res)=>{
            res.render("login");
}

export const loginUser = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).send("User not found");
        }
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(isMatch){
            req.session.user = user
            res.redirect("/")

        }else{
            res.status(401).send("Password Incorrect");
        }
    } catch (error) {
        res.send("Error : "+error);
    }
}

export const getSendOTPPage = (req,res)=>{
    res.render('sendOTP');
}

export const sendOTP = async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.send("User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp= otp;
    user.otpExpiry = Date.now()+(1000*60*5);

    await user.save();

    await sendEmail(
        user.email,
        "Your OTP Verification Code",
        `Your OTP Verification code is ${otp}. It is Valid for 5 minutes`
    );
    req.session.email = user.email;
    res.redirect('/verifyOTP');
}

export const getVerifyOTPPage = (req,res)=>{

    res.render("verifyOTP");

}

export const verifyOTP = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.session.email});

    if (!user) {
       return res.send("User not found");
    }

    if(user.otp != req.body.otp){
        return res.send("Invalid OTP");
    }

    if(user.otpExpiry < Date.now()){
        return res.send("OTP Expired");
    }

    user.otp = undefined;
    user.otpExpiry=undefined;

    await user.save();

    req.session.email = undefined;

    res.send("✅ OTP Verified Successfully");
    } catch (error) {
        res.send("Error: " + error.message);
    }
}

export const getForgotPasswordPage = (req,res)=>{
    res.render('forgotPassword');
}

export const forgotPassword = async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.send("User Not Found");
    }
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now()+(1000*60*15);

    await user.save();

    const resetLink = `http://localhost:4000/resetPassword/${token}`;

    await sendEmail(
        req.body.email,
        "Reset Your Password",
        `Your Reset Link is as below. it is valid for 15 minutes \n\n ${resetLink}`,
    );
        } catch (error) {
            console.log("Error : "+error);
        }

}

export const getResetPasswordPage = async(req,res)=>{
    try {
        const user = await User.findOne({resetToken:req.params.token})
        if(!user){
            return res.send("Invalid Reset Link")
        }
        if(Date.now()>user.resetTokenExpiry){
            return res.send("Reset link is Expired")
        }
        res.render("resetPassword",{
            token:req.params.token
        })

    } catch (error) {
        res.send("Error : "+error);
    }
}

export const resetPassword = async(req,res)=>{
    try {
            const user = await User.findOne({resetToken:req.params.token});
    if(!user){
        return res.send("Invalid Reset Link");
    }
    if(Date.now()>user.resetTokenExpiry){
        return res.send("Reset Link Expired");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match");
    }
    const hashedPassword = await bcrypt.hash(req.body.password,Number(process.env.SALT_ROUNDS));
    user.password = hashedPassword;

    user.resetToken=undefined;
    user.resetTokenExpiry=undefined;

    user.save();
    res.redirect('/login');
    } catch (error) {
       res.send("Error : "+error); 
    }

}