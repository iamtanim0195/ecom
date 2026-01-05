import { StripeProvider } from "./stripe.provider";

export function getPaymentProvider() {
    const provider = process.env.PAYMENT_PROVIDER;

    switch (provider) {
        case "stripe":
            return new StripeProvider();

        // future:
        // case "paypal":
        //   return new PaypalProvider();

        default:
            throw new Error(`Unsupported payment provider: ${provider}`);
    }
}
