import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  resumeText: z.string().min(20, "Resume text is too short"),
  jobDescription: z.string().min(20, "Job description is too short"),
});

const AnalysisSchema = z.object({
  recommendation: z.enum(["recommended", "apply_if_interested", "not_recommended"]),
  confidence: z.enum(["High", "Medium", "Low"]),
  recommendationExplanation: z.string(),
  matchScore: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  summary: z.string(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

const mockAnalysis: AnalysisResult = {
  recommendation: "recommended",
  confidence: "High",
  recommendationExplanation:
    "You satisfy most mandatory requirements and have strong product management experience.",
  matchScore: 82,
  matchingSkills: [
    "Product Management",
    "Agile",
    "Roadmapping",
    "AI Products",
    "Stakeholder Management",
  ],
  missingSkills: ["SQL", "Tableau", "A/B Testing"],
  improvementSuggestions: [
    "Add measurable metrics.",
    "Highlight SQL exposure.",
    "Quantify product impact.",
  ],
  summary:
    "Your profile aligns well with this Product Manager role. The primary gaps are technical skills like SQL and experimentation. Overall, this role is worth applying for.",
};

export const analyzeMatch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async (): Promise<AnalysisResult> => {
    // Mock analysis for demonstration. Replace with real AI analysis later.
    return mockAnalysis;
  });
