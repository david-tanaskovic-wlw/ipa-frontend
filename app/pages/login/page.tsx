"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/hooks/usePocketBase";
import type { LoginForm } from "@/app/lib/types";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function LoginPage() {
  const { t, i18n } = useTranslation();

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

    try {
      const userRecord = await pb
        .collection("users")
        .authWithPassword(formData.user, formData.password);

      try {
        const expanded = await pb
          .collection("users")
          .getOne(userRecord.record.id, {
            expand: "roles.permissions",
          });

        pb.authStore.save(userRecord.token, expanded);
      } catch (err) {
        pb.authStore.save(userRecord.token, userRecord.record);
      }

      router.push("/");
    } catch (err) {
      console.error("Login fehlgeschlagen:", err);
      alert("Login fehlgeschlagen");
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">{t("login.loginText")}</h1>
        <title>{t("login.loginText")}</title>

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

        <label className="block mb-2 text-sm font-medium">{t("login.passwordText")}</label>
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
          {t("login.loginText")}
        </button>
      </form>
    </div>
  );
}
