import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,

    },
    name:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user",
        enum:["user","seller"]
    }
})
const userModel=mongoose.model("user",userSchema);
export default userModel;