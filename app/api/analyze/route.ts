import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnalysisResponse = {
  description: string;
  summary: string;
  keywords: string[];
  tone: string;
  keyPoints: string[];
};

function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.description === "string" &&
    typeof data.summary === "string" &&
    Array.isArray(data.keywords) &&
    data.keywords.every((item) => typeof item === "string") &&
    typeof data.tone === "string" &&
    Array.isArray(data.keyPoints) &&
    data.keyPoints.every((item) => typeof item === "string")
  );
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Contenu invalide." }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
      Tu es un assistant spécialisé dans l'analyse de contenu.

      Analyse le texte fourni.

      Retourne uniquement un objet JSON valide avec exactement cette structure :

      {
        "description": "une phrase très courte décrivant le sujet général du contenu",
        "summary": "un résumé plus détaillé du contenu",
        "keywords": ["mot clé 1", "mot clé 2"],
        "tone": "ton du texte",
        "keyPoints": ["point important 1", "point important 2"]
      }

      Règles :
      - Ne retourne aucun texte avant ou après le JSON.
      - N'utilise pas de Markdown.
      - N'invente aucune information absente du texte.
      - Réponds en français.
      `,

      input: content.trim(),
    });

    const parsed: unknown = JSON.parse(response.output_text);

    if (!isAnalysisResponse(parsed)) {
      throw new Error("Structure de réponse invalide.");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Erreur analyse :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue pendant l'analyse." },
      { status: 500 },
    );
  }
}
