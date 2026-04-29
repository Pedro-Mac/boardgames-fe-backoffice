import Link from "next/link";
import type { ListGamesOutput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";
import Pagination from "@/components/Pagination";

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Games
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {pagination.total} {pagination.total === 1 ? "game" : "games"}
          </span>
          <Link
            href="/backoffice/games/new"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add game
          </Link>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            No games yet
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your first game to get started.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Categories
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Players
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Play time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Publisher
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="bg-white transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                      {game.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {formatPrice(game.price)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {game.stock}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {game.categories.length === 0 ? (
                        <span className="text-zinc-400 dark:text-zinc-600">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {game.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {formatPlayers(game.min_players, game.max_players)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {formatPlayTime(game.min_play_time, game.max_play_time)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {game.publisher}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {game.year_published}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-end">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
