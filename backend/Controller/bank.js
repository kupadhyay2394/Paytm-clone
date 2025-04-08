const { Bank } = require("../Schema/bank");



module.exports = async function transaction(senderId, receiverId, transactionAmount) {
    try {
      const sender = await Bank.findOne({ userID: senderId }); 
    //   console.log("Sender Before Transaction:", sender);
    //   console.log("Transaction Amount:", transactionAmount);
  
      if (!sender) return "Sender not found";



      
    if (sender.bankBalance < parseFloat(transactionAmount)) {
       
        
        return "Not Enough money";
      }
      
      
  
      ;
      
      
  
      return "success";
    } catch (error) {
      console.error("Transaction Error:", error);
      return "Transaction failed due to an error.";
    }
  };
  