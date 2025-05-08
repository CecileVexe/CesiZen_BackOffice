import { RoleType } from "./role";

export interface UserType {
    id: string;
    name: string;
    email: string;
    surname: string;
    password: string;
    role: RoleType
    roleId: string
  }

export interface UserAddType
 {
  data: UserType,
  message: string
 }  
export interface UsersType {
    data: UserType[];
    message: string
    total: number;
  }