"use client";

import { useRouter } from "next/navigation";

import SubmitButton from "./components/SubmitButton";

import { useState } from "react";

type Analysis = {
  description: string;
  summary: string;
  keywords: string[];
  tone: string;
  keyPoints: string[];
};

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const router = useRouter();

  const handleTextSubmit = () => {
    const formData = new FormData();

    if (text.trim() !== "") {
      formData.append("text", text);
    }

    fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from API:", data);
        setAnalysis(data);
        sessionStorage.setItem("analysis", JSON.stringify(data));
        router.push("/result");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClick = () => {
    console.log("Submit button clicked");
  };

  return (
    <div className="w-full">
      <h2 className="section-title-h2">Saisissez le texte à analyser :</h2>
      <textarea
        className="
                h-80 w-full
                rounded-lg border-4 border-gray-300
                bg-white p-4 text-base text-black 
                outline-none 
                focus:border-black
                focus:ring-1 
                focus:ring-blue-analyze 
                custom-scrollbar
                overflow-y-auto
                resize-none
                dark:border-zinc-700 
                dark:bg-zinc-900 
                dark:text-white
                "
        placeholder="Entrez votre texte ici..."
        value={text}
        onChange={handleTextChange}
      />
      <SubmitButton onClick={handleTextSubmit} />

      <h2 className="section-title-h2 mt-12">
        Ou déposez un fichier à analyser ci-dessous (formats pris en charge :
        .txt, .docx, .pdf) :
      </h2>
      <label
        htmlFor="file-upload"
        className="
                flex h-80 w-full cursor-pointer
                flex-col items-center justify-center
                rounded-lg border-4 border-dashed border-zinc-400
                bg-white
                text-center
                transition-colors
                hover:border-blue-analyze
                hover:bg-blue-analyze/10
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:text-white
                dark:hover:border-blue-analyze
                "
      >
        <p className="text-lg font-medium text-black dark:text-white">
          Déposez votre fichier ici
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          ou cliquez pour sélectionner un fichier
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.docx,.pdf"
          className="hidden"
        />
      </label>
      <SubmitButton onClick={handleClick} />
    </div>
  );
}
