import Employee from "../models/Employee.js";
import session from "express-session";
import sendEmail from "../utils/sendEmail.js";

export const showMainPage = async(req,res)=>{
    try {
        const Emp = await Employee.find();
        res.render('index',{Emp});
    } catch (error) {
        res.send("Error "+error);
    }
}

export const getAddEmpPage = (req,res)=>{
    res.render('addEmployee');
}

export const createEmployee = async(req,res)=>{
    try {
        await Employee.create({   
            name:req.body.name,
            email:req.body.email,
            department:req.body.department,
            salary:req.body.salary,
            city:req.body.city,
            image:req.file.filename
        });
        console.log(req.file);

        res.redirect('/')
    } catch (error) {
        res.send("Error "+error);
    }
}

export const getEditPage = async(req,res)=>{
    const id = req.params.id;
    const Emp = await Employee.findById(id);
    res.render('editEmployee',{Emp});
}

export const editEmpInfo = async(req,res)=>{
    try {
        const id = req.params.id;
        await Employee.findByIdAndUpdate(id,(req.body));
        res.redirect("/");
    } catch (error) {
        res.send("Error "+error);
    }
}

export const deleteEmployee = async(req,res)=>{
try {
    await Employee.findByIdAndDelete((req.params.id));
    res.redirect('/');
} catch (error) {
    res.send("Error "+error);
}
}

export const logoutUser = async(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
           return res.redirect('/');
        }
        res.redirect('/login');
    })
}

