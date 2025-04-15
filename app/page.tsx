"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "@/app/hooks/usePocketBase";
import type { User } from "@/app/lib/types";
import Link from "next/link";
import "@/i18n";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getUsers = async (page: number, perPage: number) => {
    try {
      const roleFilter =
        selectedRoles.length > 0
          ? `(${selectedRoles.map((r) => `roles.role="${r}"`).join(" || ")})`
          : "";
  
      const nameFilter = `name~"${searchTerm}"`;
      const combinedFilter =
        roleFilter && nameFilter ? `${nameFilter} && ${roleFilter}` : nameFilter || roleFilter;
  
      const result = await pb.collection("users").getList(page, perPage, {
        expand: "roles",
        sort: sortOrder === "asc" ? "name" : "-name",
        requestKey: null,
        filter: combinedFilter,
      });
  
      const mapped: User[] = result.items.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        roles: u.expand?.roles || [],
      }));
  
      setUsers(mapped);
      setTotalPages(result.totalPages);
      setHasAccess(true);
    } catch (err) {
      console.error(t("userList.errorText"), err);
      setHasAccess(false);
    }
  };

  useEffect(() => {
    const permissions: string[] =
      pb.authStore.model?.expand?.roles?.flatMap((role: any) =>
        role.expand?.permissions?.map((p: any) => p.permission)
      ) || [];

    if (permissions.includes("list_read")) {
      getUsers(currentPage, perPage);
    } else {
      setHasAccess(false);
    }
  }, [currentPage, perPage, searchTerm, selectedRoles, sortOrder]);

  const userId = pb.authStore.model?.id;

  if (hasAccess === null) {
    return (
      <div className="text-center mt-20 text-gray-500">
        {t("userList.loading")}
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center text-black items-center p-8">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-600">
            {t("userList.profileHeader")}
          </h2>
          <p>{t("userList.profileText")}</p>
          {userId && (
            <button
              onClick={() => router.push(`/pages/userProfile/${userId}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {t("userList.profileButton")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center text-black items-start py-16 px-4">
      <div className="bg-white shadow-md rounded-md w-full max-w-3xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("userList.users")}</h1>
        <title>{t("userList.userList")}</title>
        <input
          type="text"
          placeholder={t("userList.searchBar")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="mb-6 p-2 rounded border border-gray-300 rounded-md w-full max-w-3xl"
        />
        <div className="mb-4 flex gap-4 flex-wrap">
          {["admin", "donor", "partner"].map((role) => (
            <label key={role} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => {
                  setCurrentPage(1);
                  setSelectedRoles((prev) =>
                    prev.includes(role)
                      ? prev.filter((r) => r !== role)
                      : [...prev, role]
                  );
                }}
              />
              {t(`userList.roles.${role}`)}
            </label>
          ))}
        </div>

        <table className="w-full border-t border-b border-gray-300">
          <thead>
            <tr className="text-left text-gray-600 border-b bg-gray-100 border-gray-300">
            <th
  className="py-2 cursor-pointer select-none"
  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
>
  Name {sortOrder === "asc" ? "↑" : "↓"}
</th>
              <th className="py-2">{t("userList.role")}</th>
              <th className="py-2 text-right pr-4">...</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-300">
                <td className="py-2">{user.name}</td>
                <td className="py-2">
                  {user.roles
                    .map((r: any) => t(`userList.roles.${r.role}`))
                    .join(" & ")}
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

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={i + 1 === currentPage}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm">
              {t("userList.entries")}
            </label>
            <input
              id="perPage"
              type="number"
              min={1}
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-16 border px-2 py-1 rounded text-sm"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/pages/register")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {t("userList.registerButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
