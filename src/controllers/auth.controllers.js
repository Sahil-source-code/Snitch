import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { createAccessToken,createRefreshToken } from "../utils/auth.utils.js";

/**
 * @description  Registe r a user and save the data from req.body
 * @param req express.Request
 * @params req.bosy  Object
 * @param req.body.email String
 */

export async function register(req,res){
    const {email,name,password}=req.body
    const isUserAlreadyExists=await userModel.findOne({
        email
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already Exist with this email",
            errors:[
                {
                    field:"email",
                    message:"User already exist with this Email Address"
                }
            ]
        })
    }
    const user=await userModel.create({
        email,
        name,
        passwordHash:await bcrypt.hash(password,12)

    })

    const accessToken=createAccessToken({
        userId:user._id,
        role:user.role
    })

    const refreshToken=createRefreshToken({
        userId:user._id,
        role:user.role
    })

}
