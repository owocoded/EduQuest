import { action } from "./_generated/server";
import { v } from "convex/values";
import generateWithGemini from "./generateWithGemini";
import generateWithHuggingFace from "./generateWithHuggingFace";

export default action({
  args: {
    text: v.string(),
    userPrompt: v.string(),
    engine: v.union(v.literal("gemini"), v.literal("huggingface")),
  },
  handler: async (ctx, args) => {
    let result;
    
    if (args.engine === "gemini") {
      try {
        result = await ctx.runAction(generateWithGemini, {
          text: args.text,
          userPrompt: args.userPrompt,
        });
      } catch (geminiError) {
        console.error('Gemini API failed:', geminiError);
        
        // Fallback to HuggingFace
        console.log('Falling back to HuggingFace API');
        result = await ctx.runAction(generateWithHuggingFace, {
          text: args.text,
          userPrompt: args.userPrompt,
        });
      }
    } else {
      // Use HuggingFace directly
      result = await ctx.runAction(generateWithHuggingFace, {
        text: args.text,
        userPrompt: args.userPrompt,
      });
    }
    
    return result;
  },
});