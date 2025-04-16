"use client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import pb from "@/app/hooks/usePocketBase";
import type { RegisterForm, Role } from "@/app/lib/types";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function RegisterPage() {
  const [t] = useTranslation();
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    roles: [],
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const permissions =
      pb.authStore.model?.expand?.roles?.flatMap((r: any) =>
        r.expand?.permissions?.map((p: any) => p.permission)
      ) || [];

    setHasPermission(permissions.includes("user_create"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];

      return { ...prev, roles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.roles.length === 0) {
      toast.error(t("register.noRole"));
      return;
    }

    try {
      const roleRecords = await pb.collection("roles").getFullList({
        filter: formData.roles.map((role) => `role = "${role}"`).join(" || "),
      });
      const roleIds = roleRecords.map((r) => r.id);

      await pb.collection("users").create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        emailVisibility: true,
        name: formData.name,
        roles: roleIds,
      });

      toast.success(t("register.successMessage"));
    } catch {
      toast.error(t("register.errorMessage"));
    }
  };

  if (hasPermission === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 px-4">
        <div className="text-center bg-white p-8 shadow-md rounded-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">
            {t("register.noPermsHeader")}
          </h1>
          <p className="text-gray-700">{t("register.noPermsText")} </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t("register.registerText")}
        </h1>
        <title>{t("register.registerText")}</title>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">
          {t("register.passwordText")}
        </label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-6"
          required
        />

        <div className="mb-6">
          <p className="mb-2 text-sm font-medium">{t("register.rolesText")}</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.roles.includes("partner")}
                onChange={() => handleRoleChange("partner")}
                className="mr-2"
              />
              Partner
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.roles.includes("donor")}
                onChange={() => handleRoleChange("donor")}
                className="mr-2"
              />
              {t("register.donor")}
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          {t("register.registerButton")}
        </button>
      </form>
    </div>
  );
}
