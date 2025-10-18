import { useEffect, useState } from 'react'
import { Navigate, Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { CartProvider } from './CartContext'
import Contact from './pages/contact'
import Items from './pages/Items'
import Login from './components/Login'
import Signup from './components/Signup'
import Logout from './components/Logout'
import Navbar from './components/Navbar'





const ScrollToTop = () =>{
  const {pathname} = useLocation();
  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname]);
  return null;
}


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('authToken'))
  )

  useEffect(()=>{
    const handler = ()=>{
      setIsAuthenticated(Boolean(localStorage.getItem('authToken')))
    }
    window.addEventListener('authStateChanged',handler)
    return () => window.removeEventListener('authStateChanged', handler)
  },[])

  return (
    <CartProvider>
      <ScrollToTop/>
      <Navbar isAuthenticated={isAuthenticated}/>
      
   <Routes>
     <Route path="/" element={<Home/>} />
     <Route path="/contact" element={<Contact/>}/>
     <Route path="/items" element={<Items/>}/>

     <Route path="/cart" element={isAuthenticated ? <Cart/> : <Navigate replace to='/login'/>}/>

     {/* Auth Routes */}
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/>
     <Route path="/logout" element={<Logout/>}/>

   </Routes>
   </CartProvider>
  )
}

export default App

