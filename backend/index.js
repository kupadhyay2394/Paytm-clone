const express =require("express");
const cors=require("cors");
const bodyParser=require('body-parser');
const connectDB  = require("./DB/db");
const { userRouter } = require("./Routes/user.js");
const { bankRouter } = require("./Routes/bank.js");
const port =3000;
const app=express();
let AccountCount=0;
module.exports ={
    AccountCount
}
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB()
app.use("/api/v1/user", userRouter);
app.use("/api/v1/bank",bankRouter)




app.listen(port,()=>{
    console.log("app is running");
});