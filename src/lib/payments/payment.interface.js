/**
 * This file defines the PAYMENT CONTRACT.
 * Every payment provider MUST implement these methods.
 */

export class PaymentProvider {
    /**
     * Create a payment session / intent
     * @param {Object} options
     * @param {string} options.orderId
     * @param {number} options.amount
     * @param {string} options.currency
     * @param {string} options.email
     */
    async createPayment(options) {
        throw new Error("createPayment() not implemented");
    }

    /**
     * Verify payment (webhook or redirect)
     */
    async verifyPayment(payload) {
        throw new Error("verifyPayment() not implemented");
    }
}
