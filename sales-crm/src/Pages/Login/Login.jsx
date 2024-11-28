import React, { useState } from "react";
import "./Login.css";
import {
  signup,
  login,
  googleLogin,
  microsoftLogin,
} from "../../firebase";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (currState === "Sign Up") {
        await signup(userName, email, password);
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google Sign-In failed.");
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      await microsoftLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Microsoft Sign-In failed.");
    }
  };

  return (
    <div className="login">
      <img src={assets.logo} alt="Logo" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>

        {currState === "Sign Up" && (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          className="form-input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button type="submit" className="login-button">
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className="login-term">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          />
          <p>Agree to the terms of use and Privacy Policy</p>
        </div>

        <div className="login-forgot">
          {currState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login Here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an Account!{" "}
              <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
            </p>
          )}
        </div>

        <hr />
        <p>Or login using:</p>
        <div className="social-login">
          <button type="button" onClick={handleGoogleLogin}>
            <img src={assets.google} alt="Google Icon" />
          </button>
          <button type="button" onClick={handleMicrosoftLogin}>
            <img src={assets.microsoft} alt="Microsoft Icon" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
