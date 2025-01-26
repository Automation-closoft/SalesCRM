import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js";
import dotenv from 'dotenv';
import salesRoutes from "./routes/salesRoutes.js";
import optionsRoutes from './routes/options.js';



// Initialize dotenv to load the .env file
dotenv.config();

//app congig
const app = express()
const port = 4000
app.use(cors());

//middleware
app.use(express.json())
app.use(cors())

//DB connection
connectDB();

//API endpoints
app.use("/api/salesCRM",salesRoutes)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})