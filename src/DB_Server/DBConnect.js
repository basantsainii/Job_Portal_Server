import mongoose from "mongoose";

const dbConnect = async (req, res) =>{
    try{
        await mongoose.connect(process.env.DBConnectionUrl);
        console.log("MongoDB Connected");
    } catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        res.status(500).send("Server Error");
    }
}

export default dbConnect;