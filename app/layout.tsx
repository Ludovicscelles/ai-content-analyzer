import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnalyseMonTexte",
  description:
    "Analysez votre texte facilement avec notre application d'analyse de texte.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-full flex flex-col">
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          {" "}
          <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between pt-8 pb-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex w-full flex-col items-center gap-6 text-center">
              <h1 className="w-full text-center mb-16 text-4xl font-bold tracking-tight blue-analyze-text dark:text-zinc-50 sm:text-6xl">
                AnalyseMonTexte
              </h1>

              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
