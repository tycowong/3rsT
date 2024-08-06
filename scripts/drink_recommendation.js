import { GoogleGenerativeAI } from "@google/generative-ai";

export var drinkRecommendation = {};
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

export async function getRecommendation(songName, artist) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
      },
    ],
  });
  const prompt = `Please only tell me the name of an known alcoholic cocktail and ingridients for the cocktail that would pair with the song ${songName} from the artist ${artist} in JSON format with the following schema {'name': str, 'ingredients':[{name: str, measurement: str}]} include measurements in the ingredeints`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  drinkRecommendation = JSON.parse(response.text());
  console.log(drinkRecommendation["name"]);
}
