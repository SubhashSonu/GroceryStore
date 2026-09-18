import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (email, orderId, status, items, total) => {
  try {
    const productRows = items
      .map(
        (item) => `
          <tr>
            <td style="padding:6px;border:1px solid #ddd;">${item.name}</td>
            <td style="padding:6px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:6px;border:1px solid #ddd;">₹${item.price.toFixed(
              2,
            )}</td>
            <td style="padding:6px;border:1px solid #ddd;">₹${(
              item.price * item.quantity
            ).toFixed(2)}</td>
          </tr>
        `,
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

export const sendOrderConfirmationEmail = async (order) => {
  try {
    await transporter.sendMail({
      from: `"Fresh Grocery Store" <${process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: "🎉 Order Confirmation",
      text: `
Hello ${order.customer.name},

Thank you for your order!

Order ID: ${order.orderId}

We have received your order and will notify you once it is packed.

Thanks,
Fresh Grocery Store
`,
    });

    console.log(`✅ Order confirmation email sent to ${order.customer.email}`);
  } catch (error) {
    console.error("Order Confirmation Email Error:", error);
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"Fresh Grocery Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🎉 Welcome to Fresh Grocery Store",
      text: `
Hello ${user.name},

Welcome to Fresh Grocery Store!

Your account has been created successfully.

We're excited to have you with us.

Happy Shopping!

Fresh Grocery Store Team
`,
    });
  } catch (error) {
    console.error("Welcome Email Error:", error);
  }
};

export const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Fresh Grocery Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP",
      text: `
Hello,

We received a request to reset your password.

Your OTP is:

${otp}

This OTP is valid for 5 minutes.

If you didn't request this password reset, you can safely ignore this email.

Fresh Grocery Store Team
`,
    });
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("OTP Email Error:", error);
  }
};
