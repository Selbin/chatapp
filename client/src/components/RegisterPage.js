import React, { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate  = useNavigate ();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/register",{userName: username, passPhrase: password});
      navigate ("/login");
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <>
      <div className="inputContainer">
        <h2>Register Page</h2>
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
        <button onClick={handleRegister}>Register</button>
      </div>
    </>
  );
}

export default RegisterPage;
