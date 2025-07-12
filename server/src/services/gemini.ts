import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcribe the audio. Be precise and natural",
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error("Failed to transcribe audio");
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004",
    contents: [{ text }],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings?.[0]?.values) {
    throw new Error("Failed to generate embeddings");
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join("\n\n");

  const prompt = `
    You are a helpful assistant that can answer questions based on the context.

    CONTEXT:
    ${context}

    QUESTION:
    ${question}

    INSTRUCTIONS:
    - Be concise and to the point
    - Use the context only to answer the question
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [{ text: prompt }],
  });

  if (!response.text) {
    throw new Error("Failed to generate answer");
  }

  return response.text;
}
