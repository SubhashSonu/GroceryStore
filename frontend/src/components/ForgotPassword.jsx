import React, { use, useEffect, useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaUser } from "react-icons/fa";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  // Form Handler

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/forgot-password",
        { email: email.trim(), },
      );

      if (data.success) {
        setShowToast(true);

        setTimeout(() => {
          sessionStorage.setItem("resetEmail", email.trim());
          navigate("/reset-password", {
            state: { email },
          });
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={loginStyles.page}>
      <Link to="/" className={loginStyles.backLink}>
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>

      {/* Toast Notification */}

      {showToast && (
        <div className={loginStyles.toast}>
          <FaCheck className="mr-2" />
          Otp Sent Successfully
        </div>
      )}

      {/* Login Card */}
      <div className={loginStyles.loginCard}>
        <div className={loginStyles.logoContainer}>
          <div className={loginStyles.logoOuter}>
            <div className={loginStyles.logoInner}>
              <FaUser className={loginStyles.logoIcon} />
            </div>
          </div>
        </div>

        <h2 className={loginStyles.title}>Forgot Password</h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email to receive a password reset OTP.
        </p>

        <form onSubmit={handleSubmit} className={loginStyles.form}>
          {/* Email */}

          <div className={loginStyles.inputContainer}>
            <FaUser className={loginStyles.inputIcon} />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={loginStyles.input}
            />
          </div>

          {error && <p className={loginStyles.error}>{error}</p>}

          <button type="submit" className={loginStyles.submitButton}
          disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className={loginStyles.signupText}>
          Remember your password?{" "}
          <Link to="/login" className={loginStyles.signupLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
