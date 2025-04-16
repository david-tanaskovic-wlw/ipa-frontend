"use client"

import { useTranslation } from "react-i18next"
import "@/i18n"
import React from "react"

const languages = {
  en: { nativeName: "English" },
  de: { nativeName: "Deutsch" }
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="absolute top-20 right-4">
      <select
        value={i18n.resolvedLanguage}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="px-3 py-1 rounded-md bg-white text-black border border-gray-300 shadow-sm"
      >
        {Object.keys(languages).map((lng) => (
          <option key={lng} value={lng}>
            {languages[lng].nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
