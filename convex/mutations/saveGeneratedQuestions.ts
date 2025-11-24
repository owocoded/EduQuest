import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    materialId: v.id("materials"),
    mcqs: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        answer: v.string(),
      })
    ),
    theory: v.array(v.string()),
    engine: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = "anonymous"; // For version 1, no authentication
    
    const questionId = await ctx.db.insert("questions", {
      userId,
      materialId: args.materialId,
      mcqs: args.mcqs,
      theory: args.theory,
      engine: args.engine,
      createdAt: Date.now(),
    });
    
    return questionId;
  },
});