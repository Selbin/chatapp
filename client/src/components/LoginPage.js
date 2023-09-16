import React, { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const baseUrl = process.env.REACT_APP_BASE_URL
  
  const navigate  = useNavigate ();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}login`, {
        userName: username,
        passPhrase: password,
      });
      const userData = response.data;
      login(userData);
      navigate('/home')
    } catch (err) {
      if (err.response.status === 404) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="inputContainer">
        <h2>Login Page</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>{error}</div>
    </>
  );
}

export default LoginPage;
