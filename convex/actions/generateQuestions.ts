"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

const generateQuestions = action({
  args: {
    text: v.string(),
    userPrompt: v.string(),
    engine: v.union(v.literal("gemini"), v.literal("huggingface")),
  },
  handler: async (ctx, args) => {
    let result: any;

    if (args.engine === "gemini") {
      try {
        result = await ctx.runAction(api.actions.generateWithGemini.default, {
          text: args.text,
          userPrompt: args.userPrompt,
        });
      } catch (geminiError) {
        console.error('Gemini API failed:', geminiError);

        // Fallback to HuggingFace
        console.log('Falling back to HuggingFace API');
        result = await ctx.runAction(api.actions.generateWithHuggingFace.default, {
          text: args.text,
          userPrompt: args.userPrompt,
        });
      }
    } else {
      // Use HuggingFace directly
      result = await ctx.runAction(api.actions.generateWithHuggingFace.default, {
        text: args.text,
        userPrompt: args.userPrompt,
      });
    }

    return result;
  },
});

export default generateQuestions;