
import customError from "../Utils/customError.js";

const roleAuth =(allowedRoles)=>{
    return (req,res,next)=>{
        try{
            // console.log(allowedRoles)
            const {role} = req.user;
            // console.log(role)
            if(!role || !allowedRoles.includes(role)){
                throw new customError(401, "forbidden, not allowed");
            }
            next();
        }catch(err){
            console.log(err.message)
            throw new customError(403, "Unauthorized Access")
        }
    }
}

export default roleAuth