import React, { useEffect, useState } from 'react'
import { signupStyles } from '../assets/dummyStyles'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, 
  FaCheck, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaUser 
} from 'react-icons/fa'
import axios from 'axios'

const Signup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('authToken'))
  )

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
        navigate('/login')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showToast, navigate])

  // Form Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    if (apiError) {
      setApiError('')
    }
  }

  // Validating all fields
  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.remember) newErrors.remember = "You must agree to Terms and Conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.post(
        'https://grocerystore-backend-57i5.onrender.com/api/user/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (res.data.success) {
        setShowToast(true)
      } else {
        setApiError(res.data.message || 'Registration failed')
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(error.response.data.message)
      } else {
        setApiError('Server Error')
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className={signupStyles.page}>
      <Link to='/login' className={signupStyles.backLink}>
        <FaArrowLeft className="mr-2" />
        Back to Login
      </Link>

      {showToast && (
        <div className={signupStyles.toast}>
          <FaCheck className="mr-2" />
          Account created successfully!
        </div>
      )}

      {apiError && <p className={signupStyles.error}>{apiError}</p>}

      {/* Signup Card */}
      <div className={signupStyles.signupCard}>
        <div className={signupStyles.logoContainer}>
          <div className={signupStyles.logoOuter}>
            <div className={signupStyles.logoInner}>
              <FaUser className={signupStyles.logoIcon} />
            </div>
          </div>
        </div>

        <h2 className={signupStyles.title}>Create Account</h2>

        <form onSubmit={handleSubmit} className={signupStyles.form}>
          <div className={signupStyles.inputContainer}>
            <FaUser className={signupStyles.inputIcon} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className={signupStyles.input}
            />
            {errors.name && <p className={signupStyles.error}>{errors.name}</p>}
          </div>

          <div className={signupStyles.inputContainer}>
            <FaEnvelope className={signupStyles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className={signupStyles.input}
            />
            {errors.email && <p className={signupStyles.error}>{errors.email}</p>}
          </div>

          <div className={signupStyles.inputContainer}>
            <FaLock className={signupStyles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={signupStyles.passwordInput}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={signupStyles.toggleButton}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className={signupStyles.error}>{errors.password}</p>}
          </div>

          <div className={signupStyles.termsContainer}>
            <label className={signupStyles.termsLabel}>
              <input
                type='checkbox'
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className={signupStyles.termsCheckbox}
                required
              />
              I agree to the Terms and Conditions
            </label>
            {errors.remember && <p className={signupStyles.error}>{errors.remember}</p>}
          </div>

          <button type="submit" className={signupStyles.submitButton}>
            Sign Up
          </button>
        </form>

        <p className={signupStyles.signinText}>
          Already have an account?{" "}
          <Link to="/login" className={signupStyles.signinLink}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
