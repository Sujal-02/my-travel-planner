// app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod'; // Using Zod for robust input validation

// Define the expected structure of the request body for validation
const ItineraryRequestSchema = z.object({
  city: z.string().min(1, 'City cannot be empty.'),
  budget: z.string().min(1, 'Budget cannot be empty.'),
  days: z.number().int().min(1, 'Days must be at least 1.').max(14, 'Days cannot exceed 14.'),
});

// Initialize the Gemini AI client
// The API key is securely accessed from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // 1. PARSE AND VALIDATE THE eingehenden REQUEST BODY
    const body = await req.json();
    const parsedBody = ItineraryRequestSchema.safeParse(body);

    // If validation fails, return a 400 error with details
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid input.', details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }
    const { city, budget, days } = parsedBody.data;

    // 2. CONFIGURE THE GEMINI MODEL
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 3. CONSTRUCT THE DETAILED PROMPT FOR THE AI
    // This prompt instructs the AI to return a clean JSON object with a specific structure.
    const prompt = `
      Create a day-by-day travel itinerary for a trip to ${city} for ${days} days with a total budget of ${budget}.

      Your task is to generate a single, valid JSON object containing the complete itinerary.

      **JSON Structure Requirements:**
      The root object must contain the following keys: "city", "budget", "total_days", and "itinerary".
      - "itinerary" must be an array of day objects.
      - Each day object in the array must contain:
        - "day": (Integer) The day number.
        - "title": (String) A short, thematic title for the day.
        - "summary": (String) A 1-2 sentence summary of the day's plan.
        - "attractions": (Array of Strings) A list of 5-7 attractions or activities.
        - "dining": (Array of Objects) A list of 2-3 dining suggestions.
          - Each dining object must contain:
            - "name": (String) The name of the restaurant.
            - "meal": (String) The suggested meal (e.g., "Breakfast", "Lunch", "Dinner").
            - "estimated_cost_usd": (String) The estimated cost per person in USD (e.g., "$10-15").

      **IMPORTANT RULES:**
      - Ensure all locations and restaurants are real and located in ${city}.
      - The final output MUST be only the raw JSON object, with no additional text, explanations, or markdown formatting like \`\`\`json.
    `;

    // 4. CALL THE GEMINI API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 5. CLEAN AND PARSE THE AI's RESPONSE
    // The AI might occasionally wrap the JSON in markdown backticks, so we remove them.
    text = text.replace(/^```json\s*|\s*```$/g, '').trim();

    try {
      const jsonData = JSON.parse(text);
      // Success! Return the structured JSON data to the frontend.
      return NextResponse.json(jsonData);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      console.error('--- Raw Text from Gemini ---');
      console.error(text);
      console.error('-----------------------------');
      // If parsing fails, it means the AI didn't return valid JSON.
      return NextResponse.json(
        { error: 'The AI returned an invalid response format. Please try again.' },
        { status: 502 } // Bad Gateway - indicates an issue with an upstream server (the AI)
      );
    }

  } catch (error) {
    console.error('API Route Error:', error);
    // General error handler for any other issues.
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}