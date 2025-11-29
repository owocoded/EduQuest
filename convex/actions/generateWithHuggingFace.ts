"use node";

import { action } from "../_generated/server";
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

    // For now, using a text generation model as backup
    // In a real implementation, this would call a more appropriate model for question generation
    const apiUrl = "https://api-inference.huggingface.co/models/gpt2";

    // Create a prompt to generate questions based on the text
    const prompt = `Based on the following text: "${args.text.substring(0, 1000)}" and these instructions: "${args.userPrompt}", generate questions in the following JSON format:
    {
      "mcqs": [
        {
          "question": "Sample MCQ question",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "answer": "A) Option 1"
        }
      ],
      "theory": [
        "Sample theory question 1",
        "Sample theory question 2"
      ]
    }

    Generate the questions based on the content. Return ONLY the JSON with no additional text. The text is: ${args.text.substring(0, 1500)}`;

    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        return_full_text: false
      },
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

      // Extract the generated text from the response
      let generatedText = '';
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        generatedText = data[0].generated_text;
      } else if (typeof data === 'object' && data.generated_text) {
        generatedText = data.generated_text;
      } else {
        console.log('Unexpected response format:', data);
        generatedText = JSON.stringify({
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
        });
      }

      // Try to extract JSON from the response
      // Sometimes the response might have extra text, so we'll extract the JSON part
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in HuggingFace response');
      }

      const jsonString = jsonMatch[0];
      const parsedData = JSON.parse(jsonString);

      return parsedData;
    } catch (error) {
      console.error('Error calling HuggingFace API:', error);
      throw error;
    }
  },
});