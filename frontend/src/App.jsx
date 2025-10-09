import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import { CartProvider } from './CartContext'


function App() {

  return (
    <CartProvider>
   <Routes>
     <Route path="/" element={<Home/>} />
   </Routes>
   </CartProvider>
  )
}

export default App
