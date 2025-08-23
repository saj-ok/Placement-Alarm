import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeResume = action({
  args: {
    resumeText: v.string(),
    jobDescriptionText: v.string(),
  },
  handler: async (ctx, { resumeText, jobDescriptionText }) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

    const prompt = `
      You are an expert career coach and senior technical recruiter at a top FAANG company with over 20 years of experience.
      Your task is to conduct a rigorous, in-depth, and professional analysis of a resume against a specific job description. Your feedback should be critical, actionable, and tailored.

      The output MUST be a single, valid JSON object with no markdown formatting.

      The JSON structure must be as follows:
      {
        "overall_score": number, // A holistic score from 0 to 100 representing the overall match. Base this on a weighted average of the categorical scores.
        "summary": string, // A concise, professional summary of the resume's fit for the role, starting with a powerful opening statement. Be specific about strengths and weaknesses.
        "first_impression": string, // A brief, candid first impression as if a recruiter is skimming the resume for 15 seconds. Mention what stands out, for better or worse.
        "ats_compatibility": {
          "score": number, // Score from 0-100 for Applicant Tracking System (ATS) compatibility, focusing on parsing and keyword matching.
          "suggestions": string[] // Actionable suggestions to improve ATS compatibility.
        },
        "categorical_scores": [
          { "category": "Keyword Alignment", "score": number, "explanation": string },
          { "category": "Experience Relevance", "score": number, "explanation": string },
          { "category": "Impact & Quantifiable Results", "score": number, "explanation": string },
          { "category": "Clarity & Formatting", "score": number, "explanation": string }
        ],
        "missing_keywords": string[], // A list of crucial keywords from the job description that are missing in the resume. Be specific.
        "actionable_suggestions": [
          {
            "area": string, // e.g., "Skills Section", "Project Experience", "Work History - [Job Title]"
            "suggestion": string, // A clear, actionable suggestion for what to change or add.
            "example": {
              "before": string, // A short snippet of the original text from the resume. (Can be empty if adding new content)
              "after": string // A concrete example of the improved text.
            }
          }
        ]
      }

      Critically analyze the following resume and job description. Do not provide generic feedback. Be specific and demanding in your evaluation.

      --- RESUME ---
      ${resumeText}
      ---

      --- JOB DESCRIPTION ---
      ${jobDescriptionText}
      ---

      Now, provide the complete analysis in the specified JSON format.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonResponse = response.text();
      return JSON.parse(jsonResponse);
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw new Error("Failed to get analysis from Gemini API.");
    }
  },
});

export const saveAnalysis = mutation({
    args: {
        jobDescription: v.string(),
        resumeText: v.string(),
        analysis: v.any(),
        overallScore: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        await ctx.db.insert("analyses", {
            userId: identity.subject,
            ...args,
        });
    },
});

export const getAnalysisHistory = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        return await ctx.db
            .query("analyses")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .take(10); // Get the 10 most recent analyses
    },
});

export const getAnalysisById = query({
    args: { id: v.id("analyses") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const analysis = await ctx.db.get(args.id);

        if (analysis?.userId !== identity.subject) {
            return null;
        }

        return analysis;
    },
});

export const generateResume = action({
  args: {
    resumeText: v.string(),
    suggestions: v.any(), // Pass the suggestions from the analysis
  },
  handler: async (_, { resumeText, suggestions }) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a professional resume writer.
      Your task is to rewrite the "Original Resume" by applying the "Improvement Suggestions".
      The output must be only the full, revised resume text. Do not include any commentary, explanations, or markdown formatting.
      Maintain a professional tone and structure. Ensure the final output is clean and ready to be copied into a document.

      --- Improvement Suggestions ---
      ${JSON.stringify(suggestions, null, 2)}
      ---

      --- Original Resume ---
      ${resumeText}
      ---

      Now, provide the full, rewritten resume text below:
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating resume with Gemini:", error);
      throw new Error("Failed to generate resume from Gemini API.");
    }
  },
});