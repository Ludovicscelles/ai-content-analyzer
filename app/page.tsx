"use client";

// useRouter is used to navigate to the result page
// after the analysis has been stored in sessionStorage.
import { useRouter } from "next/navigation";

import { useState } from "react";

import ActionButton from "./components/ActionButton";

import type { Analysis } from "./types/Analysis";

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  // Handle drag and drop events for the file upload

  // Prevent the default behavior when a file is dragged over the label
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  // Handle the drop event when a file is dropped onto the label
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    setFile(droppedFile);
  };

  // Initialize the router for navigation
  const router = useRouter();

  const handleTextSubmit = () => {
    // Create a new FormData object to hold the text data
    const formData = new FormData();

    if (text.trim() !== "") {
      formData.append("text", text);
    }

    fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de l'analyse du texte");
        }

        return data;
      })
      .then((data: Analysis) => {
        console.log("Response from API:", data);
        sessionStorage.setItem("analysis", JSON.stringify(data));
        router.push("/result");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFileSubmit = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de l'analyse du fichier");
        }

        return data;
      })
      .then((data: Analysis) => {
        console.log("Response from API:", data);
        sessionStorage.setItem("analysis", JSON.stringify(data));
        router.push("/result");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
      <ActionButton onClick={handleTextSubmit} text="Analyser le texte" />

      <h2 className="section-title-h2 mt-12">
        Ou déposez un fichier à analyser ci-dessous (formats pris en charge :
        .txt, .docx, .pdf) :
      </h2>
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
          {file ? file.name : "Déposez un fichier ici"}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {file
            ? "Cliquez pour changer le fichier"
            : "Ou cliquez pour sélectionner un fichier"}
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.docx,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <ActionButton onClick={handleFileSubmit} text="Analyser le fichier" />
    </div>
  );
}
