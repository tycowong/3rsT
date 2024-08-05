import { GoogleGenerativeAI } from "@google/generative-ai";

export var drinkRecommendation = {};
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

export async function getRecommendation(songName, artist) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });
  const prompt = `Please only tell me the name of an known alcoholic cocktail and ingridients for the cocktail that would pair with the song ${songName} from the artist ${artist} in JSON format that can be parsed by JSON.parse() in java script`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  drinkRecommendation = JSON.parse(response.text());
  console.log(drinkRecommendation["name"]);
}
