const express = require("express");
const { User } = require("../Schema/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { usermiddleware } = require("../middleware/user.middleware");

const { verify } = require("jsonwebtoken");
const { Bank } = require("../Schema/bank");
const  transaction  = require("../Controller/bank");
const { default: mongoose } = require("mongoose");


const bankRouter= express.Router();
let AccountCount=0

bankRouter.post("/createAccount",usermiddleware, async (req,res) => {
        try{
            
            
            const userName = req.userName;
            const user= await User.findOne({userName:userName});
            const userID= user._id; 
            const bankBalance = req.body.amount;
            AccountCount=AccountCount+1;
            const accountNumber=AccountCount;
            console.log(`username is: ${accountNumber}`);

        
        const bankAcc = await Bank.create({
            userID,
            accountNumber,
            bankBalance,
            

        });

        res.status(201).json({
            msg:"Account Created",bankAcc
        })
        }catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({
              msg: 'Error creating user',
              error: err.message,
            });
          }
        
     
    

})

bankRouter.put("/transferMoney", usermiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reciverName, amount } = req.body;

        if (!reciverName || !amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Receiver name and amount are required" });
        }

        const receiver = await User.findOne({ userName: reciverName }).session(session);
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ msg: "Receiver not found" });
        }

        const sender = await User.findOne({ userName: req.userName }).session(session);
        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ msg: "Sender not found" });
        }

        const senderBank = await Bank.findOne({ userID: sender._id }).session(session);
        if (!senderBank || senderBank.bankBalance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient funds or sender has no bank account" });
        }

        const receiverBank = await Bank.findOne({ userID: receiver._id }).session(session);
        if (!receiverBank) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Receiver does not have a bank account" });
        }

        // Perform transaction
        await Bank.updateOne({ userID: sender._id }, { $inc: { bankBalance: -amount } }).session(session);
        await Bank.updateOne({ userID: receiver._id }, { $inc: { bankBalance: amount } }).session(session);
        console.log(senderBank);
        

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Transaction successful" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", err);
        res.status(500).json({ msg: "Transaction failed", error: err.message });
    }
});


bankRouter.put('/addamount',usermiddleware,async (req,res) => {
    try{
        const userName = req.userName;
        const user=await User.findOne({userName:userName});
        if(!user){
            return res.status(400).json({
                msg:"user not found"
            })
        }
        const userId= user._id;
    }catch(err){
        res.status(401).json({
            msg:'error occured',
            error:err
        })
    }
})

bankRouter.get("/balance", usermiddleware,async (req,res) => {
    try{
        const userName= req.userName;
        const user = await User.findOne({userName:userName});
        const userID=user._id;
        const bankAcc = await Bank.findOne({userID:userID});
        if(!bankAcc){
            res.status(402).json({
            msg:"user dont have account"})
        }
        const amount = bankAcc.bankBalance;
        console.log(bankAcc);
        
        res.status(201).json({
            msg:"user found",amount
            
            })

    }catch(err){
        res.status(402).json({msg:"error in fetching balance",
            error:err
        })
    }
    
})

module.exports = {
    bankRouter
}