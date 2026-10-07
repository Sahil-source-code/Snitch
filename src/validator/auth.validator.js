import {body,validationResult} from "express-validator"

export const registerValidator=[
    body('email')
    .exists().withMessage("Email is needed").bail()
    .trim()
    .isEmail().withMessage("Email is needed"),

    body("name")
    .exists().withMessage("Name is needed").bail()
    .isString().withMessage("Name must be String")
    .trim()
   
    .isLength({min:3,max:50}).withMessage("Name length must be between 2 to 50 character long"),

    body("password")
    .exists().withMessage("Password is Required").bail()
    .isString().withMessage("Password must be a String")
    .trim()
    .isLength({min:6}).withMessage("Password must be 6 character long"),

    (req,res,next)=>{
        const errors=validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Invalid Request",
                errors:errors.array()
            })
        }
        next()
    }

]

