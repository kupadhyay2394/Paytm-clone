import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Heading } from '../Components/Heading.jsx';
import { SubHeading } from '../Components/Subheading.jsx';
import { InputBox } from '../Components/InputBox.jsx';
import { Button } from '../Components/Button.jsx';
import { BottomWarning } from '../Components/BottomWarning.jsx';
import { API_BASE_URL } from '../config.js';

export const Signin = () => { 
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async () => {
    if (!userName || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Failed to sign in");
      }
      if (!data.token) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("token", data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signin error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-md text-center p-2 h-max px-4">
      <Heading label="Sign In" />
      <SubHeading label="Enter your credentials to access your account" />
      {error && <div className="text-red-500 text-sm pb-2">{error}</div>}
      <InputBox onChange={e => setUsername(e.target.value)} label="Email" placeholder="johndoe@example.com" />
      <InputBox onChange={e => setPassword(e.target.value)} label="Password" placeholder="••••••••" type="password" />
      <Button onClick={handleSignin} label={loading ? "Signing In..." : "Sign In"} disabled={loading} />
      <BottomWarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
    </div>
  );
};
