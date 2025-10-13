import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../Components/Heading';
import { SubHeading } from '../Components/Subheading';
import { InputBox } from '../Components/InputBox';
import { Button } from '../Components/Button';
import { API_BASE_URL } from '../config';

export const AddMoneyPage = () => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddMoney = async () => {
        // Reset states on new submission
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // --- Input Validation ---
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("Please enter a valid amount greater than zero.");
            setIsLoading(false);
            return;
        }

        // --- Authentication ---
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication error. Please sign in again.");
            navigate('/signin');
            return;
        }

        // --- API Call ---
        try {
            const response = await fetch(`${API_BASE_URL}/bank/addamount`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: numericAmount })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to complete the transaction.");
            }

            // --- Handle Success ---
            setSuccessMessage(data.msg || `Successfully deposited $${numericAmount.toFixed(2)}!`);
            setAmount(""); // Clear the input field
            
            // Redirect back to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000); // 2-second delay

        } catch (err) {
            console.error("Add money error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false); // Re-enable the button
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="bg-white rounded-lg w-full max-w-md text-center p-6 shadow-lg">
                <Heading label={"Add Money"} />
                <SubHeading label={"Enter the amount you wish to deposit"} />
                
                {/* --- Feedback Messages --- */}
                {error && <div className="text-red-500 text-sm py-2">{error}</div>}
                {successMessage && <div className="text-green-500 text-sm py-2">{successMessage}</div>}

                <InputBox
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    label={"Amount"}
                    placeholder={"e.g., 100.00"}
                    type="number"
                />
                
                <Button
                    onClick={handleAddMoney}
                    // Disable button while loading to prevent multiple submissions
                    disabled={isLoading} 
                    // Change label during submission for better UX
                    label={isLoading ? "Processing..." : "Deposit Funds"}
                />

                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="text-gray-600 hover:text-gray-800 text-sm mt-4 underline"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};