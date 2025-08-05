

import type { NextApiRequest, NextApiResponse } from "next";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { sendEmail, sendWhatsApp } from "@/lib/notifications";


// Replace with your actual user-contact lookup
async function fetchUserContact(userId: string) {
  return { email: "boktiaroff01@example.com", whatsapp: "+919678322996" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apps = await fetchQuery(api.companies.getApplicationsForReminder);

    await Promise.all(
      apps.map(async (app) => {
        const { id, companyName, role, deadline, remindersSent, userId } = app;
        const when = new Date(deadline).toLocaleString("en-GB", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        const subject = `Reminder #${remindersSent + 1}: ${role} at ${companyName}`;
        const html = `<p>Your application for <strong>${role}</strong> at <strong>${companyName}</strong> is due on <em>${when}</em>.</p>`;

        const user = await fetchUserContact(userId);
        if (user.email) {
          await sendEmail(user.email, subject, html);
        }
        if (user.whatsapp) {
          // strip tags for WhatsApp
          const text = html.replace(/<[^>]+>/g, "");
          await sendWhatsApp(user.whatsapp, text);
        }

        await fetchMutation(api.companies.incrementReminderCount, { id });
      })
    );

    res.status(200).json({ sent: apps.length });
  } catch (e) {
    console.error("Error sending reminders:", e);
    res.status(500).json({ error: "Internal Error" });
  }
}
