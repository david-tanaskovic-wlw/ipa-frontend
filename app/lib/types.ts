export type LoginForm = {
  user: string
  password: string
}

export type Role = "partner" | "donor"

export type RegisterForm = {
  name: string
  email: string
  password: string
  roles: Role[]
}

export type User = {
  id: string
  email: string
  name: string
  roles: Role[]
}

export type Permission = {
  permission: string
}

export type PocketbaseRole = {
  role: string
  expand?: {
    permissions?: Permission[]
  }
}

export type PocketbaseUser = {
  id: string
  email: string
  name: string
  expand?: {
    roles: PocketbaseRole[]
  }
}
