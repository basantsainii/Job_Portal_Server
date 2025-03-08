import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();


import dbConnect from "./src/DB_Server/DBConnect.js"
import UserRoute from './src/Routes/UserRoutes.js';
import customError from './src/Utils/customError.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8000;
const App = express();
// const backend = '125.63.60.233';

App.listen(PORT, async()=>{
    try{
     await dbConnect();
     console.log(`Server is running at PORT`,PORT);
    }catch(e){
     console.error("Error starting server:", e.message);
     process.exit(1); // exit immediately with failure
    }
 })  

// Middleware to handle CORS and parse JSON request bodies
App.use(cors(
    {origin : process.env.FrontEndDomain,
        credentials  : true,
        allowedHeaders : ["Authorization", "Content-Type"],
        methods : ["GET", "POST", "PUT", "PATCH", "DELETE",],

    }
));

 


App.use(cookieParser()) 
App.use(express.json({ extended:true, limit: "100kb"}));
App.use(express.urlencoded({extended:true, limit: "100kb"}));

console.log(process.env.FrontEndDomain)

App.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", process.env.FrontEndDomain); // allow req from the origin
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type"); //allow these header in request
    res.setHeader("Access-Control-Expose-Headers", "authorization"); // expose these header in response
    next(); //to next middleware
    
})

// Api methods to handle middleware -=-=-=-=-=-=-
App.use(`/api`,UserRoute);

 

// Error handling middleware
App.use((err, req, res, next) => {
    // console.error(err.stack); 
    let statusCode = 500;
    let message = "Something went wrong, error in targeted controller";
    // console.log(err) 
console.log("catch Err : ",err.message)
    if(err instanceof customError){
        statusCode = err.statusCode;
        message = err.message;
    }
    // console.log("throw Err",statusCode, message);
    res.status(statusCode).json({ message });
});