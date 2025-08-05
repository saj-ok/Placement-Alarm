

import type { NextApiRequest, NextApiResponse } from "next";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { sendEmail, sendWhatsApp } from "@/lib/notifications";


// Updated to fetch user contact information from profile
async function fetchUserContact(userId: string) {
  try {
    const profile = await fetchQuery(api.profiles.getProfileForReminder, { userId });
    return {
      email: profile?.email || null,
      whatsapp: profile?.whatsappNumber || null,
    };
  } catch (error) {
    console.error("Error fetching user contact:", error);
    return { email: null, whatsapp: null };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apps = await fetchQuery(api.companies.getApplicationsForReminder);

    await Promise.all(
      apps.map(async (app) => {
        const { _id, name, role, deadline, remindersSent, userId } = app;
        const when = new Date(deadline).toLocaleString("en-GB", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        const subject = `Reminder #${(remindersSent || 0) + 1}: ${role} at ${name}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Application Deadline Reminder</h2>
            <p>Hi there!</p>
            <p>This is a friendly reminder that your application for <strong>${role}</strong> at <strong>${name}</strong> is due on:</p>
            <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1F2937;">${when}</p>
            </div>
            <p>Don't forget to submit your application before the deadline!</p>
            <p>Best of luck with your application!</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
            <p style="font-size: 12px; color: #6B7280;">This is an automated reminder from Placement Alarm.</p>
          </div>
        `;

        const user = await fetchUserContact(userId);
        
        // Send email if user has email
        if (user.email) {
          try {
            await sendEmail(user.email, subject, html);
            console.log(`Email sent to ${user.email} for ${name}`);
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          }
        }
        
        // Send WhatsApp if user has WhatsApp number
        if (user.whatsapp) {
          try {
            // Create WhatsApp-friendly message
            const whatsappMessage = `🚨 *Application Deadline Reminder*\n\nHi! Your application for *${role}* at *${name}* is due on:\n\n📅 ${when}\n\nDon't forget to submit before the deadline!\n\nGood luck! 🍀\n\n_Automated reminder from Placement Alarm_`;
            await sendWhatsApp(user.whatsapp, whatsappMessage);
            console.log(`WhatsApp sent to ${user.whatsapp} for ${name}`);
          } catch (error) {
            console.error(`Failed to send WhatsApp to ${user.whatsapp}:`, error);
          }
        }

        // Increment reminder count
        await fetchMutation(api.companies.incrementReminderCount, { id: _id });
      })
    );

    res.status(200).json({ sent: apps.length });
  } catch (e) {
    console.error("Error sending reminders:", e);
    res.status(500).json({ error: "Internal Error" });
  }
}
