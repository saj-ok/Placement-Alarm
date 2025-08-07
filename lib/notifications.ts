
import nodemailer from "nodemailer";
import Twilio from "twilio";

// --- Nodemailer setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"Placement-Alarm" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}


// --- Twilio WhatsApp setup ---

const TWILIO_SID = process.env.TWILIO_SID!;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN!;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM!;


const twilioClient = Twilio(TWILIO_SID, TWILIO_TOKEN);
export async function sendWhatsApp(to: string, body: string) {
  const message = await twilioClient.messages.create({
    from: WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  });

  console.log(message.body);
}
