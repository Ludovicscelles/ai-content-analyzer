import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

import mammoth from "mammoth";

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
    // formData is used to handle file uploads in the request
    const formData = await request.formData();
    const file = formData.get("file");

    console.log("file type:", file instanceof File ? file.type : "not a file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Fichier invalide.",
        },
        { status: 400 },
      );
    }

    const isTxt = file.type === "text/plain";
    const isPdf = file.type === "application/pdf";
    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      (file.type === "application/octet-stream" &&
        file.name.toLowerCase().endsWith(".docx"));

    const allowedFilesTypes = [isTxt, isPdf, isDocx];

    if (!allowedFilesTypes.some(Boolean)) {
      return NextResponse.json(
        {
          error: "Seuls les fichiers TXT, PDF et DOCX sont acceptés.",
        },
        { status: 400 },
      );
    }

    let content = "";

    if (isTxt) {
      content = await file.text();
    } else if (isPdf) {
      // Convert the PDF file to an ArrayBuffer and then to a Buffer for parsing
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parser = new PDFParse({ data: buffer });

      try {
        const result = await parser.getText();

        content = result.text;
      } finally {
        await parser.destroy();
      }
    } else if (isDocx) {
      // Extract raw text from DOCX file with Mammoth
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await mammoth.extractRawText({ buffer });

      content = result.value;
    }

    if (content.trim() === "") {
      return NextResponse.json(
        { error: "Le fichier est vide ou aucun texte n'a pu être extrait." },
        { status: 400 },
      );
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
