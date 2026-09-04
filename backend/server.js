import express from "express";

const PORT = 8000;
const app = express();

app.get("/ap/v1/healthy",(req,res)=>{
    return res.status(200).json({
        message: "Backend is running...",
        success: true
    });
});

app.listen(PORT, ()=>{
    console.log(`Backend is running on port ${PORT}...`)
});