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
            failed: "Login failed",
            success: "Login successful",
          },
          resetPassword: {
            resetPasswordText: "Forgot Password?",
            forgotText: "Enter your email to reset password:",
            invalidEmail: "Please enter a valid email",
            resetButton: "Send Reset Link",
            emailNotFound: "Email not found",
            emailSent:
              "Password reset email sent! Please check your inbox. (Note: Check your spam folder if you don't see it",
          },
          register: {
            registerText: "Register User",
            passwordText: "Password",
            rolesText: "Roles",
            registerButton: "Create",
            noPermsHeader: "No Permissions",
            noPermsText: "You don't have permissions to register a user.",
            donor: "Donor",
            successMessage: "User created successfully.",
            errorMessage: "Error creating user.",
            noRole: "Please select at least one role.",
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
            errorText: "No permissions or error loading users:",
            entries: "Entries:",
            previous: "Previous",
            next: "Next",
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
            userDeleted:
              "User deleted successfully. You will be redirected to the user list.",
            userUpdated:
              "User updated successfully. You will be redirected to the user list.",
          },
          navbar: {
            profile: "My profile",
            userList: "User list",
            registerUser: "Create User",
            logout: "Logout",
            confirmation: "Are you sure you want to log out?",
            loggedOut: "You have been logged out.",
          },
        },
      },

      de: {
        translation: {
          login: {
            passwordText: "Passwort",
            loginText: "Anmelden",
            failed: "Anmeldung fehlgeschlagen",
            success: "Erfolgreich angemeldet",
          },
          resetPassword: {
            resetPasswordText: "Passwort vergessen?",
            forgotText:
              "Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen:",
            invalidEmail: "Bitte gültige E-Mail eingeben",
            resetButton: "Link zum Zurücksetzen senden",
            emailNotFound: "E-Mail nicht gefunden",
            emailSent:
              "E-Mail zum Zurücksetzen des Passworts gesendet! Bitte überprüfe deinen Posteingang. (Hinweis: Überprüfe deinen Spam-Ordner, wenn du sie nicht siehst)",
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
            successMessage: "Benutzer erfolgreich erstellt.",
            errorMessage: "Fehler beim Erstellen des Benutzers.",
            noRole: "Bitte wähle mindestens eine Rolle aus."

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
            errorText: "Keine Berechtigung oder Fehler beim Laden:",
            entries: "Einträge:",
            previous: "Zurück",
            next: "Vor",
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
            userDeleted:
              "Benutzer erfolgreich gelöscht. Du wirst zur Nutzerliste weitergeleitet.",
            userUpdated:
              "Benutzer erfolgreich aktualisiert. Du wirst zur Nutzerliste weitergeleitet.",
          },
          navbar: {
            profile: "Mein Profil",
            userList: "Nutzerliste",
            registerUser: "Nutzer erstellen",
            logout: "Abmelden",
            confirmation: "Bist du sicher, dass du dich abmelden möchtest?",
            loggedOut: "Du hast dich abgemeldet.",
          },
        },
      },
    },
  });

export default i18n;
