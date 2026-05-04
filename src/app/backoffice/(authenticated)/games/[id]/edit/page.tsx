import { notFound } from "next/navigation";
import type { GetGameOutput, ListCategoriesOutput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";
import GameForm from "../../new/GameForm";
import { updateGameAction } from "./actions";

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params;
  const headers = await getAuthHeaders();

  const [gameResponse, categoriesResponse] = await Promise.all([
    fetch(`${CONSTANTS.API_BASE_URL}/api/v1/admin/games/${id}`, { headers }),
    fetch(`${CONSTANTS.API_BASE_URL}/api/v1/admin/categories`, { headers }),
  ]);

  if (gameResponse.status === 404) {
    notFound();
  }

  if (!gameResponse.ok) {
    throw new Error(`Failed to fetch game: ${gameResponse.statusText}`);
  }

  if (!categoriesResponse.ok) {
    throw new Error(
      `Failed to fetch categories: ${categoriesResponse.statusText}`,
    );
  }

  const { game }: GetGameOutput = await gameResponse.json();
  const { categories }: ListCategoriesOutput = await categoriesResponse.json();

  const boundAction = updateGameAction.bind(null, id);

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
          Edit game
        </h1>
        <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
          Update the details for{" "}
          <span className='font-medium text-zinc-700 dark:text-zinc-300'>
            {game.title}
          </span>
          .
        </p>
      </div>

      <div className='rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900'>
        <GameForm
          categories={categories}
          formAction={boundAction}
          submitLabel='Save changes'
          defaultValues={game}
        />
      </div>
    </div>
  );
}
