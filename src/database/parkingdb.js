import mongoose from 'mongoose'
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const parkingdb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");
    }
    catch(error){
        console.log("Error connecting to MongoDB", error.message)
    }
};
export default parkingdb;
//password: ayush07