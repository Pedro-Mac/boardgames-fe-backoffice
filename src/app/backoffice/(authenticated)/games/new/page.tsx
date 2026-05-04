import type { ListCategoriesOutput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";
import GameForm from "./GameForm";
import { createGameAction } from "./actions";

export default async function NewGamePage() {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${CONSTANTS.API_BASE_URL}/api/v1/admin/categories`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const { categories }: ListCategoriesOutput = await response.json();

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
          categories={categories}
          formAction={createGameAction}
          submitLabel="Create game"
        />
      </div>
    </div>
  );
}
