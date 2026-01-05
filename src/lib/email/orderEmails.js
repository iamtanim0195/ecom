import { sendEmail } from "@/lib/email";

export async function sendOrderConfirmedEmail(order, userEmail) {
    return sendEmail({
        to: userEmail,
        subject: "✅ Order Confirmed",
        html: `
      <h2>Thank you for your order!</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Total:</b> ${order.currency.toUpperCase()} ${order.subtotal}</p>
    `,
    });
}

export async function sendOrderShippedEmail(order, userEmail) {
    return sendEmail({
        to: userEmail,
        subject: "📦 Your Order Has Been Shipped",
        html: `
      <h2>Your order is on the way!</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Status:</b> ${order.status}</p>
    `,
    });
}

export async function sendOrderDeliveredEmail(order, userEmail) {
    return sendEmail({
        to: userEmail,
        subject: "🎉 Order Delivered",
        html: `
      <h2>Your order has been delivered</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p>Thank you for shopping with us ❤️</p>
    `,
    });
}
