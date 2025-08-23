import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeResume = action({
  args: {
    resumeText: v.string(),
    jobDescriptionText: v.string(),
  },
  handler: async (_, { resumeText, jobDescriptionText }) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
      });

    const prompt = `
      You are an expert career coach and professional resume reviewer for a top tech company.
      Your task is to conduct an in-depth analysis of a resume against a specific job description.

      The output MUST be a single, valid JSON object with no markdown formatting (no \`\`\`json wrappers).

      The JSON structure must be as follows:
      {
        "overall_score": number, // A holistic score from 0 to 100 representing the overall match.
        "categorical_scores": [
          { "category": "Keyword Alignment", "score": number, "explanation": string },
          { "category": "Experience Relevance", "score": number, "explanation": string },
          { "category": "Clarity & Formatting", "score": number, "explanation": string },
          { "category": "Impact & Quantifiable Results", "score": number, "explanation": string }
        ],
        "summary": string, // A concise, professional summary of the resume's fit for the role.
        "missing_keywords": string[], // A list of crucial keywords from the job description that are missing in the resume.
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

      Analyze the following resume and job description:

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
      let jsonResponse = response.text();
      
      // Clean the response by removing potential markdown backticks
      if (jsonResponse.startsWith("```json")) {
        jsonResponse = jsonResponse.substring(7, jsonResponse.length - 3).trim();
      } else if (jsonResponse.startsWith("```")) {
         jsonResponse = jsonResponse.substring(3, jsonResponse.length - 3).trim();
      }
      
      return JSON.parse(jsonResponse);

    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw new Error("Failed to get analysis from Gemini API.");
    }
  },
});