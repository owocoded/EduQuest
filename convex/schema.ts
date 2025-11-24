import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  materials: defineTable({
    userId: v.string(),
    fileName: v.string(),
    originalId: v.id("_storage"),
    extractedText: v.string(),
    createdAt: v.number(),
  }),
  questions: defineTable({
    userId: v.string(),
    materialId: v.id("materials"),
    mcqs: v.array(v.object({
      question: v.string(),
      options: v.array(v.string()),
      answer: v.string(),
    })),
    theory: v.array(v.string()),
    engine: v.string(),
    createdAt: v.number(),
  }),
});