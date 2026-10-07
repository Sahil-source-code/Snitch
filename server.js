import app from "./src/app/app.js";

import connectToDB from "./src/config/db.js";

await connectToDB()
app.listen(3000,(req,res)=>{
    console.log("Server is running on 3000")
})