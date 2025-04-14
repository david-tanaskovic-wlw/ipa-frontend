//NOTE: This file was taken from following site: https://www.locize.com/blog/react-i18next

import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

i18n

  // detect user language

  // learn more: https://github.com/i18next/i18next-browser-languageDetector

  .use(LanguageDetector)

  // pass the i18n instance to react-i18next.

  .use(initReactI18next)

  // init i18next

  // for all options read: https://www.i18next.com/overview/configuration-options

  .init({
    debug: true,

    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources: {
      en: {
        translation: {
          login: {
            passwordText: "Password",
            loginText: "Login",
          },
          register: {
            registerText: "Register User",
            passwordText: "Password",
            rolesText: "Roles",
            registerButton: "Create",
            noPermsHeader: "No Permissions",
            noPermsText: "You don't have permissions to register a user.",
            donor: "Donor",
          },
          userList: {
            loading: "Loading...",
            profileHeader: "To Profile",
            profileText: "Click on the button to get to your profile view.",
            profileButton: "See my profile",
            users: "Users",
            userList: "User List",
            role: "Role",
            searchBar: "Search users...",
            registerButton: "Create User",
            roles: {
              donor: "Donor",
              partner: "Partner",
              admin: "Admin",
            },
          },
          profileView: {
            title: "Profile View",
            profile: "Profile",
            roles: {
              donor: "Donor",
              partner: "Partner",
              admin: "Admin",
            },
            confirmation: {
              delete: "Are you sure you want to delete this user?",
              edit: "Do you want to save the changes?",
            },
            role: "Role",
            editProfile: "Edit Profile",
            editButton: "Update Information",
            deleteButton: "Delete User",
          },
          navbar: {
            profile: "My profile",
            userList: "User list",
            registerUser: "Create User",
            logout: "Logout",
            confirmation: "Are you sure you want to log out?",
          },
        },
      },
      de: {
        translation: {
          login: {
            passwordText: "Passwort",
            loginText: "Anmelden",
          },

          register: {
            registerText: "Nutzer registrieren",
            passwordText: "Passwort",
            rolesText: "Rollen",
            registerButton: "Erstellen",
            noPermsHeader: "Keine Berechtigung",
            noPermsText:
              "Du hast keine Berechtigung, um neue Benutzer zu erstellen.",
            donor: "Spender",
          },
          userList: {
            loading: "Lade...",
            profileHeader: "Zum Profil",
            profileText:
              "Klicke auf den Button, um auf deine Profilansicht zu kommen.",
            profileButton: "Mein Profil ansehen",
            users: "Nutzer",
            userList: "Nutzerliste",
            role: "Rolle",
            searchBar: "Suche Nutzer...",
            registerButton: "Nutzer erstellen",
            roles: {
              donor: "Spender",
              partner: "Partner",
              admin: "Administrator",
            },
          },
          profileView: {
            title: "Profilansicht",
            profile: "Profil",
            roles: {
              donor: "Spender",
              partner: "Partner",
              admin: "Administrator",
            },
            confirmation: {
              delete:
                "Bist du sicher, dass du diesen Benutzer löschen möchtest?",
              edit: "Möchtest du die Änderungen speichern?",
            },
            role: "Rolle",
            editProfile: "Profil bearbeiten",
            editButton: "Informationen ändern",
            deleteButton: "Benutzer löschen",
          },
          navbar: {
            profile: "Mein Profil",
            userList: "Nutzerliste",
            registerUser: "Nutzer erstellen",
            logout: "Abmelden",
            confirmation: "Bist du sicher, dass du dich abmelden möchtest?",
          },
        },
      },
    },
  });

export default i18n;
