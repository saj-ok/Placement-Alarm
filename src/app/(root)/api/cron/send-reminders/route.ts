import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { sendEmail, sendWhatsApp } from "../../../../../../lib/notifications";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function fetchUserContact(userId: string) {
  try {
    const profile = await convex.query(api.profiles.getProfileForReminder, { userId });
    return {
      email: profile?.email || null,
      whatsapp: profile?.whatsappNumber || null,
    };
  } catch (error) {
    console.error("Error fetching user contact:", error);
    return { email: null, whatsapp: null };
  }
}

export const revalidate = 0;

export async function GET(_request: Request) {
  try {
    const now = new Date().getTime();
    // Fetch all applications due in the next 4 hours
    const upcomingApps = await convex.query(api.companies.getApplicationsForReminder) || [];

    let remindersSentCount = 0;

    for (const app of upcomingApps) {
      const { _id, name, role, deadline, remindersSent, userId } = app;

      if (!deadline) continue;

      const deadlineTime = new Date(deadline).getTime();
      const hoursUntilDeadline = (deadlineTime - now) / (1000 * 60 * 60);

      let shouldSend = false;
      // Determine if a reminder should be sent based on time and count
      if (hoursUntilDeadline <= 4 && hoursUntilDeadline > 3 && (remindersSent || 0) === 0) {
        shouldSend = true;
      } else if (hoursUntilDeadline <= 3 && hoursUntilDeadline > 2 && (remindersSent || 0) === 1) {
        shouldSend = true;
      } else if (hoursUntilDeadline <= 2 && hoursUntilDeadline > 1 && (remindersSent || 0) === 2) {
        shouldSend = true;
      } else if (hoursUntilDeadline <= 1 && (remindersSent || 0) === 3) {
        shouldSend = true;
      }

      if (shouldSend) {
        const when = new Date(deadline).toLocaleString("en-GB", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        const subject = `Reminder: ${role} at ${name} deadline approaching!`;
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

        const whatsappMessage = `🚨 *Application Deadline Reminder*\n\nHi! Your application for *${role}* at *${name}* is due on:\n\n📅 ${when}\n\nDon't forget to submit before the deadline!\n\nGood luck! 🍀\n\n_Automated reminder from Placement Alarm_`;
        
        const user = await fetchUserContact(userId);

        // Send Email
        if (user.email) {
          await sendEmail(user.email, subject, html).catch(err => console.error(`Failed to send email to ${user.email}:`, err));
        }

        // Send WhatsApp
        if (user.whatsapp) {
          await sendWhatsApp(user.whatsapp, whatsappMessage).catch(err => console.error(`Failed to send WhatsApp to ${user.whatsapp}:`, err));
        }

        // Increment reminder count in Convex
        await convex.mutation(api.companies.incrementReminderCount, { id: _id });
        remindersSentCount++;
      }
    }

    return NextResponse.json({ sent: remindersSentCount, checked: upcomingApps.length });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}