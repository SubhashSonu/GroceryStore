import React, { use, useEffect, useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

const email =
  location.state?.email ||
  sessionStorage.getItem("resetEmail") ||
  "";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Form Handler

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/reset-password",
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword,
        },
      );

      if (data.success) {
        setShowToast(true);
        
         sessionStorage.removeItem("resetEmail");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
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
          Password Reset Successfully!
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

        <h2 className={loginStyles.title}>Reset Password</h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter the OTP sent to your email and choose a new password.
        </p>

        <form onSubmit={handleSubmit} className={loginStyles.form}>
          {/* Email */}

          <div className={loginStyles.inputContainer}>
            <FaUser className={loginStyles.inputIcon} />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={loginStyles.input}
            />
          </div>

          <div className={loginStyles.inputContainer}>
            <FaLock className={loginStyles.inputIcon} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={loginStyles.passwordInput}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={loginStyles.toggleButton}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={loginStyles.inputContainer}>
            <FaLock className={loginStyles.inputIcon} />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={loginStyles.passwordInput}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={loginStyles.toggleButton}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <p className={loginStyles.error}>{error}</p>}

          <button
            type="submit"
            className={loginStyles.submitButton}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
