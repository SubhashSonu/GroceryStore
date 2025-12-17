import Stripe from "stripe";
import Order from "../models/orderModel.js";
import { sendOrderEmail } from "../utils/emailService.js";
import PDFDocument from "pdfkit";
import { v4 as uuidv4 } from "uuid";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes, deliveryDate } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Invalid or empty items array" });
    }

    const normalizedPM =
      paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment";

    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
      quantity: Number(i.quantity),
      imageUrl: i.imageUrl,
    }));

    const orderId = `ORD-${uuidv4()}`;
    let newOrder;

    //  ONLINE PAYMENT
    if (normalizedPM === "Online Payment") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: orderItems.map((o) => ({
          price_data: {
            currency: "inr",
            product_data: { name: o.name },
            unit_amount: Math.round(o.price * 100),
          },
          quantity: o.quantity,
        })),
        customer_email: customer.email,
        success_url: `${process.env.FRONTEND_URL}/payment/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { orderId },
      });

      newOrder = new Order({
        orderId,
        user: req.user._id,
        customer,
        items: orderItems,
        shipping: 0,
        paymentMethod: normalizedPM,
        paymentStatus: "Unpaid",
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        notes,
        deliveryDate,
      });

      await newOrder.save();
      return res.status(201).json({ order: newOrder, checkoutUrl: session.url });
    }

    // CASH ON DELIVERY
    newOrder = new Order({
      orderId,
      user: req.user._id,
      customer,
      items: orderItems,
      shipping: 0,
      paymentMethod: normalizedPM,
      paymentStatus: "Paid",
      notes,
      deliveryDate,
    });

    await newOrder.save();
    res.status(201).json({ order: newOrder, checkoutUrl: null });
  } catch (error) {
    console.error("Create Order Error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Confirm Stripe Payment
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "session_id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findOneAndUpdate(
      { sessionId: session_id },
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Confirm Payment Error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error", error);
    next(error);
  }
};

//  Get Single Order
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("GetOrderById Error", error);
    next(error);
  }
};

//  Update Order (Admin)
export const updateOrder = async (req, res, next) => {
  try {
    const allowed = ["status", "paymentStatus", "deliveryDate", "notes"];
    const updateData = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.status) {
     await sendOrderEmail(
  updated.customer.email,
  updated.orderId,
  req.body.status,
  updated.items,
  updated.total
);

    }

    res.json(updated);
  } catch (error) {
    console.error("UpdateOrder Error:", error);
    next(error);
  }
};

// Delete Order
export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("DeleteOrder Error", error);
    next(error);
  }
};

//  Invoice PDF 
export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order.orderId}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor("#0D7C66").text("GroceryStore", { align: "center" });
    doc.fontSize(10).fillColor("#555")
      .text("123 Supermarket Road, Patna, Bihar", { align: "center" })
      .text("Phone: +91-9876543210 | GSTIN: 09AABCU9603R1ZM", { align: "center" })
      .moveDown(1.2);

    doc.fontSize(14).fillColor("#0D7C66").text("INVOICE", { align: "center", underline: true }).moveDown(1);

    // Order Info
    doc.fontSize(11).fillColor("black");
    doc.text(`Order ID: ${order.orderId}`);
    doc.text(`Order Date: ${new Date(order.date).toLocaleString("en-IN")}`);
    doc.text(`Customer: ${order.customer.name}`);
    doc.text(`Email: ${order.customer.email}`);
    doc.text(`Phone: ${order.customer.phone}`);
    doc.text(`Address: ${order.customer.address}`).moveDown(1);

    // Table Header
    doc.fontSize(12).fillColor("#0D7C66").text("Items Purchased", { underline: true }).moveDown(0.5);
    const tableTop = doc.y;
    doc.fontSize(10).fillColor("black");

    doc.text("Item", 50, tableTop);
    doc.text("Qty", 230, tableTop);
    doc.text("Price", 300, tableTop);
    doc.text("Total", 380, tableTop);
    doc.moveTo(45, tableTop + 12).lineTo(550, tableTop + 12).stroke("#0D7C66");

    // Items
    let y = tableTop + 20;
    order.items.forEach((item) => {
      doc.text(item.name, 50, y);
      doc.text(item.quantity, 230, y);
      doc.text(`Rs. ${item.price.toFixed(2)}`, 300, y);
      doc.text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 380, y);
      y += 18;
    });

    doc.moveDown(2);

    // Totals
    const delivery = (order.total * 0.05).toFixed(2);
    const grand = (order.total * 1.05).toFixed(2);

    doc.fontSize(11).text(`Subtotal: Rs. ${order.total.toFixed(2)}`, { align: "right" });
    doc.text(`Delivery Charges: Rs. ${delivery}`, { align: "right" });
    doc.text(`Grand Total: Rs. ${grand}`, { align: "right", underline: true });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray")
      .text("Thank you for shopping with us!", { align: "center" })
      .text("Visit again <3", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};
