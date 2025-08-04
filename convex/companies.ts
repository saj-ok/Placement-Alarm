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
            userId: v.id("users"),
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
                        notes: args.notes,
                  });
      },
})