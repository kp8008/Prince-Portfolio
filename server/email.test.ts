import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP credentials validation", () => {
  it("authenticates with Gmail SMTP using the provided App Password", async () => {
    const user = process.env.EMAIL_USER ?? "princekatariyaprince@gmail.com";
    const password = process.env.EMAIL_APP_PASSWORD;
    expect(password, "EMAIL_APP_PASSWORD must be provided").toBeTruthy();
    expect(
      (password as string).replace(/\s/g, "").length,
      "Gmail App Passwords are 16 characters"
    ).toBe(16);

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: password },
    });

    const verified = await transport.verify();
    expect(verified).toBe(true);
  }, 30000);
});
