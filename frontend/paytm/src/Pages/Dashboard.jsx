import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../Components/AppBar.jsx';
import { Balance } from '../Components/Balance.jsx';
import { Users } from '../Components/Users.jsx';
import { Button } from '../Components/Button.jsx';
import { API_BASE_URL } from '../config.js';

export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🧠 useCallback prevents re-creation on each render
  const fetchBalanceAndUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bank/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.msg === "User does not have an account") {
          setError("You don’t have an account yet. Please create one.");
          setBalance(null);
        } else {
          throw new Error(data.msg || "Failed to fetch balance");
        }
        return;
      }

      setBalance(data.balance || 0);
      setUser(data.user?.firstName || "User");

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBalanceAndUser();
  }, [fetchBalanceAndUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AppBar user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 md:px-8 py-6">
        {/* Balance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading your dashboard...</div>
          ) : error ? (
            <div className="text-center text-red-500">
              {error}
              <div className="mt-3">
                <Button
                  label="Create New Account"
                  onClick={() => navigate('/create-account')}
                />
              </div>
            </div>
          ) : (
            <>
              <Balance value={balance} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Button label="Add Money" onClick={() => navigate('/add-money')} />
                {/* <Button label="Transaction History" onClick={() => navigate('/history')} /> */}
                <Button
                  label="Create New Account"
                  onClick={() => navigate('/create-account')}
                />
              </div>
            </>
          )}
        </div>

        {/* Users / Send Money Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* 🔁 Pass callback to update balance after transaction */}
          <Users onTransactionComplete={fetchBalanceAndUser} />
        </div>
      </div>
    </div>
  );
};
