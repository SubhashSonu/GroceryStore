// src/components/ChatHelperAI.jsx
import React, { useState } from "react";
import { FaComment, FaTimes } from "react-icons/fa";
import { useCart } from "../CartContext"; // Make sure you have your CartContext

const products = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
]; // Example items

const ChatHelperAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to FreshGrocers. How can I help you today?", from: "bot" },
  ]);
  const [input, setInput] = useState("");
  const { addToCart } = useCart();

  // Basic AI response function
  const handleBotResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();

    // Add to cart command
    const addRegex = /add (\d+) (\w+)/;
    const match = lower.match(addRegex);
    if (match) {
      const quantity = parseInt(match[1]);
      const itemName = match[2];
      const product = products.find((p) => p.name.toLowerCase() === itemName);
      if (product) {
        addToCart(product, quantity);
        return `✅ Added ${quantity} ${product.name}(s) to your cart!`;
      } else return `❌ Sorry, we don't have ${itemName}.`;
    }

    // FAQs
    if (lower.includes("delivery")) return "🚚 Our standard delivery is within 2-3 days!";
    if (lower.includes("offer") || lower.includes("discount"))
      return "🎉 We have 10% off on selected fruits this week!";

    return "🤖 I'm here to help! You can type 'Add 2 apples' to add products to your cart.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, from: "user" }]);

    const response = handleBotResponse(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, from: "bot" }]);
    }, 800);

    setInput("");
  };

  return (
    <div style={styles.container}>
      {open ? (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            Chat Helper
            <FaTimes style={styles.icon} onClick={() => setOpen(false)} />
          </div>
          <div style={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.from === "user" ? "#10b981" : "#e5e5e5",
                  color: msg.from === "user" ? "#fff" : "#000",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.floatingBtn} onClick={() => setOpen(true)}>
          <FaComment />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { position: "fixed", bottom: 20, right: 20, zIndex: 9999 },
  floatingBtn: {
    backgroundColor: "#10b981",
    width: 50,
    height: 50,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  chatBox: {
    width: 320,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
  header: {
    padding: 10,
    backgroundColor: "#10b981",
    color: "#fff",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: { cursor: "pointer" },
  messages: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
  },
  message: {
    padding: "8px 12px",
    borderRadius: 20,
    maxWidth: "80%",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: { flex: 1, padding: 10, border: "none", outline: "none" },
  sendBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "0 16px",
    cursor: "pointer",
  },
};

export default ChatHelperAI;
