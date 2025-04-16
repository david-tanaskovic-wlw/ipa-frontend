"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import pb from "@/app/hooks/usePocketBase";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { toast } from "sonner"; 

export default function NavBar() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<string[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUser = pb.authStore.model;

    setUserId(currentUser?.id ?? null);

    const perms =
      currentUser?.expand?.roles?.flatMap((r: any) =>
        r.expand?.permissions?.map((p: any) => p.permission)
      ) || [];

    setPermissions(perms);
  }, []);

  const logout = async () => {
    const confirmed = confirm(t("navbar.confirmation"));
    if (!confirmed) return;
    pb.authStore.clear();
    window.location.reload();
    toast.success(t("navbar.loggedOut"));
    router.replace("/pages/login");
  };

  if (!userId) return null;
  return (
    <nav className="top-0 left-0 justify-center bg-gray-200 text-black shadow px-2 py-3 flex gap-4 text-sm">

      <Link href={`/pages/userProfile/${userId}`} className="hover:underline">
        {t("navbar.profile")}
      </Link>

      {permissions?.includes("list_read") && (
        <Link href="/" className="hover:underline">
          {t("navbar.userList")}
        </Link>
      )}

      {permissions?.includes("user_create") && (
        <Link href="/pages/register" className="hover:underline">
          {t("navbar.registerUser")}
        </Link>
      )}

      <button
        onClick={logout}
        className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
      >
        {t("navbar.logout")}
      </button>
    </nav>
  );
}
