export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between pt-8 pb-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="w-full text-center mb-16 text-4xl font-bold tracking-tight blue-analyze-text dark:text-zinc-50 sm:text-6xl">
            AnalyseMonTexte
          </h1>
          <div className="w-full">
            <h2 className="w-full text-center mb-8 text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Saisissez le texte que vous souhaitez analyser :
            </h2>
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
                mb-16
                dark:border-zinc-700 
                dark:bg-zinc-900 
                dark:text-white
                "
              placeholder="Entrez votre texte ici..."
            />
            <h2 className="max-w-xl mx-auto text-center mb-8 text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Ou déposez un fichier à analyser ci-dessous (formats pris en
              charge : .txt, .docx, .pdf) :
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
          </div>
        </div>
      </main>
    </div>
  );
}
