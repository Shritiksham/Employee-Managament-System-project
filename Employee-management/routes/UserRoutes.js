import express from "express";
import { getSignUpPage, signUpUser, loginUser, getLoginPage, sendOTP,getSendOTPPage,getVerifyOTPPage,verifyOTP,getForgotPasswordPage,forgotPassword,getResetPasswordPage,resetPassword } from "../controllers/UserController.js";
const router = express.Router();

router.get('/signup',getSignUpPage);

router.post('/signup',signUpUser);

router.get('/login',getLoginPage);

router.post('/login',loginUser);

router.get('/sendOTP',getSendOTPPage);

router.post('/sendOTP',sendOTP);

router.get('/verifyOTP',getVerifyOTPPage);

router.post('/verifyOTP',verifyOTP);

router.get("/forgotPassword",getForgotPasswordPage);

router.post ("/forgotPassword",forgotPassword);

router.get('/resetPassword/:token',getResetPasswordPage);

router.post("/resetPassword/:token",resetPassword);

export default router;