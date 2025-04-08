const { User} = require("./user.js");
const mongoose = require("mongoose");

const bankSchema=  new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    accountNumber:{
        type:Number
    },
    bankBalance:{
        type:Number
    }
})

const Bank = mongoose.model('Bank', bankSchema);

module.exports={
    Bank
}