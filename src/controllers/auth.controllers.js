import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { createAccessToken,createRefreshToken, readRefreshToken } from "../utils/auth.utils.js";

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

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })
    await userModel.findByIdAndUpdate(user._id,{
        refreshToken
    })
    res.status(201).json({
        message:"user Register Successfully",
        data:{
            user:{
                email:user.email,
                name:user.name,
                id:user._id
            },
            accessToken
        }
    })

}


export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = createAccessToken({
            userId: user._id,
            role: user.role
        });

        const refreshToken = createRefreshToken({
            userId: user._id,
            role: user.role
        });

        await userModel.findByIdAndUpdate(user._id, {
            refreshToken
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return res.status(200).json({
            message: "User login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                accessToken
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required"
        });
    }

    try {
        const decoded = readRefreshToken(refreshToken);
        const { userId, role } = decoded;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (refreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "Refresh token mismatch"
            });
        }

        const accessToken = createAccessToken({
            userId: user._id,
            role: user.role
        });

        const newRefreshToken = createRefreshToken({
            userId: user._id,
            role: user.role
        });

        await userModel.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
           
        });

        return res.status(200).json({
            message: "Tokens rotated successfully",
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                    id: user._id
                },
                accessToken
            }
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

export async function getMe(req,res){
    const {userId,role}=req.user

    const user = await userModel.findById(userId)

    res.satus(200).json({
        message:"User Data Fetched Successfully",
        data:{
            user:{
                email:user.email,
                name:user.name,
                id:user._id
            }
        }
    })


}