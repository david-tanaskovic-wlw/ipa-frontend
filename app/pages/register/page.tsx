"use client";

import { useState } from "react";
import pb from "@/app/hooks/usePocketBase";
import type { RegisterForm, Role } from "@/app/lib/types";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    roles: [],
  });

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

    const roleRecords = await pb.collection("roles").getFullList({
      filter: formData.roles.map((role) => `role = "${role}"`).join(" || "),
    });
    const roleIds = roleRecords.map((r) => r.id);

    await pb.collection("users").create({
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.password,
      name: formData.name,
      roles: roleIds,
    });
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register User</h1>

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

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-6"
          required
        />

        <div className="mb-6">
          <p className="mb-2 text-sm font-medium">Roles</p>
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
              Donor
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
