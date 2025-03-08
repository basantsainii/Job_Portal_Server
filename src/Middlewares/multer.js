import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import customError from "../Utils/customError.js";

import dotenv from "dotenv";
dotenv.config();

// saving in local storage
// const storage = multer.diskStorage({
    
//     //destination for storing file
//     destination: function (req, file, cb) { // cb is a callback that can be use for error handling
//       cb(null, './public')
//       console.log("destination file details",file)
//     },


//     //handling file name to store 
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-`+file.originalname)
//     }
//   })
// export const upload = multer({storage});




// using cloudinary 

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});


// storage configuration
const storage = new CloudinaryStorage({
    //syntax
    // cloudinary : cloudinary,
    // params : {
    //     folder: "folder name to save where", 
    //     format:"format name",
    //     public_id: "file name to save"
    // }

    cloudinary : cloudinary,
    params:{
        folder: async(req, file)=>{
            const Formats = ["image/png","image/jpeg", "image/jpg"];
            if(Formats.includes(file.mimetype)){
                return "images";
            }
            return "resume"
        },
        format: async(req,file)=>{
            const allowedFormats = [
                    "image/png",
                    "image/jpeg", 
                    "image/jpg",
                    "application/pdf"
            ] 
            if(!allowedFormats.includes(file.mimetype)){
                throw new customError(400,"only jpg, jpeg, png and pdf format are allowed")
            }
            return file.mimetype.split("/")[1];
        },
        public_id: (req, file)=>`${Date.now()}-${file.originalname.split(".")[0]}`,
    },
    
});



export const upload = multer({storage, limits:{fileSize : 5*1024*1024}});