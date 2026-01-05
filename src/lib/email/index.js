import { ResendProvider } from "./resend.provider";

export function getEmailProvider() {
    const provider = process.env.EMAIL_PROVIDER;

    switch (provider) {
        case "resend":
            return new ResendProvider();

        // future:
        // case "sendgrid":
        //   return new SendGridProvider();

        default:
            throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`);
    }
}

/**
 * Generic sendEmail function used by business logic
 */
export async function sendEmail({ to, subject, html }) {
    const emailProvider = getEmailProvider();
    return emailProvider.send({ to, subject, html });
}
