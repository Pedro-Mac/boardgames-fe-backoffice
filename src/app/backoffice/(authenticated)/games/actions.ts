"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";

export type DeleteGameState = { error: string } | null;

export async function deleteGameAction(gameId: string): Promise<DeleteGameState> {
  const token = await getAuthToken();

  if (!token) {
    return { error: "Not authenticated." };
  }

  const response = await fetch(
    `${CONSTANTS.API_BASE_URL}/api/v1/admin/games/${gameId}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Game not found." };
    }
    const text = await response.text().catch(() => response.statusText);
    return { error: `Failed to delete game: ${text}` };
  }

  revalidatePath("/backoffice/games");
  return null;
}
