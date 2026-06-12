import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { fetchHanoiWeather } from '@/lib/weather';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const weatherUrl = searchParams.get('weatherUrl');
    
    // 1. Get real weather data to feed into the prompt
    // We use the English weather description internally to feed the LLM, the LLM will translate
    const weather = await fetchHanoiWeather('en', weatherUrl);

    // 2. Prepare data for other categories to feed the LLM
    const { getGoldText, getVn30Text, getBtcText } = await import('@/lib/finance');
    const goldData = await getGoldText();
    const vn30Data = await getVn30Text();
    const btcData = await getBtcText();
    const calendarData = "09:00 AM: Project development meeting. 02:00 PM: Marketing plan discussion. 07:00 PM: Online English class.";
    const socialData = "Two viral posts about tech trends and morning routines.";

    // 3. Setup Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in .env' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-3.5-flash for speed and stability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            cat_1: {
              type: SchemaType.STRING,
              description: "Morning greeting and detailed weather briefing based on the provided weather data."
            },
            cat_gold: {
              type: SchemaType.STRING,
              description: "Gold market news briefing based on the provided gold data."
            },
            cat_vn30: {
              type: SchemaType.STRING,
              description: "VN30 and crypto market news briefing based on the provided VN30 and BTC data."
            },
            cat_3: {
              type: SchemaType.STRING,
              description: "Daily schedule and calendar briefing based on the provided calendar data."
            },
            cat_facebook: {
              type: SchemaType.STRING,
              description: "Social media and news briefing based on the provided social data."
            }
          },
          required: ["cat_1", "cat_gold", "cat_vn30", "cat_3", "cat_facebook"]
        }
      }
    });

    const prompt = `You are an energetic, friendly personal assistant presenting a morning briefing.
Transform the following raw data into a natural, engaging spoken script. 
CRITICAL: You MUST write the script entirely in the language corresponding to this locale code: "${locale}" (e.g. 'vi' for Vietnamese, 'en' for English, 'jp' for Japanese, 'kr' for Korean, 'cn' for Chinese).

Raw Data:
- Weather in Hanoi: ${weather.temperature}°C, feels like ${weather.apparentTemperature}°C. Min: ${weather.tempMin}°C, Max: ${weather.tempMax}°C. Humidity: ${weather.humidity}%. Wind: ${weather.windSpeed} km/h. Condition: ${weather.description}.
- Gold: ${goldData}
- VN30 & Crypto: ${vn30Data} ${btcData}
- Calendar: ${calendarData}
- Social Media: ${socialData}

Write the response separated into the JSON fields. Make it sound like a radio host or personal assistant speaking directly to the user.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 4. Return the parsed JSON
    return NextResponse.json(JSON.parse(responseText));

  } catch (error) {
    console.error('Error generating AI briefing:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI briefing' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
