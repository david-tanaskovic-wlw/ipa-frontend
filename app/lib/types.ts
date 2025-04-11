export type LoginForm = {
  user: string;
  password: string;
};

export type Role = "partner" | "donor";

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  roles: Role[];
};


export type User = {
  id: string;
  name: string;
  roles: { role: string }[];
};
