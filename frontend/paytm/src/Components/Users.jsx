import React, { useState } from "react";
import { API_BASE_URL } from "../config.js";
import { Button } from "./Button.jsx";

export const Users = ({ onTransactionComplete }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState(0);

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    if (!query.trim()) {
      setMessage("Please enter a username to search.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/findAs?userTobeFind=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.msg || "No user found.");
        setUsers([]);
      } else {
        setUsers(data.users);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    if (!selectedUser) {
      setMessage("Please select a user to transfer money to.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bank/transferMoney`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reciverName: selectedUser,
          amount: parseFloat(amount),
          accountNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.msg || "Transaction failed.");
      } else {
        setMessage(`✅ Successfully sent ₹${amount} to ${selectedUser}`);
        setAmount("");
        setSelectedUser(null);

        // 🔁 Refresh balance after transaction
        if (onTransactionComplete) {
          onTransactionComplete();
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Error during transaction.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Send Money</h2>
      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search user by username"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button label="Search" onClick={handleSearch} />
      </div>

      {loading && <p className="text-gray-500">Searching users...</p>}
      {message && <p className="text-center text-red-500">{message}</p>}

      {users.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Results:</h3>
          <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {users.map((u) => (
              <li
                key={u.userName}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedUser === u.userName ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedUser(u.userName)}
              >
                {u.userName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <p className="font-medium mb-2">Send money to: {selectedUser}</p>
          <input
            type="number"
            placeholder="Enter Account no."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 mb-3"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter amount"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button label="Send Money" onClick={handleTransfer} />
        </div>
      )}
    </div>
  );
};
