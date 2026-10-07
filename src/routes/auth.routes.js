import {Router} from "express"
const router=Router()
import {registerValidator} from "../validator/auth.validator.js"
import {register}  from "../controllers/auth.controllers.js"

/**
 * @POST /api/auth/register
 * @param req Express req
 * @param req.body ={email,name,password}
 * @esponse res.status=201(if success)
 */
router.post("/register",registerValidator,register)

export default router