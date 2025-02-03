
import customError from "../Utils/customError.js";

const roleAuth =(allowedRoles)=>{
    return (req,res,next)=>{
        try{
            const {role} = req.user;
            if(!role || !allowedRoles.include(role)){
                throw new customError(401, "forbidden");
            }
            next();
        }catch(err){
            throw new customError(403, "Unauthorized Access")
        }
    }
}

export default roleAuth