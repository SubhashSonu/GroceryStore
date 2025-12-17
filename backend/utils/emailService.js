import nodemailer from "nodemailer";

export const sendOrderEmail = async (email, orderId, status, items, total) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   
    const productRows = items
      .map(
        (item) => `
          <tr>
            <td style="padding:6px;border:1px solid #ddd;">${item.name}</td>
            <td style="padding:6px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:6px;border:1px solid #ddd;">₹${item.price.toFixed(
              2
            )}</td>
            <td style="padding:6px;border:1px solid #ddd;">₹${(
              item.price * item.quantity
            ).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const emailHTML = `
      <div style="font-family:Arial;padding:15px;border:1px solid #e6e6e6;border-radius:10px;">
        <h2 style="color:#0D7C66;text-align:center;">Grocery Store</h2>
        <h3 style="color:#0D7C66;">Order Update</h3>

        <p>Your order <b>${orderId}</b> status is now:</p>
        <h3 style="color:#F57C00;text-transform:capitalize;">${status}</h3>

        <h4>Order Details:</h4>
        <table style="border-collapse:collapse;width:100%;margin-top:10px;">
          <thead>
            <tr style="background:#0D7C66;color:white;">
              <th style="padding:6px;border:1px solid #ddd;">Product</th>
              <th style="padding:6px;border:1px solid #ddd;">Qty</th>
              <th style="padding:6px;border:1px solid #ddd;">Price</th>
              <th style="padding:6px;border:1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <p style="margin-top:12px;font-size:16px;">
          <b>Order Total: ₹${total.toFixed(2)}</b>
        </p>

        <p style="margin-top:15px;">
          Thank you for shopping with GroceryStore 🛒<br>
          Stay fresh, eat healthy! 🥬
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Fresh Grocery Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Update - ${status}`,
      html: emailHTML,
    });

    console.log("Email sent to:", email);
  } catch (err) {
    console.log("Email error:", err.message);
  }
};
