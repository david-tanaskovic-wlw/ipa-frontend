"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/hooks/usePocketBase";
import type { User } from "@/app/lib/types";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const getUsers = async () => {
    try {
      const result = await pb.collection("users").getFullList({
        expand: "roles",
        sort: "name",
      });

      const mapped: User[] = result.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        roles: u.expand?.roles || [],
      }));

      setUsers(mapped);
      setHasAccess(true);
    } catch (err) {
      console.error("Keine Berechtigung oder Fehler beim Laden:", err);
      setHasAccess(false);
    }
  };

  useEffect(() => {
    const permissions: string[] =
      pb.authStore.model?.expand?.roles?.flatMap((role: any) =>
        role.expand?.permissions?.map((p: any) => p.permission)
      ) || [];

    if (permissions.includes("list_read")) {
      getUsers();
    } else {
      setHasAccess(false);
    }
  }, []);

  const userId = pb.authStore.model?.id;

  if (hasAccess === null) {
    return <div className="text-center mt-20 text-gray-500">Lade...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center text-black items-center p-8">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-600">
            Zum Profil
          </h2>
          <p>Klicke auf den Button um auf deine Profilansicht zu kommen.</p>
          {userId && (
            <button
              onClick={() => router.push(`/pages/userProfile/${userId}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Mein Profil ansehen
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center text-black items-start py-16 px-4">
      <div className="bg-white shadow-md rounded-md w-full max-w-3xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <title>Nutzerliste</title>
        <input
          type="text"
          placeholder="Search users..."
          disabled //todo: suchfunktion
          className="mb-6 p-2 rounded border border-gray-300 rounded-md w-full max-w-3xl"
        />

        <table className="w-full border-t border-b border-gray-300">
          <thead>
            <tr className="text-left text-gray-600 border-b bg-gray-100 border-gray-300">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2 text-right pr-4">...</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="py-2">{user.name}</td>
                <td className="py-2">
                  {user.roles.map((r: any) => r.role).join(" & ")}
                </td>
                <td className="py-2 text-right pr-4 text-gray-500">
                  <Link
                    href={`/pages/userProfile/${user.id}`}
                    className="text-gray-500 hover:underline"
                  >
                    ...
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/pages/register")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}
