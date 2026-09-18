import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../CartContext";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentVerify = () => {
  const [statusMsg, setStatusMsg] = useState("Verifying Payment...");
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const session_id = params.get("session_id");
    const token = localStorage.getItem("authToken");

    if (!session_id) {
      setStatusMsg("Invalid Payment Session");
      return;
    }

    axios.get(`http://localhost:4000/api/orders/confirm`, {
      params: { session_id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => {
      clearCart();
      const orderId = res.data?.orderId || res.data?._id || "N/A";
      navigate("/order-success", { replace: true, state: { orderId } });
    })
    .catch(() => {
      setStatusMsg("Payment failed, redirecting...");
      setTimeout(() => navigate("/checkout"), 2000);
    });
  }, [search, clearCart, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white text-xl">
      {statusMsg}
    </div>
  );
};

export default PaymentVerify;
