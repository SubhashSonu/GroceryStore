import React, { use, useEffect, useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaUser } from 'react-icons/fa'
import Logout from './Logout'



const Login = () => {

     const [isAuthenticated, setIsAuthenticated] = useState(
        Boolean(localStorage.getItem('authToken'))
      )

      const [formData, setFormData] = useState({
        email : "",
        password: "",
        remember: false,
      })

      const [showPassword, setShowPassword] = useState(false)

      const [showToast, setShowToast] = useState(false)
      const [error, setError] = useState('')
      const navigate = useNavigate();

        useEffect(()=>{
          const handler = ()=>{
            setIsAuthenticated(Boolean(localStorage.getItem('authToken')))
          }
          window.addEventListener('authStateChanged',handler)
          return () => window.removeEventListener('authStateChanged', handler)
        },[])

        if(isAuthenticated){
          return <Logout/>
        }

        // Form Handler
        const handleChange = (e) =>{
          const {name, value, type, checked} = e.target;

          setFormData((prev) =>({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
          }))
        }

        const handleSubmit = (e) =>{
          e.preventDefault();
          if(!formData.remember){
            setError("You must agree to terms & condition")
            return;
          }

           // Generate token and store user data
        const token = 'mock_token';
        const userData = {
          email: formData.email,
          token,
          timestamp: new Data().toISOString(),

        
        }
          localStorage.setItem('authToken',token)
          localStorage.setItem('userData',JSON.stringify(userData))
          
          setError('')
          setShowToast(true);

          window.dispatchEvent(new Event('authStateChanged'))
       
        }


  return (
    <div className={loginStyles.page}>
        <Link to='/' className={loginStyles.backLink}>
        <FaArrowLeft className='mr-2'/>
        Back to Home
        </Link>

        {/* Toast Notification */}

        {
          showToast && (
            <div className={loginStyles.toast}>
                 <FaCheck className="mr-2"/>
                 Login Successful!
              </div>
          )
        }

        {/* Login Card */}
        <div className={loginStyles.loginCard}>
          <div className={loginStyles.logoContainer}>
            <div className={loginStyles.logoOuter}>
              <div className={loginStyles.logoInner}>
               <FaUser className={loginStyles.logoIcon}/>
              </div>

            </div>

          </div>

          <h2 className={loginStyles.title}>Welcome Back</h2>

          <form onSubmit={handleSubmit} className={loginStyles.form}>
             {/* Email */}

             <div className={loginStyles.inputContainer}>
                   <FaUser className={loginStyles.inputIcon}/>
                   <input type="email" name="email" value={form}/>
             </div>
          </form>

        </div>


    </div>
  )
}

export default Login