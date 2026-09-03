"use client";

import { useState } from "react";

type Analysis = {
  description: string;
  summary: string;
  keywords: string[];
  tone: string;
  keyPoints: string[];
};

export default function ResultPage() {
  const [analysis] = useState<Analysis | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedAnalysis = sessionStorage.getItem("analysis");

    return storedAnalysis ? JSON.parse(storedAnalysis) : null;
  });

  if (!analysis) {
    return (
      <div className="w-full">
        <h2 className="section-title-h2">Aucune analyse disponible.</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="section-title-h2">
        Résultats de l&apos;analyse du texte :
      </h2>
      <div
        className="
                h-200 w-full
                rounded-lg border-4 border-black
                bg-white p-4 text-base text-black
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-white
                "
      >
        <h3 className="section-title-h3">Description :</h3>
        <p className="text-base text-black dark:text-white">
          {analysis.description}
        </p>
        <h3 className="section-title-h3">Résumé :</h3>
        <p className="text-base text-black dark:text-white">
          {analysis.summary}
        </p>
        <h3 className="section-title-h3">Mots-clés :</h3>
        <ul className="list-disc pl-5 text-base text-black dark:text-white">
          {analysis.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
        <h3 className="section-title-h3">Ton / Sujet :</h3>
        <p className="text-base text-black dark:text-white">{analysis.tone}</p>
        <h3 className="section-title-h3">Points clés :</h3>
        <ul className="list-disc pl-5 text-base text-black dark:text-white">
          {analysis.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
