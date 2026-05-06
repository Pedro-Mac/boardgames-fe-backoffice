"use server";

import { redirect } from "next/navigation";

import { setAuthCookie } from "@/lib/auth";
import { CONSTANTS } from "@/utils/constants";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    permissions: string[];
  };
  session: {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    expiresIn: number;
  };
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${CONSTANTS.API_BASE_URL}/api/v1/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data: LoginResponse = await response.json();

  await setAuthCookie(data.session.accessToken, data.session.expiresIn);

  redirect("/backoffice");
}
