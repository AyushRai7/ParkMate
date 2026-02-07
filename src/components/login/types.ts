export type Role =  "OWNER" | "USER";
export type Mode = "login" | "signup";

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export interface RoleConfig {
  color: string;
  bgActive: string;
  subtitle: string;
}