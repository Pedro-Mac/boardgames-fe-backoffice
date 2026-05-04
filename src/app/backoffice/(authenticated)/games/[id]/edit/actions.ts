"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { UpdateGameInput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";
import type { GameFormState } from "../../new/GameForm";

export async function updateGameAction(
  gameId: string,
  _prev: GameFormState,
  formData: FormData,
): Promise<GameFormState> {
  const rawPrice = formData.get("price") as string;
  const priceEuros = parseFloat(rawPrice);

  if (isNaN(priceEuros) || priceEuros < 0) {
    return { error: "Price must be a valid non-negative number." };
  }

  // const categoryIds = formData.getAll("category_ids") as string[];

  const body: UpdateGameInput = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: Math.round(priceEuros * 100),
    min_players: parseInt(formData.get("min_players") as string, 10),
    max_players: parseInt(formData.get("max_players") as string, 10),
    min_play_time: parseInt(formData.get("min_play_time") as string, 10),
    max_play_time: parseInt(formData.get("max_play_time") as string, 10),
    age_recommendation: parseInt(formData.get("age_recommendation") as string, 10),
    publisher: formData.get("publisher") as string,
    year_published: parseInt(formData.get("year_published") as string, 10),
    stock: parseInt(formData.get("stock") as string, 10) || 0,
    // category_ids: categoryIds,
  };

  const headers = await getAuthHeaders();
  const response = await fetch(
    `${CONSTANTS.API_BASE_URL}/api/v1/admin/games/${gameId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Game not found." };
    }
    const text = await response.text().catch(() => response.statusText);
    return { error: `Failed to update game: ${text}` };
  }

  revalidatePath("/backoffice/games");
  redirect("/backoffice/games");
}
