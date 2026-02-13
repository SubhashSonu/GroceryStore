import React, { useEffect, useState } from "react";
import { ordersPageStyles as styles } from "../assets/dummyStyles";
import axios from "axios";
import {
  FiArrowLeft,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSearch,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData.email || "";

  // fetch orders
  const fetchAndFilteredOrders = async () => {
    try {
      const res = await axios.get("https://grocerystore-backend-57i5.onrender.com/api/orders");
      const allOrders = res.data;

      const mine = allOrders.filter(
        (o) => o.customer?.email?.toLowerCase() === userEmail.toLowerCase()
      );
      setOrders(mine);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchAndFilteredOrders();
  }, []);

  // console.log(orders);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.items.some((i) =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }, [orders, searchTerm]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

const downloadInvoice = async (orderId) => {
  const token = localStorage.getItem("authToken");

  try {
    const res = await axios.get(
      `https://grocerystore-backend-57i5.onrender.com/api/orders/${orderId}/invoice`,
      {
        responseType: "blob", // important for file
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Invoice download error", error);
    alert("Failed to download invoice");
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <a href="#" className={styles.backLink}>
            <FiArrowLeft className="mr-2" /> Back to Account
          </a>

          <h1 className={styles.mainTitle}>
            My <span className={styles.titleSpan}>Orders</span>
          </h1>
          <p className={styles.subtitle}>
            View your order history and track current orders
          </p>
          <div className={styles.titleDivider}>
            <div className={styles.dividerLine} />
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search orders or products"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton}>
              <FiSearch size={18} />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.ordersTable}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Order ID</th>
                  <th className={styles.tableHeaderCell}>Date & Time</th>
                  <th className={styles.tableHeaderCell}>Items</th>
                  <th className={styles.tableHeaderCell}>Total</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-emerald-700/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiPackage className="text-emerald-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-emerald-100 mb-1">
                          No orders found
                        </h3>
                        <p className="text-emerald-300">
                          Try adjusting your search
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className={styles.tableRow}>
                      <td
                        className={`${styles.tableCell} font-medium text-emerald-200`}
                      >
                        {order.orderId}
                      </td>

                      {/* Date + Time */}
                      <td className={`${styles.tableCell} text-sm`}>
                        {new Date(order.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      <td className={styles.tableCell}>
                        <div className="text-emerald-100">
                          {order.items?.length} items
                        </div>
                      </td>

                      <td className={`${styles.tableCell} font-medium`}>
                        ₹{order.total.toFixed(2)}
                      </td>

                      <td className={styles.tableCell}>
                        <span
                          className={`${styles.statusBadge} ${
                            order.status === "Delivered"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : order.status === "Processing"
                              ? "bg-amber-500/20 text-amber-200"
                              : order.status === "Shipped"
                              ? "bg-blue-500/20 text-blue-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className={styles.tableCell}>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className={styles.actionButton}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className="flex justify-between items-center">
                <h2 className={styles.modalTitle}>
                  Order Details: {selectedOrder._id}
                </h2>
                <button
                  onClick={closeModal}
                  className={styles.modalCloseButton}
                >
                  <FiX size={24} />
                </button>
              </div>

              <p className="text-emerald-300 mt-1">
                Ordered on{" "}
                {new Date(selectedOrder.date).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiUser className="mr-2 text-emerald-300" /> My
                      Information
                    </h3>

                    <div className={styles.modalCard}>
                      <div className="mb-3">
                        <div className="font-medium text-emerald-100">
                          {selectedOrder.customer.name}
                        </div>

                        <div className="text-emerald-300 flex items-center mt-2">
                          <FiMail className="mr-2 flex-shrink-0" />{" "}
                          {selectedOrder.customer.email}
                        </div>

                        <div className="text-emerald-300 flex items-center mt-2">
                          <FiPhone className="mr-2 flex-shrink-0" />{" "}
                          {selectedOrder.customer.phone}
                        </div>
                      </div>

                      <div className="flex items-start mt-1">
                        <FiMapPin className="text-emerald-400 mr-2 mt-1 flex-shrink" />
                        <div className="text-emerald-300">
                          {selectedOrder.customer.address}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>
                        Delivery Notes
                      </h3>
                      <div className="bg-emerald-800/50 border-l-4 border-emerald-400 p-4 rounded-lg">
                        <p className="text-emerald-200">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Order Summary */}
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>
                    <FiPackage className="mr-2 text-emerald-300" /> Order
                    Summary
                  </h3>

                  <div className="border border-emerald-700 rounded-xl overflow-hidden">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={item._id || index}
                        className={`flex items-center p-4 bg-emerald-900/30 ${
                          index !== selectedOrder.items.length - 1
                            ? "border-b border-emerald-700"
                            : ""
                        }`}
                      >
                        {item.imageUrl ? (
                          <img
                            src={`https://grocerystore-backend-57i5.onrender.com${item.imageUrl}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover mr-4"
                          />
                        ) : (
                          <div className="bg-emerald-800 border-2 border-dashed border-emerald-700 rounded-xl w-16 h-16 mr-4 flex items-center justify-center">
                            <FiPackage className="text-emerald-500" />
                          </div>
                        )}

                        <div className="flex-grow">
                          <div className="font-medium text-emerald-100">
                            {item.name}
                          </div>
                          <div className="text-emerald-400">
                            ₹{item.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>

                        <div className="font-medium text-emerald-100">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}

                    {/* order totals */}
                    <div className="p-4 bg-emerald-800/50">
                      <div className="flex justify-between py-2">
                        <span className="text-emerald-300">Subtotal</span>
                        <span className="font-medium text-emerald-100">
                          ₹{selectedOrder.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between py-2">
                        <span className="text-emerald-300">Shipping</span>
                        <span className="font-medium text-emerald-400">
                          Free
                        </span>
                      </div>

                      <div className="flex justify-between py-2">
                        <span className="text-emerald-300">
                          Delivery Charges
                        </span>
                        <span className="font-medium text-emerald-100">
                          ₹{(selectedOrder.total * 0.05).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-4 mt-2 border-t border-emerald-700">
                        <span className="text-lg font-bold text-emerald-100">
                          Total
                        </span>
                        <span className="text-lg font-bold text-emerald-300">
                          ₹{(selectedOrder.total * 1.05).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Payment & Shipping moved below Order Summary */}
                  <div className="mt-6 space-y-4">
                    {/* Payment info */}
                    <div>
                      <h3 className={styles.modalSectionTitle}>
                        <FiCreditCard className="mr-2 text-emerald-300" />
                        Payment
                      </h3>

                      <div className={styles.modalCard}>
                        <div className="flex justify-between mb-3">
                          <span className="text-emerald-300">Method:</span>
                          <span className="font-medium text-emerald-100">
                            {selectedOrder.paymentMethod}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-emerald-300">Status:</span>
                          <span
                            className={`px-2 rounded-full text-xs font-medium ${
                              selectedOrder.paymentStatus === "Paid"
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-red-500/20 text-red-200"
                            }`}
                          >
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping info */}
                    <div>
                      <h3 className={styles.modalSectionTitle}>
                        <FiTruck className="mr-2 text-emerald-300" />
                        Shipping
                      </h3>

                      <div className={styles.modalCard}>
                        <div className="flex justify-between mb-3">
                          <span className="text-emerald-300">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedOrder.status === "Delivered"
                                ? "bg-emerald-500/20 text-emerald-200"
                                : selectedOrder.status === "Shipped"
                                ? "bg-blue-500/20 text-blue-200"
                                : selectedOrder.status === "Cancelled"
                                ? "bg-red-500/20 text-red-200"
                                : "bg-amber-500/20 text-amber-200"
                            }`}
                          >
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className={styles.modalFooter}>
              <div className="flex justify-end">
                <button
                  onClick={() => downloadInvoice(selectedOrder._id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg mr-3"
                >
                  Download Invoice
                </button>
                <button onClick={closeModal} className={styles.closeButton}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
