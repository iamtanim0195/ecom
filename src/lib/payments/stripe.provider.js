import Stripe from "stripe";
import { PaymentProvider } from "./payment.interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeProvider extends PaymentProvider {
    async createPayment({ orderId, amount, currency, email }) {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: email,

            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: `Order ${orderId}`,
                        },
                        unit_amount: Math.round(amount * 100), // cents
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                orderId,
            },

            success_url: `${process.env.NEXTAUTH_URL}/payment/success?orderId=${orderId}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?orderId=${orderId}`,
        });

        return {
            provider: "stripe",
            sessionId: session.id,
            checkoutUrl: session.url,
        };
    }

    async verifyPayment(event) {
        // Will be implemented in webhook step
        return true;
    }
}
