import React, { useState } from "react";
import "./login.css";
import "../Styles/style.css";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const errorMessage = {
    color: "red",
    marginTop: "-5px",
    fontSize: "14px",
  };

  const errorEmail = {
    position: "relative",
    marginTop: "-10px",
    fontSize: "14px",
    color: "rgba(236, 18, 18, 0.5)",
  };

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errorRequired, setError] = useState({});
  const [oldUser, setOldUser] = useState(() => {
    const userSave = localStorage.getItem("userData");
    return userSave ? JSON.parse(userSave) : [];
  });

  const [showPass, setShowPass] = useState(false);

  const [LoginError, setLoginError] = useState("");

  const isEmailError =
    Email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);
  const requireError = {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Email.trim()) {
      requireError.Email = "Email is Required!";
    }

    if (!Password.trim()) {
      requireError.Password = "Password is required";
    }

    setError(requireError);

    if (Object.keys(requireError).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/login",
        {
          email: Email,
          password: Password,
        },
      );
      console.log(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.status);
      console.log(error.response?.data);
      console.log(error.response?.data?.message);

      setLoginError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
        "http://127.0.0.1:8000/api/user/google/redirect";
};

  return (
    <>
      <main className="Login">
        <div className="auth-card">
          <p className="eyebrow">
            <span></span> MEMBER ACCESS
          </p>
          <h1>Welcome back.</h1>
          <p>Sign in to your Ember & Bean account and continue your order.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span style={errorMessage}></span>
              {errorRequired.Email && (
                <span style={errorMessage}>{errorRequired.Email}</span>
              )}
              {isEmailError && (
                <span style={errorEmail}>Email must be @email.com</span>
              )}
            </label>

            <label>
  Password

  <div
    style={{
      position: "relative",
      width: "100%",
    }}
  >
    <input
      type={showPass ? "text" : "password"}
      placeholder="Enter your password"
      value={Password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        width: "100%",
        paddingRight: "45px",
        boxSizing: "border-box",
      }}
    />

    <button
      type="button"
      onClick={() => setShowPass(!showPass)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "40px",
        height: "30px",
        padding: 0,
        margin: 0,
        background: "transparent",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color : "rgba(75, 75, 75, 0.64)"
      }}
    >
      <iconify-icon
        icon={showPass ? "akar-icons:eye-closed" : "akar-icons:eye"}
        width="25"
        height="25"
      ></iconify-icon>
    </button>
  </div>

  {errorRequired.Password && (
    <span style={errorMessage}>
      {errorRequired.Password}
    </span>
  )}

  {LoginError && (
    <span style={errorMessage}>
      {LoginError}
    </span>
  )}
</label>
            <button className="auth-btn" type="submit">
              Login
            </button>
            {/* <div style={eMessage}>This Message is Bla Bla Bla!</div> */}

            <button className="google-btn" type="button" onClick={handleGoogleLogin}>
              <span>G</span> Login with Google
            </button>
          </form>

          <p className="auth-link">
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;
