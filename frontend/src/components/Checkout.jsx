import React, { useState } from "react";
import { checkoutStyles as styles } from "../assets/dummyStyles";
import { useCart } from "../CartContext";
import { FiArrowLeft, FiCheck, FiCreditCard, FiPackage, FiTruck, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value
    }));

    if(errors[name]) setErrors((prev) =>(
      {
        ...prev,
        [name]: ""
      }
    ))
  }

  const validateForm = () =>{
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!validateForm()) return;
    setIsSubmitting(true);

    const order = {
      customer: { ...formData },
      items: cart.map(item => ({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      total: getCartTotal(),
      status: 'Pending',
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'COD' ? 'Paid' : 'Unpaid',
      deliveryDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
      notes: formData.notes
    };

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        "https://grocerystore-backend-57i5.onrender.com/api/orders",
        order,
       {
        headers: {
          "Content-Type" : "application/json",
          ...(token && {Authorization: `Bearer ${token}`})

        }
       }
      );

      if(res.data.checkoutUrl){
        window.location.href = res.data.checkoutUrl;
        return;
      }

      if(res.status ===  201 || res.status === 200){
        const createdOrder = res.data.order;
        const displayId = createdOrder.orderId || createdOrder._id;
        clearCart();
        alert(`Order placed successfully! Order ID: ${displayId}`);
        navigate("/order-success", {
  state: { orderId: displayId }
});
      }
      else{
        alert('Order failed, try again')
      }
    } catch (error) {
      console.error(error);
      alert('Failed to place order. Please Try Again.')
    }
    finally{
      setIsSubmitting(false);
    }
  }

  const total = getCartTotal();
  const tax = total*0.05;
  const grandTotal = total + tax;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/cart" className={styles.backLink}>
          <FiArrowLeft className="mr-2 " />
          Back to Cart
        </Link>

        <div className={styles.header}>
          <h1 className={styles.mainTitle}>Checkout</h1>
          <p className={styles.subtitle}>
            Complete your purchase with secure checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <FiUser className="mr-2 text-emerald-300" />
              Customer Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Full Name *
                </label>

                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${styles.input} ${errors.name ? styles.inputError: ""}`} placeholder="Enter your Full Name"/>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Email Address *
                </label>

                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${styles.input} ${errors.name ? styles.inputError: ""}`} placeholder="your@example.com"/>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                 Phone Number *
                </label>

                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`${styles.input} ${errors.phone ? styles.inputError: ""}`} placeholder="10-digits phone number"/>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Delivery Address *
                </label>

                <textarea rows='3' name="address" value={formData.address} onChange={handleChange} className={`${styles.input} ${errors.address ? styles.inputError: ""}`} placeholder="Full Address"/>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-400">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Delivery Notes
                </label>

                <textarea rows="2" name="notes" value={formData.notes} onChange={handleChange} className={styles.input} placeholder="Special instructions, gate code, etc."/>
              </div>
              
              {/* Payment Method */}
              <div>
                <h3 className={styles.sectionTitle}>
                  <FiCreditCard className="mr-2 text-emerald-300"/>
                  Payment Method
                </h3>
                <label className={styles.radioCard}>
                  <input type="radio" name="paymentMethod" value="COD" checked = {formData.paymentMethod === 'COD'} onChange={handleChange} className="h-5 w-5 text-emerald-500"/>
                  <div className="ml-3">
                    <span className="font-medium text-emerald-100">
                      Cash on Delivery
                    </span>
                    <span className="block text-sm text-emerald-400">
                      Pay on Delivery
                    </span>
                  </div>

                </label>

                  <label className={styles.radioCard}>
                  <input type="radio" name="paymentMethod" value="Online" checked = {formData.paymentMethod === 'Online'} onChange={handleChange} className="h-5 w-5 text-emerald-500"/>
                  <div className="ml-3">
                    <span className="font-medium text-emerald-100">
                     Online Payment
                    </span>
                    <span className="block text-sm text-emerald-400">
                      Pay now via card/UPI
                    </span>
                  </div>

                </label>
                
              </div>
 
            </form>
          </div>

          {/* ORDER SUMMARY */}

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <FiPackage className="mr-2 text-emerald-300"/>
              Order Summary
            </h2>

            <div className="mb-6">
             <h3 className="font-medium text-emerald-300 mb-4">
              Your Items ({cart.length})
             </h3>

             <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cart.map(item=>(
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartImage}>
                    {
                      item.imageUrl ? (
                        <img src={`https://grocerystore-backend-57i5.onrender.com${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover rounded" onError={ e=>{
                          e.target.onerror = null;
                          e.target.src = '/no-image.png'
                        }}/>
                      ) :(
                        <FiPackage className="text-emerald-500"/>
                      )
                    }
                  </div>

                  <div className="flex-grow">
                    <div className="font-medium text-emerald-100">
                      {item.name}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400">
                          ₹{item.price.toFixed(2)} x {item.quantity}
                      </span>

                      <span className="font-medium text-emerald-100">
                        ₹{(item.price*item.quantity).toFixed(2)}

                      </span>
                    </div>
                  </div>

                </div>
              ))}

             </div>

            </div>

            <div className="border-t border-emerald-700/50 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-emerald-300">
                Subtotal
              </span>
              <span className="font-medium text-emerald-100">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-emerald-300">Delivery</span>
              <span className="text-emerald-400 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">tax (5%)</span>
              <span className="text-emerald-100 font-medium">
                 ₹{tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between pt-3 mt-3 border-t border-emerald-700/50">
              <span className="text-lg font-bold text-emerald-100">
                Total
              </span>

              <span className="text-lg font-bold text-emerald-300">
                 ₹{grandTotal.toFixed(2)}
              </span>
            </div>
            </div>

            <button onClick={handleSubmit}
            disabled={isSubmitting} className={`${styles.button} ${isSubmitting ? styles.disabledButton : styles.submitButton} mt-6`}>
              {
                isSubmitting ? (
                  <FiCheck className="mr-2 animate-spin"/>
                ) : (
                  <FiCheck className="mr-2"/>
                )
              }

              {isSubmitting ? 'Processing Order' : 'Place Order'}
              
            </button>

            <p className="mt-4 text-center text-sm text-emerald-400">
              by placing your order you agree to our{' '}
              <a href="#" className={styles.link}>
                Terms
              </a>{' '}
              and{' '}
               <a href="#" className={styles.link}>
                Privacy{' '}
              </a>
            </p>

          </div>
        </div>

        <div className={styles.deliveryInfo}>
          <h3>
            <FiTruck className="mr-2"/>
            Delivery Information
          </h3>
          <p>
            We deliver within 30-45 minutes. Order placed after 9PM will be delviered to next morning.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
