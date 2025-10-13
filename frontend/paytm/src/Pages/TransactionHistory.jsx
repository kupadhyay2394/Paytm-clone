import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "../Components/AppBar.jsx";
import { Button } from "../Components/Button.jsx";
import { API_BASE_URL } from "../config.js";

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/bank/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch transactions");
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AppBar user="User" onLogout={() => {
        localStorage.removeItem("token");
        navigate("/signin");
      }} />

      <div className="container mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Transaction History</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading transactions...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500">No transactions found.</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Type</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{txn.type}</td>
                    <td
                      className={`px-6 py-3 font-medium ${
                        txn.type === "Sent"
                          ? "text-red-500"
                          : txn.type === "Received"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      ₹{txn.amount}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(txn.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-6">
          <Button label="Back to Dashboard" onClick={() => navigate("/dashboard")} />
        </div>
      </div>
    </div>
  );
};
