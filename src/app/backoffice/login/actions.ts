"use server";

import { redirect } from "next/navigation";

import { setAuthCookie, API_BASE_URL } from "@/lib/auth";

interface LoginResponse {
  access_token: string;
  expires_in: number;
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
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

  await setAuthCookie(data.access_token, data.expires_in);

  redirect("/backoffice");
}
