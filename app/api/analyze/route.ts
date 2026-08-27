import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize the OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Contenu invalide." }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: `Tu es un assistant spécialisé dans l'analyse de contenu.

      Analyse le texte fourni et retourne :
      - un résumé court,
      - les mots clés principaux,
      - le ton du texte,
      - les points importants.

      N'invente aucune information absente du texte.
      Réponds en français.
      `,
      input: content,
    });

    return NextResponse.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("Erreur analyse :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue pendant l'analyse." },
      { status: 500 },
    );
  }
}
