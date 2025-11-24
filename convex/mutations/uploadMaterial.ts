import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    fileName: v.string(),
    originalId: v.id("_storage"),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = "anonymous"; // For version 1, no authentication
    
    const materialId = await ctx.db.insert("materials", {
      userId,
      fileName: args.fileName,
      originalId: args.originalId,
      extractedText: args.extractedText,
      createdAt: Date.now(),
    });
    
    return materialId;
  },
});