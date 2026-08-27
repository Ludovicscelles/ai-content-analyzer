import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the expected structure of the analysis response
const AnalysisResponse = z.object({
  description: z
    .string()
    .max(200, "La description ne doit pas dépasser 200 caractères."),
  summary: z.string(),
  keywords: z
    .array(z.string())
    .max(10, "Le nombre de mots-clés ne doit pas dépasser 10."),
  tone: z.string(),
  keyPoints: z
    .array(z.string())
    .max(8, "Le nombre de points clés ne doit pas dépasser 8."),
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Contenu invalide." }, { status: 400 });
    }

    const response = await openai.responses.parse({
      model: "gpt-5.6-luna",

      instructions: `
      Tu es un assistant spécialisé dans l'analyse de contenu.

      Analyse uniquement les informations présentes dans le texte.

      Retourne :
        description: une phrase très courte décrivant le sujet général du contenu,
        summary: un résumé plus détaillé du contenu,
        keywords: les mots-clés principaux,
        tone: ton du texte,
        keyPoints: les points importants du texte.

      - N'invente aucune information absente du texte.
      - Réponds en français.
      `,

      input: content.trim(),

      text: {
        format: zodTextFormat(AnalysisResponse, "content_analysis"),
      },
    });

    // Parse the response to extract the analysis data
    const analysis = response.output_parsed;

    if (!analysis) {
      return NextResponse.json(
        { error: "Impossible de générer l'analyse" },
        { status: 500 },
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Erreur analyse :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue pendant l'analyse." },
      { status: 500 },
    );
  }
}
