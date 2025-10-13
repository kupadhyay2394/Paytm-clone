import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../Components/Heading';
import { SubHeading } from '../Components/Subheading';
import { InputBox } from '../Components/InputBox';
import { Button } from '../Components/Button.jsx';
import { BottomWarning } from '../Components/BottomWarning';

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  const handleSignup = async () => {
    setError(null);

    if (!firstName || !lastName || !userName || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, userName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Signup failed. Please try again.");
      }

      // Save token and redirect
      localStorage.setItem("token", data.token);
      navigate("/signin");

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-center p-6">
        <Heading label={"Sign Up"} />
        <SubHeading label={"Create a new account to get started"} />

        {error && (
          <div className="text-red-500 bg-red-100 p-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <InputBox
          onChange={e => setFirstName(e.target.value)}
          label={"First Name"}
          placeholder={"John"}
        />
        <InputBox
          onChange={e => setLastName(e.target.value)}
          label={"Last Name"}
          placeholder={"Doe"}
        />
        <InputBox
          onChange={e => setUserName(e.target.value)}
          label={"Email / Username"}
          placeholder={"johndoe@example.com"}
        />
        <InputBox
          onChange={e => setPassword(e.target.value)}
          label={"Password"}
          placeholder={"••••••••"}
          type="password"
        />

        <div className="pt-4">
          <Button
            onClick={handleSignup}
            label={loading ? "Signing up..." : "Sign Up"}
          />
        </div>

        <BottomWarning
          label={"Already have an account?"}
          buttonText={"Sign in"}
          to={'/signin'}
        />
      </div>
    </div>
  );
};
