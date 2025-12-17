import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A";

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-emerald-900 to-emerald-700 p-6">
      
      <div className="bg-emerald-800/30 backdrop-blur-xl border border-emerald-500/40 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">

        {/* Check Icon */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-emerald-600/30 flex items-center justify-center animate-scaleIn">
          <FiCheckCircle className="text-emerald-300 text-6xl" />
        </div>

        <h1 className="text-3xl font-bold text-white">Order Successful 🎉</h1>

        <p className="text-emerald-200 mt-2 mb-6">
          Your order has been placed successfully!
        </p>

        {/* Order ID Box */}
        <div className="bg-emerald-900/40 border border-emerald-600/50 rounded-xl p-4 mb-6">
          <p className="text-emerald-300 text-sm">Order ID</p>
          <p className="text-emerald-100 font-semibold text-lg mt-1">{orderId}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <Link
            to="/myorders"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="w-full bg-white text-emerald-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}
