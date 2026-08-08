import nodemailer from "nodemailer";

export type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
};

const OWNER_EMAIL = "princekatariyaprince@gmail.com";

function createTransport() {
  const user = process.env.EMAIL_USER ?? OWNER_EMAIL;
  const password = process.env.EMAIL_APP_PASSWORD;
  if (!password) {
    throw new Error("EMAIL_APP_PASSWORD is not configured");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass: password,
    },
  });
}

/**
 * Sends a contact form submission as an email into the owner's Gmail inbox.
 * Returns true when the message was accepted by Gmail's SMTP server.
 */
export async function sendContactEmail(
  input: ContactEmailInput
): Promise<boolean> {
  const transporter = createTransport();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER ?? OWNER_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: `New contact form submission from ${input.name}`,
    text: [
      "You received a new message from your portfolio website.\n",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      "Date: " + new Date().toString(),
      "\nMessage:\n",
      input.message,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="margin:0 0 16px;color:#111827;">New message from your portfolio</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p style="margin:0 0 16px;color:#6b7280;"><strong>Date:</strong> ${new Date().toString()}</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;white-space:pre-wrap;">${escapeHtml(input.message)}</div>
      </div>`,
  });

  return true;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
