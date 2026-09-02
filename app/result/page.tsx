export default function ResultPage() {
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
        <h3 className="section-title-h3">Résumé :</h3>
        <h3 className="section-title-h3">Mots-clés :</h3>
        <h3 className="section-title-h3">Ton / Sujet :</h3>
        <h3 className="section-title-h3">
          Éléments clés / Points importants :
        </h3>
      </div>
    </div>
  );
}
