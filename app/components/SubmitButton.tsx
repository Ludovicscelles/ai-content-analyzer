"use client";

type SubmitButtonProps = {
  onClick: () => void;
};

export default function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button
      type="button"
      className="
        mt-8 w-[50%] rounded-lg bg-blue-analyze py-4 text-2xl font-semibold text-white transition-colors hover:bg-blue-analyze/90 focus:outline-none focus:ring-2 focus:ring-blue-analyze focus:ring-offset-2 dark:bg-blue-analyze/80 dark:hover:bg-blue-analyze/70 dark:focus:ring-blue-analyze/80
      "
      onClick={onClick}
    >
      Analyser le texte
    </button>
  );
}
