import { json, Router } from "express";
import { createProductValidator } from "../validator/products.validator.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { createProduct, listAllProduct } from "../controllers/product.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() ,
    limits:{
        fileSize:3*1024*1024 //3MB
    }
});

const router = Router();

/**
 * @method POST
 * @route /api/products/
 * @description  creates the product and save its data to the DB, images will be stored on ImageKit
 * req.body=={title ,description , price:(amount ,currency),sizes:[{size,tock}]}
 */
router.post(
  "/",
  // check if user is authenticated
  authenticate,
  (req, res, next) => {
    if (req.user.role != "seller") {
      return res.status(403).json({
        message: "User is not authorized to create product",
      });
    }
    next();
  },
  //parse the data 
  upload.array("images"),
  (req, res, next) => {
   req.body?.price && ( req.body.price = JSON.parse(req.body.price));
   req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
  },
  createProductValidator,
  createProduct,
);

router.get("/",authenticate,listAllProduct)

export default router;
