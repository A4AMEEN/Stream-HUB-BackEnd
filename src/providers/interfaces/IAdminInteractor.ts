import { User } from "../../entities/User";
import { Category } from "../../entities/category";

export interface IAdminInteractor {
  getCategories(): Promise<Category[]>;
  addCategory(name: string): Promise<{ success: boolean; message: string }>;
  getUsers(): Promise<User[] | null>;
  blockUser(id: string): Promise<{update:boolean,user:User|null}>;
  updateCategory(id: string, name: string): Promise<{ success: boolean; message: string }>; 
  deleteCategory(id: string): Promise<{ success: boolean; message: string }>;



}