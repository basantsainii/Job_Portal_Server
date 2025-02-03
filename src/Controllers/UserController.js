import UserData from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendVerificationMail from "../Utils/mailer.js";
import { mailVerificationTemplate } from "../Templates/mailTemplates.js";
import customError from "../Utils/customError.js";
import { MailOTPVerification } from "../Templates/MailOtpTemplate.js";
import jwt from "jsonwebtoken";


// password hashing
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    console.log(e.message, e, "hashing password failed");
    // throw new Error("Error hashing password");
  }
};

const createToken = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

// get User APi
export const getUser = async (req, res) => {
  try {
    const users = await UserData.find();
    res.status(200).json({ message: "User found", data: users });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("user not found");
  }
};

// post User API with email verification

export const signUpUser = async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;
  if (!fname || !lname || !email || !phone || !password) {
    // console.log("all field required , line 49 UserController.js")
    res.status(400).json({ message: "All fields are required" });
    throw new customError(400,"All fields are required")
  }
  try {
    const userExists = await UserData.findOne({ email: email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    } else {
      const hashedPassword = await hashPassword(password);
      const mailToken = createToken(12);
      console.log("mail token is", mailToken);

      // create new user document  and hash password  and save it to the database  and send verification email  using sendMails function
      const newUser = await UserData.create({
        fname,
        lname,
        email,
        phone,
        password: hashedPassword,
        emailToken: mailToken,
      });

      // replace the placeholders in the mail template with the actual values and send the email
      // send email verification link                   front end ka port number
      const content = mailVerificationTemplate.replace(
        /{link}|{name}/g,
        (matched) => { // matched means term which is going to to be searched and replace
          const replacement = {
            "{link}": `http://localhost:3000/api/mail-verification/${newUser?._id.toString()}/${
              newUser?.emailToken
            }`,
            "{name}": `${fname} ${lname}`,
          };
          return replacement[matched];
        }
      );

      // await sendVerificationMail(email, "Email Verification", content);
      res.status(201).json({ message: "User created Successfully" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error, user not created",
      error: e.message,
    });
  }
};


// mail verification
export const getUserMailVerified = async (req, res) => {
  try {
    const { id, emailtoken } = req.params;
    console.log(id, emailtoken);
    if (!emailtoken) {
      return res.status(400).json({ message: "No email token provided" });
    }
    const user = await UserData.findOneAndUpdate(
      { _id: id },
      { $set: { isMailVerified: true, emailToken: null } }
    );
    if (!user) {
      // console.log(process.env.FrontEndDomain)
      // return res.status(404).json({message: "No email token provided or user not found"});
      return res
        .status(404)
        .redirect(`${process.env.FrontEndDomain}/mail-verification-error`);
    }
    res.redirect(`${process.env.FrontEndDomain}/mail-verification-successful`);
  } catch (e) {
    console.log("error in verifying user email", e.message);
    res
      .status(500)
      .json({ error: "Internal server error, email not verified" });
  }
};

// logged in use
// password validation function
const validatePassword =  async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    console.log(match)
    return match; // true or false
  } catch (e) {
    console.log(e.message, e, "password validation failed");
    // throw new Error("Error validating password");
  }
};

// login user API
export const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    throw new customError(400, "All fields are required");
  }

  // check if user exists in db
    const UserExist = await UserData.findOne({ email: email });
    if (!UserExist) {
      return res.status(404).json({ message: "User not found  or wrong password" });
    }

    // verifying user
    if(UserExist.isMailVerified == false) {
      return res.status(401).json({ message: "Email not verified", redirectUrl: "/resend-mail-verification-link"});
    }

    // matching password
    const SavedPassword = UserExist.password;
    const matched = await validatePassword(password, SavedPassword)
    // const matched = await bcrypt.compare(password, SavedPassword);

    
    // if password is valid, generate and send token
    if (matched) {
          const token = jwt.sign({name : UserExist.name, role : UserExist.role, id: UserExist._id.toString()}, "123456", {expiresIn : "10m" });
          res.set("Authorization", `Bearer ${token}`) // will set cookie/token in header by making a custom header first argument in it
          // res.set("authorization", '')
          // res.cookie("jwtToken",token); // will set cookie/token in  predefined 'set-cookie' header  
      // checking for Role
    if(UserExist.role){
      if(UserExist.role==="Employee"){
        res
        .status(201)
        .json({ message: "User logged in successfully", redirectUrl: "/employee-dashboard"});
      }else{
        res
        .status(201)
        .json({ message: "User logged in successfully", redirectUrl: "/employer-dashboard"});
      }
    }else{
      res
        .status(201)
        .json({ message: "User logged in successfully", redirectUrl: "/select-role-of-user"});
    }
      
    }
    else {
      return res.status(400).json({ message: "Invalid credentials , wrong password" });
    }
  } 




// generate password
const generateOTP = () => {
  // let length = 6,
  //   charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  //   password = "";
  // for (let i = 0, n = charset.length; i < length; ++i) {
  //   const randomNum = Math.random() // random number generator in decimal format
  //   const FloorNumAsInDex = Math.floor(randomNum * n); // random integer between 0 and n-1 , n is length of charset string
  //   password = password + charset.charAt(FloorNumAsInDex);
  // // Pick a random character from the charset and append it to the password
  // password += charset.charAt(Math.floor(Math.random() * n));
  // }

  const password = Math.floor(Math.random() * (999999 - 100000) + 100000); //
  console.log(password);
  return password;
};




// forgot password otp send email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // validate email
  if (!email) {
    throw new customError(400, "Email field is required");
  }

  // check if user exists in db
  const userExists = await UserData.findOne({ email: email });
  if (!userExists) {
    throw new customError(400, "does not found an account with this email");
  }

  // generating otp
    const OTP = generateOTP();
    userExists.Otp = OTP;
    await userExists.save();

    // sending email
    const content = MailOTPVerification.replace("{OTP}", OTP);
    await sendVerificationMail(email, "Otp to reset password", content);

    // success response
    res.status(200).json({success:true, message: "OTP sent successfully" });
};


 
// OTP verification
export const OTPVerification = async (req, res) =>{
  const { email, Otp } = req.body;

  // checking for data
  if(!email ||!Otp){
    return res.status(400).json({message: "All fields are required"})
  }
  try{
    // getting user from db
    const UserExist = await UserData.findOne({ email: email});
    if(!UserExist){
      return res.status(404).json({message: "User not found"})
    }

    // matching otp
    const OTP = UserExist.Otp 
    if(Otp == OTP){
      UserExist.Otp = undefined;
      await UserExist.save()
      return res.status(200).json({success : true, message: "OTP verified successfully"})
    }

    // success response
    res.status(401).json({success : true, message: "Invalid OTP"})
  }catch(err){ 
    return res.status(500).json({message: "Internal server error, OTP verification failed"})
  }
}

// password UpdateAPI
export const  UpdatePassword = async (req, res) => {
  const {email, password} = req.body;

  if(!password){
    throw new customError(400,"Password field is required")
    }

  if(!email){
    throw new customError(400,"access expired!")
  }
  //hashing password and update
  const hashPw = await hashPassword(password); // this should be async await
  const user = await UserData.findOneAndUpdate({email: email}, {password: hashPw})
  if(user){
  res.status(200).json({success : true, message: "Update details successfully"})
  }else{
    throw new customError(500,"internal server error check database operation in targeted controller")
    // res.status(404).json({message: "User not found!"})
  }
}

// Resend verification email
export const ResendEmail = async(req,res)=>{
  const {email} = req.body;
  console.log(email)

  if(!email){
    throw new customError(400, "please fill your registered Email");
  }
  const ExistUser = await UserData.findOne({email: email})
   if(!ExistUser){
throw new customError(400, "user Not Found")
   }
   const content = mailVerificationTemplate.replace(
    /{link}|{name}/g,
    (matched) => { // matched means term which is going to to be searched and replace
      const replacement = {
        "{link}": `http://localhost:3000/api/mail-verification/${ExistUser?._id.toString()}/${
          ExistUser?.emailToken
        }`,
        "{name}": `${ExistUser?.fname} ${ExistUser?.lname}`,
      };
      return replacement[matched];
    }
  );

  await sendVerificationMail(email, "Email Verification", content);
   const Token = createToken(12);
   ExistUser.emailToken = Token;
   
   await ExistUser.save()
   res.status(200).json({success: true,  message:"Verification Email Sent Successfully"})
   res.se
}

// selecting role for user when logging
export const RoleSelector = async (req, res)=>{
const {role, email} = req.body;
console.log({role, email})
if(!role || !email){
  throw new customError(400, "bad request try again with proper selection")
}
const User = await  UserData.findOne({email:email});
if(!User){
  throw new customError(404, "user not found");
}
User.role = role;
await User.save();
res.status(201).json({success:true, message: "role Updated", redirectUrl : "/dashboard"})
// res.redirectUrl("/dashboard")
} 