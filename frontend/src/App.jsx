import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { CartProvider } from './CartContext'
import Contact from './pages/contact'
import Items from './pages/Items'
import Login from './components/Login'
import Signup from './components/Signup'
import Logout from './components/Logout'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import { Toaster } from "react-hot-toast";
import MyOrders from './components/MyOrders'
import Checkout from './components/Checkout'
import axios from "axios";
import PaymentVerify from './pages/PaymentVerify'
import OrderSuccess from './pages/OrderSuccess'

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && error?.response?.data?.message === "Token expired") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      document.cookie = "token=; Max-Age=0; path=/;";
      window.dispatchEvent(new Event("authStateChanged"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]);
  return null;
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('authToken'))
  )

  useEffect(() => {
    const handler = () => setIsAuthenticated(Boolean(localStorage.getItem('authToken')))
    window.addEventListener('authStateChanged', handler)
    return () => window.removeEventListener('authStateChanged', handler)
  }, [])

  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/items" element={<Items />} />

        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate replace to='/login' />} />

        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* ✅ CHANGE THIS */}
        <Route path="/payment/verify" element={<PaymentVerify />} /> 
        {/* ✅ SUCCESS PAGE */}
        <Route path="/order-success" element={<OrderSuccess />} /> 

      </Routes>

      <Toaster position="bottom-right" reverseOrder={false} />
    </CartProvider>
  )
}

export default App;
