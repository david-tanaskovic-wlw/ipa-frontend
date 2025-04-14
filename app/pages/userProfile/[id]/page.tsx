"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import pb from "@/app/hooks/usePocketBase";
import type { Role } from "@/app/lib/types";

export default function UserProfilePage() {
  const [isEditable, setIsEditable] = useState(false);

  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roles: [] as Role[],
  });

  useEffect(() => {
    const getUser = async () => {
      const record = await pb.collection("users").getOne(userId, {
        expand: "roles",
      });

      const currentUserPermissions =
        pb.authStore.model?.expand?.roles?.flatMap((r: any) =>
          r.expand?.permissions?.map((p: any) => p.permission)
        ) || [];

      setIsEditable(currentUserPermissions.includes("user_edit"));

      setFormData({
        name: record.name,
        email: record.email,
        roles: record.expand?.roles.map((r: any) => r.role) || [],
      });
    };

    getUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const handleUpdate = async () => {
    if (!isEditable) return;
    const confirmed = confirm("Möchtest du die Änderungen wirklich speichern?");
    if (!confirmed) return;

    const roleRecords = await pb.collection("roles").getFullList({
      filter: formData.roles.map((r) => `role = "${r}"`).join(" || "),
    });

    const roleIds = roleRecords.map((r) => r.id);

    await pb.collection("users").update(userId, {
      name: formData.name,
      email: formData.email,
      roles: roleIds,
    });

    router.push("/");
  };

  const handleDelete = async () => {
    if (!isEditable) return;
    const confirmed = confirm("Möchtest du diesen Benutzer wirklich löschen?");
    if (!confirmed) return;

    await pb.collection("users").delete(userId);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-6">
      <div className="w-full max-w-md border rounded shadow p-6 space-y-4 text-black">
        <h1 className="text-2xl font-bold mb-4">
          {isEditable ? "Profil bearbeiten" : "Profil"}
        </h1>
        <title>Profilansicht</title>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full border px-3 py-2 rounded ${
              isEditable
                ? "bg-gray-100"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">E-Mail</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditable}
            className={`w-full border px-3 py-2 rounded ${
              isEditable
                ? "bg-gray-100"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Rollen</label>
          <div className="space-y-1 ml-2">
            {["partner", "donor"].map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role as Role)}
                  onChange={() => handleRoleChange(role as Role)}
                  disabled={!isEditable}
                  className="mr-2"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {isEditable && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Update Info
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Delete User
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
