import Router from "express";
import jwt from "jsonwebtoken";

import { getUser, signUpUser, getUserMailVerified, LoginUser, forgotPassword, OTPVerification, UpdatePassword, ResendEmail, RoleSelector, AutoLogin, StoreFilePath, ProfileData } from "../Controllers/UserController.js";

import { asyncHandler } from "../Utils/asyncHandler.js";
import userAuth from "../Middlewares/userAuth.js";
import roleAuth from "../Middlewares/roleAuth.js";
import { upload } from "../Middlewares/multer.js";
// import multer from "multer";

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



// UserRoute.get("/apply",userAuth,roleAuth(["admin", "employee", "employer"]), asyncHandler(AutoLogin), (req, res)=>{
//     const {name} = req.user;
//     // console.log(req.user)
    
//     const user = req.ExistUser
//     res.status(201).json({success:true, message:`welcome ${name}`, userDetails: user })
// })

UserRoute.get("/auto-login", userAuth,roleAuth(["admin", "Employee", "employer"]), asyncHandler(AutoLogin), (req, res)=>{
    const {name} = req.user;
    // console.log(req.user)
    console.log("welcome",name)
    const user = req.ExistUser
    res.status(201).json({success:true, message:`welcome ${name }`, userDetails: user })
});


// test routes 
// UserRoute.get("/test-jwt", (req, res)=>{
//     const token = jwt.sign({name : "basant", role : "admin", id : 123456789}, process.env.JWT_SECRET, {expiresIn : "10m" });
//     res.set("authorization", `Bearer ${token}`) // will set cookie/token in header by making a custom header first argument in it
//     // res.cookie("jwtToken",token); // will set cookie/token in  predefined 'set-cookie' header  
//     res.send("hello")
// })


// upload single file 
UserRoute.post("/upload-single", upload.single("file"), userAuth, asyncHandler(StoreFilePath))


//upload multiple file
UserRoute.post("/upload-multiple", upload.array("file", 5), (req,res)=>{
    console.log(req.files)
    res.send("file uploaded Successfully")
    // res.status(201).json({success: true, message:"file uploaded successfully"})
})

// getting user profile data
UserRoute.get("/fetch-user-profile", userAuth, asyncHandler(ProfileData))


export default UserRoute;
 