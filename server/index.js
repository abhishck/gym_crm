import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import router from "./routes/memberRoutes.js";

dotenv.config();
dbConnection();
const app= express();
app.use(express.urlencoded());
app.use(express.json());

const Port=process.env.PORT || 3001;

app.use("/api/members",router);


app.get("/",(req,res)=>{
    res.send("welcome !!")
})

app.listen(Port,()=>{
    console.log(`server is running on the port ${Port}`)
})