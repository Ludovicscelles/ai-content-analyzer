"use client";

import { useState } from "react";

import type { Analysis } from "../types/Analysis";

import ActionButton from "../components/ActionButton";

import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  // Initialize the analysis state by retrieving it from sessionStorage
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

  const handleReturnHome = () => {
    sessionStorage.removeItem("analysis");
    router.push("/");
  };

  return (
    <div className="w-full">
      <h2 className="section-title-h2">
        Résultats de l&apos;analyse du texte :
      </h2>
      <div
        className="
                h-full w-full
                rounded-lg border-4 border-black
                bg-white p-4 text-base text-black
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-white
                "
      >
        <h3 className="section-title-h3">Description :</h3>
        <p className="section-text">{analysis.description}</p>
        <h3 className="section-title-h3">Résumé :</h3>
        <p className="section-text">{analysis.summary}</p>
        <h3 className="section-title-h3">Mots-clés :</h3>
        <ul className="section-text ul">
          {analysis.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
        <h3 className="section-title-h3">Ton / Sujet :</h3>
        <p className="section-text">{analysis.tone}</p>
        <h3 className="section-title-h3">Points clés :</h3>
        <ul className="section-text ul">
          {analysis.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
      <ActionButton onClick={handleReturnHome} text="Retour à l'accueil" />
    </div>
  );
}
