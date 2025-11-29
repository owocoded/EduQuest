"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

// This action calls the Gemini API to generate questions
export default action({
  args: {
    text: v.string(),
    userPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.CONVEX_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("CONVEX_GEMINI_API_KEY is not set");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Construct the prompt for question generation
    const prompt = `Based on the following text: "${args.text}" and these instructions: "${args.userPrompt}", generate questions in the following JSON format:
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

    Generate the questions based on the content. Return ONLY the JSON with no additional text.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Extract the generated content from the Gemini response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No generated content from Gemini');
      }

      // Try to extract JSON from the response
      // Sometimes the response might have extra text, so we'll extract the JSON part
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in Gemini response');
      }

      const jsonString = jsonMatch[0];
      const parsedData = JSON.parse(jsonString);

      return parsedData;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  },
});