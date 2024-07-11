import { Category } from "../../entities/category";
import { User } from "../../entities/User";

export interface IAdminRepository {
  getCategories(): Promise<Category[]>;
  addCategory(name: string): Promise<{ success: boolean; message: string }>;  
  getUsers(): Promise<User[] | null>;
  blockUser(id: string): Promise<{update:boolean,user:User|null}>;
  updateCategory(id: string, name: string): Promise<{ success: boolean; message: string }>; 
  deleteCategory(id: string): Promise<{ success: boolean; message: string }>;

}