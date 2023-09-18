import React, { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [passPhrase, setPassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL

  const navigate  = useNavigate ();

  const handleRegister = async () => {
    try {
      await axios.post(`${baseUrl}register`,{userName, passPhrase});
      navigate ("/login");
    } catch (err) {
      console.log(err)
      setErrorMessage(err.message)
    }
  };

  return (
    <>
      <div className="inputContainer">
        <h2>Register Page</h2>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      
        <input
          type="text"
          placeholder="Passphrase"
          value={passPhrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <div style={{color: 'red'}}>{errorMessage}</div>
    </>
  );
}

export default RegisterPage;
