/**
 * Generic Email Provider Interface
 * Any email provider must implement send()
 */
export class EmailProvider {
    async send({ to, subject, html }) {
        throw new Error("send() not implemented");
    }
}
