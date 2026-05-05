import Link from "next/link";
import type { ListGamesOutput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";
import Pagination from "@/components/Pagination";
import DeleteGameButton from "./DeleteGameButton";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatPlayers(min: number, max: number): string {
  return min === max ? `${min}` : `${min} – ${max}`;
}

function formatPlayTime(min: number, max: number): string {
  return min === max ? `${min} min` : `${min} – ${max} min`;
}

interface GamesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const headers = await getAuthHeaders();
  const response = await fetch(
    `${CONSTANTS.API_BASE_URL}/api/v1/admin/games?page=${page}&size=20`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }

  const { games, pagination }: ListGamesOutput = await response.json();

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-50'>
          Games
        </h1>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-zinc-500 dark:text-zinc-400'>
            {pagination.total} {pagination.total === 1 ? "game" : "games"}
          </span>
          <Link
            href='/backoffice/games/new'
            className='rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
          >
            Add game
          </Link>
        </div>
      </div>

      {games.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700'>
          <p className='text-sm font-medium text-zinc-900 dark:text-zinc-50'>
            No games yet
          </p>
          <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
            Add your first game to get started.
          </p>
        </div>
      ) : (
        <>
          <div className='overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700'>
            <table className='w-full text-sm'>
              <thead className='border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'>
                <tr>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Name
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Price
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Stock
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Players
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Play time
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400'>
                    Publisher
                  </th>
                  <th className='px-4 py-3' />
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-100 dark:divide-zinc-800'>
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className='bg-white transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50'
                  >
                    <td className='px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50'>
                      {game.title}
                    </td>
                    <td className='px-4 py-3 text-zinc-600 dark:text-zinc-400'>
                      {formatPrice(game.commerce.price)}
                    </td>
                    <td className='px-4 py-3'>
                      {game.commerce.inStock ? (
                        <span className='inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950 dark:text-green-400 dark:ring-green-500/20'>
                          In stock
                        </span>
                      ) : (
                        <span className='inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950 dark:text-red-400 dark:ring-red-500/20'>
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 text-zinc-600 dark:text-zinc-400'>
                      {formatPlayers(
                        game.gameplay.players.min,
                        game.gameplay.players.max,
                      )}
                    </td>
                    <td className='px-4 py-3 text-zinc-600 dark:text-zinc-400'>
                      {formatPlayTime(
                        game.gameplay.playtime.min,
                        game.gameplay.playtime.max,
                      )}
                    </td>
                    <td className='px-4 py-3 text-zinc-600 dark:text-zinc-400'>
                      {game.attribution.publisher}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/backoffice/games/${game.id}/edit`}
                          className='rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
                          aria-label={`Edit ${game.title}`}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            aria-hidden='true'
                          >
                            <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                            <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z' />
                          </svg>
                        </Link>
                        <DeleteGameButton
                          gameId={game.id}
                          gameName={game.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className='flex justify-end'>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
