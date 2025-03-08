import customError from "../Utils/customError.js";
import jwt from "jsonwebtoken"


// const userAuth = async(req, res, next)=>{
//     const token = req.cookies.jwtToken;
//     console.log("jwtToken : ",token);


//     try{
//         if(!token){
//             throw new customError(401, "token not found")
//         }
//         const decoded =  jwt.verify(token, "123456",)
//         console.log(decoded)
//         req.user = decoded;
//         next();
//     }catch(err){
//         console.log(err.message)
//         res.status(401).json({success : false , message : err.message})
//     }


// }
// export default userAuth;


 

const userAuth = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            throw new customError(401, "Authorization header missing");
        }

        // Extract token safely
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith("Bearer ")) {
            throw new customError(401, "Invalid token format");
        }

        const token = authHeader.split("Bearer ")[1]; 

        // Ensure token exists
        if (!token) {
            throw new customError(401, "Token not found");
        }

        // Verify 
        const JWT_SECRET = process.env.JWT_SECRET
        console.log("bsnt");
        const decoded = jwt.verify(token, JWT_SECRET );
        // console.log(decoded);
        // Attach user data to request as a key object
        req.user = decoded;
        next();
    } catch (err) {
        console.error("User Auth Authentication Error:", err.message);
        res.status(401).json({ success: false, message: err.message }); 
    } 
};

export default userAuth;
