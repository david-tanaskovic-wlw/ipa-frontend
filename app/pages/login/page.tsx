"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/hooks/usePocketBase";
import type { LoginForm } from "@/app/lib/types";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginForm>({
    user: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await pb
      .collection("users")
      .authWithPassword(formData.user, formData.password);
    router.push("/");
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <label className="block mb-2 text-sm font-medium">E-Mail</label>
        <input
          name="user"
          type="email"
          value={formData.user}
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">Passwort</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}
