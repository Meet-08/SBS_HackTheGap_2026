export type Role = "USER" | "ADMIN";

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  pinCode: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
