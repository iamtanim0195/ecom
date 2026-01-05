import { Resend } from "resend";
import { EmailProvider } from "./email.interface";

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendProvider extends EmailProvider {
    async send({ to, subject, html }) {
        return resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
    }
}
