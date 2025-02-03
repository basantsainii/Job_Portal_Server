import Router from "express";
import jwt from "jsonwebtoken";

import { getUser, signUpUser, getUserMailVerified, LoginUser, forgotPassword, OTPVerification, UpdatePassword, ResendEmail, RoleSelector } from "../Controllers/UserController.js";

import { asyncHandler } from "../Utils/asyncHandler.js";
import userAuth from "../Middlewares/userAuth.js";
import roleAuth from "../Middlewares/roleAuth.js";


const UserRoute = Router();


UserRoute.get("/", asyncHandler(getUser));
UserRoute.post("/Signup", asyncHandler(signUpUser));
UserRoute.get("/mail-verification/:id/:emailtoken", asyncHandler(getUserMailVerified));



UserRoute.post("/login", asyncHandler(LoginUser));
UserRoute.post("/forgot-password-otp", asyncHandler(forgotPassword));
UserRoute.post("/otp-verification", asyncHandler(OTPVerification));
UserRoute.post("/update-details", asyncHandler(UpdatePassword));
UserRoute.post("/resend-verification-email", asyncHandler(ResendEmail));
UserRoute.post("/select-your-role", asyncHandler(RoleSelector));



UserRoute.get("/apply",userAuth,roleAuth(["admin", "employee", "employer"]), (req, res)=>{
    const {name} = req.user;
    console.log(req.user)
    res.send(`welcome ${name}`)
})



// test routes 
UserRoute.get("/test-jwt", (req, res)=>{
    const token = jwt.sign({name : "basant", role : "admin"}, "123456", {expiresIn : "10m" });
    res.set("authorization", `Bearer ${token}`) // will set cookie/token in header by making a custom header first argument in it
    // res.cookie("jwtToken",token); // will set cookie/token in  predefined 'set-cookie' header  
    res.send("hello")
})

export default UserRoute;
