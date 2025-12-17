import React from 'react'
import AdminNavbar from './components/AdminNavbar'
import AddItemPage from './components/AddItemPage'
import ListItemPage from './components/ListItemPage'
import OrdersPage from './components/OrdersPage'
import { Route, Routes } from 'react-router-dom'



const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
     
     <AdminNavbar/>
     <main className="flex-grow bg-slate-50">

      <Routes>
        <Route path="/admin/add-item" element={<AddItemPage/>}/>
        <Route path="/admin/list-items" element={<ListItemPage/>}/>
        <Route path="/admin/orders" element={<OrdersPage/>}/>

        {/* Default Route */}
        <Route path="*" element={<AddItemPage/>}/>
      </Routes>

     </main>

     
     {/* Footer */}
     
     <footer className="bg-emerald-800 text-white py-4">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} GroceryStore Admin Panel. All rights reserved.</p>

      </div>
      
     </footer>
    </div>
  )
}

export default App