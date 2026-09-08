import 'dotenv/config';
import express,{ urlencoded } from "express";
import connectDB from './utils/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRouter from "./routers/user.router.js"

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/ap/v1/healthy",(req,res)=>{
    return res.status(200).json({
        message: "Backend is running...",
        success: true
    });
});

//Middelwares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOption ={
    origin: ['http:/localhost:3000'],
    credentials: true
};
app.use(cors(corsOption));

app.use("/api/v1/user",userRouter);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Backend is running on port ${PORT}...`);
});