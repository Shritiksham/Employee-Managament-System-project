import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import userRouter from "./routes/UserRoutes.js";
import empRouter from "./routes/EmployeeRoutes.js";

const app=express();
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected"))
.catch(console.error);

app.set("view engine","ejs");
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}));
app.use(userRouter);
app.use(empRouter);


app.listen(process.env.PORT,()=>{
    console.log("Port is running on "+(process.env.PORT));
})