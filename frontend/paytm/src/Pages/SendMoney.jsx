import React, { useState } from 'react';
import { Heading } from '../Components/Heading.jsx';
import { InputBox } from '../Components/InputBox.jsx';
import { API_BASE_URL } from '../config.js';

export const SendMoney = ({ navigate, user }) => {
    const [amount, setAmount] = useState(0);
    const [accountNumber,setaccountNumber]=useState(0);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleTransfer = async () => {
  setMessage("");
  
  if (!accountNumber || amount <= 0) {
    setIsSuccess(false);
    setMessage("Please enter a valid account number and amount greater than 0.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setIsSuccess(false);
    setMessage("You are not logged in. Please sign in again.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/bank/transferMoney`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        receiverName: user.username,
        accountNumber: parseFloat(accountNumber),
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || "Transaction failed");
    }

    setIsSuccess(true);
    setMessage("Transfer Successful!");
    setAmount(0);
    setaccountNumber(0);

    setTimeout(() => navigate('/dashboard'), 2000);
    
  } catch (err) {
    setIsSuccess(false);
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
};

    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
                 <button onClick={() => navigate('dashboard')} className="absolute top-2 right-2 text-2xl font-bold">&times;</button>
                <Heading label="Send Money" />

                <div className="mt-10">
                    <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl text-white">{user.firstName[0].toUpperCase()}</span>
                         </div>
                         <h3 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
                    </div>
                    <div className="space-y-4 mt-4" > <InputBox
                            onChange={(e) => setaccountNumber(e.target.value)}
                            label={"Account_Number"}
                            placeholder={"Enter Account Nuber"}
                            type="number"
                        /></div>
                    <div className="space-y-4 mt-4">
                        <InputBox
                            onChange={(e) => setaccountNumber(e.target.value)}
                            label={"Account_Number"}
                            placeholder={"Enter Account Nuber"}
                            type="number"
                        />
                        <InputBox
                            onChange={(e) => setAmount(e.target.value)}
                            label={"Amount (in ₹)"}
                            placeholder={"Enter amount"}
                            type="number"
                        />
                        <button onClick={handleTransfer} className="w-full text-white bg-green-500 hover:bg-green-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Initiate Transfer
                        </button>
                        {message && (
                            <div className={`text-center font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

