import {Router} from "express"
const router=Router()
import {loginValidator, registerValidator} from "../validator/auth.validator.js"
import {getMe, login, refresh, register}  from "../controllers/auth.controllers.js"
import { authenticate } from "../middlewares/auth.middlewares.js"

/** 
 * @POST /api/auth/register
 * @param req Express req
 * @param req.body ={email,name,password}
 * @esponse res.status=201(if success)
 */
router.post("/register",registerValidator,register)

router.post("/login",loginValidator,login)

router.post("/refresh",refresh)


router.get("/me",authenticate,getMe)
export default router