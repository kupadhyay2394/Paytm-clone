import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../Components/Heading';
import { SubHeading } from '../Components/Subheading';
import { InputBox } from '../Components/InputBox';
import { Button } from '../Components/Button';
import { API_BASE_URL } from '../config';

export const CreateAccountPage = () => {
    const [accountType, setAccountType] = useState('Savings'); // Default to Savings
    const [initialDeposit, setInitialDeposit] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // --- Input Validation ---
        const numericDeposit = Number(initialDeposit);
        if (isNaN(numericDeposit) || numericDeposit < 0) {
            setError("Please enter a valid, non-negative initial deposit.");
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
            // ASSUMPTION: This is your backend endpoint for creating an account
            const response = await fetch(`${API_BASE_URL}/bank/createAccount`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: numericDeposit
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to create the account.");
            }

            // --- Handle Success ---
            setSuccessMessage(data.msg || `Successfully created new ${accountType} account!`);
            setInitialDeposit(''); // Clear the input field
            
            // Redirect back to the dashboard after a short delay to let the user read the message
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500); // 2.5-second delay

        } catch (err) {
            console.error("Create account error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false); // Re-enable the button
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center">
            <div className="bg-white rounded-lg w-full max-w-md text-center p-6 shadow-lg">
                <Heading label={"Create New Account"} />
                <SubHeading label={"Choose an account type and make an initial deposit"} />
                
                {/* --- Feedback Messages --- */}
                {error && <div className="text-red-500 text-sm py-2">{error}</div>}
                {successMessage && <div className="text-green-500 text-sm py-2">{successMessage}</div>}

                {/* --- Form Inputs --- */}
                <div className="text-left my-4">
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-900 pb-2">
                        Account Type
                    </label>
                    <select
                        id="accountType"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="Savings">Savings Account</option>
                        <option value="Checking">Checking Account</option>
                        <option value="Investment">Investment Account</option>
                    </select>
                </div>
                
                <InputBox
                    value={initialDeposit}
                    onChange={e => setInitialDeposit(e.target.value)}
                    label={"Initial Deposit (Optional)"}
                    placeholder={"e.g., 50.00"}
                    type="number"
                />
                
                <Button
                    onClick={handleCreateAccount}
                    disabled={isLoading} 
                    label={isLoading ? "Creating..." : "Create Account"}
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