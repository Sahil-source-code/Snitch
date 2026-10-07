import mongoose from "mongoose";
import config from "../config/config.js"

 async function connectToDB(){
    await mongoose.connect(config.MONGO_URI)
    console.log("Mongo Connected")
}
export default connectToDB