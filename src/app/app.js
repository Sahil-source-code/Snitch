import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productRoutes from "../routes/product.routes.js"


const app=express();
app.use(express.json())
app.use(cookieParser())
app.use("/api/product",productRoutes)
app.use("/api/auth",authRoutes)

export default app;