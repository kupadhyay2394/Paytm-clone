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

bankRouter.post("/createAccount", usermiddleware, async (req, res) => {
  try {
    const userName = req.userName; // get from middleware
    const user = await User.findOne({ userName: userName });
    const userID = user._id;

    let bankBalance = req.body.amount || 0; // default 0 if not provided

    AccountCount = AccountCount + 1; // make sure AccountCount is properly initialized
    const accountNumber = AccountCount;
    console.log(`username is: ${accountNumber} and bankbalance: ${bankBalance}`);

    // Step 1: Create the Bank account
    const bankAcc = await Bank.create({
      userID,
      accountNumber,
      bankBalance,
    });

    // Step 2: Push the new Bank _id into the User's accounts array
    await User.updateOne(
      { _id: userID },
      { $push: { accounts: bankAcc._id } } // ✅ push ObjectId
    );

    res.status(201).json({
      msg: "Account Created",
      bankAcc,
    });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      msg: "Error creating user",
      error: err.message,
    });
  }
});


bankRouter.put("/transferMoney", usermiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
     
    try {
        const { reciverName, amount ,accountNumber} = req.body;
        const senderName=req.userName;
        console.log(`the sender ${senderName}`);
        console.log((`the reiver name ${reciverName}`));
        
        const sender=await User.findOne({userName:req.userName}).session(session);
        console.log(`the sender ${sender}`);
        
        
        

        if (!reciverName || !amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Receiver name and amount are required" });
        }
        const receiver=await User.findOne({userName:reciverName}).session(session);
        console.log(` the reciver ${receiver}`);
        
        
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ msg: "Receiver not found" });
        }
        if(!accountNumber){
          if(receiver.accounts.length>1){
            await session.abortTransaction();
            return res.status(404).json({msg:"Give account no."})
          }
        }
        console.log(`the acc no us ${sender.accounts[0]}`);


        const account=await Bank.findOne({accountNumber:accountNumber}).session(session);
        if(!account){
          await session.abortTransaction();
          return res.status(404).json({msg:"reciver dont have account"});
        }
        console.log((sender._id));
        console.log((receiver._id));
        
        
      if (account.userID.toString() !== receiver._id.toString()) {
  await session.abortTransaction();
  return res.status(404).json({ msg: "account and user are not same" });
}



      

       // con receiver = await Bank.findOne({ userName: reciverName }).session(session);
        

        //const sender = await User.findOne({ userName: req.userName }).session(session);
        if (!sender) {
            await session.abortTransaction();
            return res.status(404).json({ msg: "Sender not found" });
        }

        // Perform transaction
        const sAcc=await Bank.findOne({_id:sender.accounts[0]}).session(session);
        console.log(`thw bank of sender ${sAcc}`);
        
       await Bank.updateOne({ _id: sender.accounts[0] }, { $inc: { bankBalance: -amount } }).session(session);
       await Bank.updateOne({ userID: receiver._id }, { $inc: { bankBalance: amount } }).session(session);
    
        
        

        await session.commitTransaction();
        session.endSession();
        const acc1= await Bank.findOne({_id:sender.accounts[0]});
        const acc2= await Bank.findOne({userID:receiver._id})

        console.log(`the sendera${acc1}`)
        console.log(` the reciver ${acc2}`);
        
        

        res.status(200).json({ msg: "Transaction successful" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", err);
        res.status(500).json({ msg: "Transaction failed", error: err.message });
    }
});


bankRouter.put("/addamount", usermiddleware, async (req, res) => {
  try {
    const userName = req.userName;
    const { amount } = req.body; // amount to add

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    // Find the user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userId = user._id;

    // Find the user's bank account
    let bankAcc = await Bank.findOne({ userID: userId });

    // If no bank account, optionally create one
    if (!bankAcc) {
      bankAcc = new Bank({
        userID: userId,
        accountNumber: Math.floor(Math.random() * 1000000000), // random account number
        bankBalance: 0
      });
    }

    // Add the amount
    bankAcc.bankBalance += amount;

    // Save the bank account
    await bankAcc.save();

    // Add bank account to user if newly created
    if (!user.accounts.includes(bankAcc._id)) {
      user.accounts.push(bankAcc._id);
      await user.save();
    }

    res.status(200).json({
      msg: "Amount added successfully",
      balance: bankAcc.bankBalance
    });

  } catch (err) {
    console.error("Error in /addamount:", err);
    res.status(500).json({
      msg: "Error occurred while adding amount",
      error: err.message
    });
  }
});

bankRouter.get("/balance", usermiddleware, async (req, res) => {
  try {
    const userName = req.userName;

    // Find the user
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userID = user._id;

    // Find the user's bank account
    const bankAcc = await Bank.findOne({ userID });

    // If user has no bank account
    if (!bankAcc) {
      return res.status(200).json({
        msg: "User does not have an account"
      });
    }

    // User has account
    const amount = bankAcc.bankBalance;

    res.status(200).json({
      msg: "User found",
      balance: amount,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName
      }
    });

  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({
      msg: "Error in fetching balance",
      error: err.message
    });
  }
});


module.exports = {
    bankRouter
}