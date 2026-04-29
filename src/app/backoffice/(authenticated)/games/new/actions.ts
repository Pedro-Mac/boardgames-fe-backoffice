"use server";

import { redirect } from "next/navigation";
import type { CreateGameInput } from "@/types/games";
import { getAuthHeaders } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";

export type CreateGameState = { error: string } | null;

export async function createGameAction(
  _prev: CreateGameState,
  formData: FormData,
): Promise<CreateGameState> {
  const rawPrice = formData.get("price") as string;
  const priceEuros = parseFloat(rawPrice);

  if (isNaN(priceEuros) || priceEuros < 0) {
    return { error: "Price must be a valid non-negative number." };
  }

  const categoryIds = formData.getAll("category_ids") as string[];

  const body: CreateGameInput = {
    name: formData.get("name") as string,
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
    category_ids: categoryIds.length > 0 ? categoryIds : undefined,
  };

  const headers = await getAuthHeaders();
  const response = await fetch(`${CONSTANTS.API_BASE_URL}/api/v1/admin/games`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    return { error: `Failed to create game: ${text}` };
  }

  redirect("/backoffice/games");
}
