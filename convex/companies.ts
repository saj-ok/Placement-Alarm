import { v } from "convex/values"
import { mutation, query } from "./_generated/server"


export const addCompany = mutation({
      args: {
            name: v.string(),
            role: v.string(),
            package: v.string(),
            driveType: v.string(),
            deadline: v.optional(v.string()),
            type: v.string(),
            link: v.optional(v.string()),
            status: v.optional(v.string()),
      },
      handler: async (ctx, args) => {
            const Identify = await ctx.auth.getUserIdentity();
            if (!Identify) {
                  throw new Error("Unauthorized");
            }
            const user = ctx.db
                  .query("users")
                  .withIndex("by_user_id")
                  .filter(q => q.eq(q.field("userId"), Identify.subject))
                  .first();
            if (!user) {
                  throw new Error("User not found");
            }
            return await ctx.db.insert("companies", {
                  ...args,
                  userId: Identify.subject,
                  remindersSent: 0,
                  lastReminderAt: "",
            })
      }
})

export const deleteCompany = mutation({
      args: {
            companyId: v.id("companies"),
      },
      handler: async (ctx, args) => {
            const Identify = await ctx.auth.getUserIdentity();
            if (!Identify) {
                  throw new Error("Unauthorized");
            }
            const user = ctx.db
                  .query("users")
                  .withIndex("by_user_id")
                  .filter(q => q.eq(q.field("userId"), Identify.subject))
                  .first();
            if (!user) {
                  throw new Error("User not found");
            }
            return await ctx.db.delete(args.companyId);
      }
})

export const getAllCompanies = query({
      args: {
            userId: v.string(),
      },
      handler: async (ctx, args) => {
            const Identify = await ctx.auth.getUserIdentity();
            if (!Identify) {
                  throw new Error("Unauthorized");
            }
            const user = ctx.db
                  .query("users")
                  .withIndex("by_user_id")
                  .filter(q => q.eq(q.field("userId"), Identify.subject))
                  .first();
            if (!user) {
                  throw new Error("User not found");
            }
            return await ctx.db
                  .query("companies")
                  .withIndex("by_user_id")
                  .filter(q => q.eq(q.field("userId"), args.userId))
                  .collect();
      },
}) 

export const updateCompanyDetails = mutation({
      args:{
            companyId: v.id("companies"),
            status: v.optional(v.string()),
            statusDateTime: v.optional(v.string()),
            notes: v.optional(v.string()),
      },
      handler: async (ctx, args) => {
            const Identify = await ctx.auth.getUserIdentity();
            if (!Identify) {
                  throw new Error("Unauthorized");
            }
            const user = ctx.db
                  .query("users")
                  .withIndex("by_user_id")
                  .filter(q => q.eq(q.field("userId"), Identify.subject))
                  .first();
            if (!user) {
                  throw new Error("User not found");
            }
            return await ctx.db
                  .patch(args.companyId, {
                        status: args.status,
                        statusDateTime: args.statusDateTime,
                        notes: args.notes,
                  });
      },
})


export const getApplicationsForReminder = query({
  handler: async ({ db }) => {
    const now = new Date();
    // thresholds: 4h, 3h, 2h before deadline
    const thresholds = [4, 3, 2].map(h =>
      new Date(now.getTime() + h * 60 * 60 * 1000)
    );

    let apps: any[] = [];
    for (let i = 0; i < thresholds.length; i++) {
      const lower = thresholds[i];
      const upper = new Date(lower.getTime() + 5 * 60 * 1000); // 5-minute window

      const results = await db
        .query("companies")
        .withIndex("by_deadline")
        .filter(q =>
          q.and(
            q.eq(q.field("status"), "Not Applied"),
            q.eq(q.field("remindersSent"), i),
            q.neq(q.field("deadline"), undefined), // Ensure deadline exists
            q.lt(q.field("deadline"), upper.toISOString()),
            q.gt(q.field("deadline"), lower.toISOString())
          )
        )
        .collect();

      apps = apps.concat(results);
    }

    return apps;
  },
});


export const incrementReminderCount = mutation({
  args: { 
      id: v.id("companies")
 },
  handler: async ( ctx, args ) => {
    // First get the current company data
    const company = await ctx.db.get(args.id);
    if (!company) {
      throw new Error("Company not found");
    }
    
    // Then patch with the incremented value
    await ctx.db.patch(args.id, {
      remindersSent: (company.remindersSent || 0) + 1,
      lastReminderAt: new Date().toISOString(),
    });
  },
});