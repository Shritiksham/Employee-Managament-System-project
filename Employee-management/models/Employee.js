import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        enum: ["HR", "IT", "Finance", "Sales"],
        default:"IT"
    },
    salary:{
        type:Number,
        required:true,
        min:10000
    },
    city:{
        type:String,
        default:"Mumbai"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
    }
});

const Employee = mongoose.model("Employee",EmployeeSchema);

export default Employee;