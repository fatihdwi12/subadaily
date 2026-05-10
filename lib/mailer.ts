import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"Suba Daily Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `📬 Pesan Baru dari ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #111; margin-bottom: 4px;">Pesan Baru Masuk</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">dari website Suba Daily</p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

        <table style="width: 100%; font-size: 14px; color: #333;">
          <tr>
            <td style="padding: 6px 0; color: #888; width: 80px;">Nama</td>
            <td style="padding: 6px 0; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #888;">Email</td>
            <td style="padding: 6px 0;">
              <a href="mailto:${email}" style="color: #0070f3;">${email}</a>
            </td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

        <p style="font-size: 13px; color: #888; margin-bottom: 8px;">Pesan:</p>
        <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; font-size: 14px; color: #333; white-space: pre-wrap;">${message}</div>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />

        <a href="mailto:${email}?subject=Re: Pesan dari Suba Daily"
          style="display: inline-block; background: #111; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">
          Balas Email
        </a>

        <p style="margin-top: 20px; font-size: 11px; color: #aaa;">
          Email ini dikirim otomatis dari website Suba Daily.
        </p>
      </div>
    `,
  });
}
