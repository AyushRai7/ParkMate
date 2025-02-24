import mongoose from 'mongoose'
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const Connection= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");
    }
    catch(error){
        console.log("Error connecting to MongoDB", error.message)
    }
};
export default Connection;
//password: parkingsystem07