"use server";

import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { getUser } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

export const createDiaryAction = async (diaryId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to create a diary.");
    const diary = await prisma.diary.create({
      data: {
        id: diaryId,
        authorId: user.id,
        title: "",
        text: "",
      },
    });

    return { errorMessage: null, diary };
  } catch (error) {
    const { errorMessage } = handleError(error);
    return { errorMessage, diary: null };
  }
};

type DiaryUpdateData = Partial<{
  text: string;
  title: string;
}>;

export const updateDiaryAction = async (
  diaryId: string,
  data: DiaryUpdateData,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to update a diary.");
    if (!data || Object.keys(data).length === 0) {
      return { errorMessage: null };
    }

    await prisma.diary.update({
      where: { id: diaryId, authorId: user.id },
      data,
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteDiaryAction = async (diaryId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must log in to delete a diary.");

    await prisma.diary.delete({
      where: { id: diaryId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

type AskAIResponse = {
  answer: string;
  errorMessage: string | null;
};

// Helper to sanitize/handle errors
const handleAIError = (error: unknown): AskAIResponse => {
  console.error("AI Error:", error);
  return {
    answer: "",
    errorMessage: "Something went wrong while contacting the AI.",
  };
};

export const askAIAboutDiariesAction = async (
  questions: string[], // Full history of user questions
  responses: string[], // Full history of AI responses (should be length of questions - 1)
): Promise<AskAIResponse> => {
  try {
    // 1. Authenticate
    const user = await getUser();
    if (!user) throw new Error("You must log in to ask AI questions.");

    // 2. Fetch User Data
    const diariesRaw = await prisma.diary.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { title: true, text: true, createdAt: true, updatedAt: true },
    });

    const diaries = diariesRaw.reverse();

    if (diaries.length === 0) {
      return {
        answer: "You don't have any diary entries yet.",
        errorMessage: null,
      };
    }

    // 3. Format Context (The Diaries)
    const formattedDiaries = diaries
      .map((diary) =>
        `
        Created: ${diary.createdAt.toDateString()}
        Updated: ${diary.updatedAt.toDateString()}
        Title: ${diary.title || "(Untitled)"}
        Content: ${diary.text}
        `.trim(),
      )
      .join("\n---\n");

    // 4. Construct System Instruction
    const systemInstruction = `
    You are an empathetic and insightful AI assistant for a personal diary application called "Ask AI About Your Diaries."
    
    YOUR GOAL:
    Provide tailored summaries, psychological insights, and reflection prompts based strictly on the user's provided diary entries.

    GUIDELINES:
    1. Source Material: Assume all user questions refer to the diary entries provided below. If the answer isn't in the diaries, gently state that you don't have that information.
    2. Tone: Be warm, supportive, and objective. Avoid being overly flowery or robotic. Speak succinctly but with depth.
    3. Formatting: Your responses MUST be returned as raw, clean, valid HTML fragments suitable for rendering in a React component. 
      - Use semantic tags: <p>, <ul>, <ol>, <li>, <strong>, <em>, <h3>, <h4>.
      - Do NOT use Markdown (no #, **, etc.).
      - Do NOT use <html>, <head>, or <body> tags.
      - Do NOT wrap the entire result in a container div or single p tag unless it is a one-sentence answer.
      - Do NOT use inline styles or classes.
      - Technical Context: Rendered like this in JSX: <div dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

    SPECIFIC TASK BEHAVIORS:
    - If asked for a SUMMARY: Provide a concise bulleted list or a short paragraph highlighting key events and emotions.
    - If asked for INSIGHTS: Connect patterns in behavior or mood across different entries.
    - If asked for PROMPTS: Generate thoughtful, open-ended questions to help the user reflect on the specific topics discussed.
    
    Here are the user's diary entries:
    ${formattedDiaries}
    `;

    // 5. Build Chat History for Gemini
    // We zip the past questions and responses together
    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    // Iterate up to the second-to-last question (the last one is the NEW one we need to answer)
    for (let i = 0; i < questions.length - 1; i++) {
      if (questions[i]) {
        history.push({ role: "user", parts: [{ text: questions[i] }] });
      }
      if (responses[i]) {
        history.push({ role: "model", parts: [{ text: responses[i] }] });
      }
    }

    // 6. Initialize GoogleGenAI Client
    // Using the new @google/genai SDK pattern
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    // 7. Send the LATEST question
    const currentQuestion = questions[questions.length - 1];
    if (!currentQuestion) throw new Error("No question provided.");

    const result = await chat.sendMessage({
      message: currentQuestion,
    });

    const answer = result.text || "I couldn't generate a response.";

    return { answer, errorMessage: null };
  } catch (error) {
    return handleAIError(error);
  }
};