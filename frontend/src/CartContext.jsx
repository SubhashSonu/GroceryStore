import React,{createContext, useContext, useEffect, useState} from 'react'


const CartContext = createContext();

export const CartProvider = ({children}) =>{
    const [cart, setCart] = useState(()=>{
        try{
            const savedCart = localStorage.getItem('cart')
            return savedCart ? JSON.parse(savedCart) : []
        }
        catch{
            return []
        }
    })
    // It will save the cart in localstorage with item id else it will be a empty array

    // sync cart to localstorage whenever it changes 
    useEffect(()=>{
        localStorage.setItem('cart',JSON.stringify(cart))
    },[cart])

    // add an item to cart or increase

    const addToCart = (item,quantity = 1)=>{
        setCart(prevCart =>{
            const existingItem = prevCart.find(ci => ci.id === item.id);
            if(existingItem){
               return prevCart.map(ci =>
                ci.id === item.id
                  ? { ...ci, quantity: ci.quantity + quantity} : ci
               )
            }
            else 
                return [...prevCart,{...item, quantity}]
        
        })
    }

    // Remove from cart
    const removeFromCart = itemId =>{
        setCart(prevCart => prevCart.filter(ci => ci.id !== itemId));
    }

    // Update Item Quantity
    const updateQuantity = (itemId, newQuantity) =>{
        if(newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(ci => 
                ci.id === itemId ? {...ci, quantity:newQuantity} : ci)
        )
    }


    // Clear Cart
    const clearCart = () =>{
        setCart([]);
    }

    // Calculate total cost
    const getCartTotal = () => cart.reduce((total,ci) => total + ci.price*ci.quantity,0)

    // Calculate total number of items in a cart
     const cartCount = () => cart.reduce((count,ci) => count + ci.quantity,0)


     return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal
        }}>
        {children}
        </CartContext.Provider>
     )
}

// Custom Hook For Cart Context
export const useCart = () =>{
    const context = useContext(CartContext)
    if(!context){
        throw new Error('USECART MUST BE WITHIN A CARTPROVIDER')
    }
    return context;
}
