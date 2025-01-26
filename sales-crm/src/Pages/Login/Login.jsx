import React, { useState } from "react";
import "./Login.css";
import { signup, login, googleLogin, microsoftLogin } from "../../firebase";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the Toastify CSS

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currState === "Sign Up") {
        await signup(userName, email, password);
        toast.success("Account created successfully!");  // Success toast
      } else {
        await login(email, password);
        toast.success("Login successful!");  // Success toast
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");  // Error toast
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Google login successful!");  // Success toast
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Google Sign-In failed.");  // Error toast
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      await microsoftLogin();
      toast.success("Microsoft login successful!");  // Success toast
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Microsoft Sign-In failed.");  // Error toast
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
          {/* <button type="button" onClick={handleMicrosoftLogin}>
            <img src={assets.microsoft} alt="Microsoft Icon" />
          </button> */}
        </div>
      </form>

      {/* ToastContainer to render the toast messages */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
    </div>
  );
};

export default Login;
