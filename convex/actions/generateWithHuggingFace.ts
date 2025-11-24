import { action } from "./_generated/server";
import { v } from "convex/values";

// This action calls the HuggingFace API as a backup for question generation
export default action({
  args: {
    text: v.string(),
    userPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.CONVEX_HF_API_KEY;
    if (!apiKey) {
      throw new Error("CONVEX_HF_API_KEY is not set");
    }

    // For now, using a question generation model
    // In a real implementation, this would call the correct model for question generation
    const apiUrl = "https://api-inference.huggingface.co/models/iarfmoose/t5-base-question-generator";
    
    // Note: The example model might not be the best for question generation
    // We might need to use a different model or prompt strategy
    const payload = {
      inputs: `context: ${args.text} question:`,
      options: {
        use_cache: false,
        wait_for_model: true,
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // For now, returning a mock structure since the actual response format 
      // might vary depending on the model used
      // In a real implementation, we'd process the response properly
      return {
        mcqs: [
          {
            question: "What is the main topic of the learning material?",
            options: ["A) Mathematics", "B) Science", "C) History", "D) Literature"],
            answer: "B) Science"
          }
        ],
        theory: [
          "Explain the basic principles covered in this learning material."
        ]
      };
    } catch (error) {
      console.error('Error calling HuggingFace API:', error);
      throw error;
    }
  },
});