import {Router} from "express"

const router=Router()


/**
 * @method POST
 * @route /api/products/
 * @description  creates the product and save its data to the DB, images will be stored on ImageKit
 * req.body=={title ,description , price:(amount ,currency),sizes:[{size,tock}]}
*/


export default router