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




const userAuth = async(req, res, next)=>{
    console.log(req.headers)
    const token = req.headers["authorization"].split("Bearer ")[1];
    console.log("jwtToken : ",token);


    try{
        if(!token){
            throw new customError(401, "token not found")
        }
        const decoded =  jwt.verify(token, "123456",)
        console.log(decoded)
        req.user = decoded;
        next();
    }catch(err){
        console.log(err.message)
        res.status(401).json({success : false , message : err.message})
    }

  
    
}
export default userAuth;