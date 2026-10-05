import express from "express";
import { getAddEmpPage,showMainPage,createEmployee, getEditPage, editEmpInfo,deleteEmployee, logoutUser } from "../controllers/EmployeeController.js";
import { isLoggedIn,isAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.use(isLoggedIn);

router.get('/',showMainPage);

router.get('/Employee/add',getAddEmpPage);

router.post("/employees",upload.single("photo"),createEmployee);

router.get("/employees/edit/:id",getEditPage);

router.put("/employees/edit/:id",editEmpInfo);

router.delete("/employees/delete/:id",isAdmin,deleteEmployee);

router.get('/logout',logoutUser);

export default router;
