import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user profile
export const upsertProfile = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    whatsappNumber: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingProfile) {
      // Update existing profile
      return await ctx.db.patch(existingProfile._id, {
        name: args.name,
        email: args.email,
        whatsappNumber: args.whatsappNumber,
        profileImage: args.profileImage,
      });
    } else {
      // Create new profile
      return await ctx.db.insert("profiles", args);
    }
  },
});

// Get user profile
export const getUserProfile = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("profiles")
      .withIndex("by_user_id")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

// Update WhatsApp number specifically
export const updateWhatsAppNumber = mutation({
  args: {
    userId: v.string(),
    whatsappNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    return await ctx.db.patch(profile._id, {
      whatsappNumber: args.whatsappNumber,
    });
  },
});

// Get profile by user ID for reminder system
export const getProfileForReminder = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user_id")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();
  },
});