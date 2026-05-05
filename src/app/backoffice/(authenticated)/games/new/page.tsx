import GameForm from "./GameForm";
import { createGameAction } from "./actions";

export default function NewGamePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Add game
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Fill in the details below to add a new game to the catalogue.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <GameForm
          formAction={createGameAction}
          submitLabel="Create game"
        />
      </div>
    </div>
  );
}
