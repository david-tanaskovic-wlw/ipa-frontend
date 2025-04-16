"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import pb from "@/app/hooks/usePocketBase"
import type { LoginForm } from "@/app/lib/types"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import "@/i18n"

export default function LoginPage() {
  const [passwordResetRequested, setPasswordResetRequested] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const { t } = useTranslation()
  const router = useRouter()

  const [formData, setFormData] = useState<LoginForm>({
    user: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const userRecord = await pb
        .collection("users")
        .authWithPassword(formData.user, formData.password)

      try {
        const expanded = await pb.collection("users").getOne(userRecord.record.id, {
          expand: "roles.permissions",
          requestKey: null
        })

        pb.authStore.save(userRecord.token, expanded)
      } catch {
        pb.authStore.save(userRecord.token, userRecord.record)
      }

      toast.success(t("login.success"))
      setTimeout(() => {
        router.push("/")
        window.location.reload()
      }, 1000)
    } catch {
      toast.error(t("login.failed"))
    }
  }
  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value)
  }

  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      toast.error(t("resetPassword.emptyEmail"))
      return
    }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error(t("resetPassword.invalidEmail"))
      return
    }

    try {
      const result = await pb.collection("users").getFullList({
        filter: `email="${resetEmail}"`
      })

      if (result.length === 0) {
        toast.error(t("resetPassword.emailNotFound"))
        return
      }

      await pb.collection("users").requestPasswordReset(resetEmail)
      toast.success(t("resetPassword.emailSent"))
    } catch {
      toast.error(t("resetPassword.emailError"))
    }
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      {!passwordResetRequested ? (
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
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
          <div className="text-center mt-4">
            <a
              href="#"
              onClick={() => setPasswordResetRequested(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              {t("resetPassword.resetPasswordText")}
            </a>
          </div>
        </form>
      ) : (
        <form onSubmit={requestPasswordReset}>
          <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <label className="block mb-2 text-sm font-medium">
              {t("resetPassword.forgotText")}
            </label>

            <input
              type="email"
              value={resetEmail}
              onChange={handleResetEmailChange}
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded mb-4"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              {t("resetPassword.resetButton")}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
