import { User } from "../entities/User";
import { UserModel } from "../model/userModel";
import { CategoryModel } from "../model/categoryModel";
import { IAdminRepository } from "../providers/interfaces/IAdminRepository";
import { Category } from "../entities/category";

export class AdminRepository implements IAdminRepository {
 
    // blockUser(id: string): Promise<{ update: boolean; user: User | null; }> {
    //     throw new Error("Method not implemented.");
    // }
    getUsers = async (): Promise<User[] | null> => {
        try {
          const users = await UserModel.aggregate([
            {
              $match: {
                role: { $ne: "admin" }, // Exclude users with role "Admin"
              },
            },
          ]);
          console.log("userlisttiing",users);
          return users;
          
        } catch (error) {
          console.log("Error fetching users:", error);
          throw error;
        }
      };
      

      
      blockUser = async (id: string): Promise<{ update: boolean; user: User | null }> => {
        try {
            console.log("inside the blockuser repo");
            
          const userDoc = await UserModel.findById(id);
          if (!userDoc) {
            return { update: false, user: null };
          }
          userDoc.isblocked = !userDoc.isblocked;
          await userDoc.save();
          const user = userDoc.toObject() as User; 
          console.log("updated blocking",user);
          
          return { update: true, user };
        } catch (error) {
          console.error("Error toggling user status:", error);
          throw error;
        }
      };

      async getCategories(): Promise<Category[]> {
        try {
          const categories = await CategoryModel.find().lean();
          return categories.map(category => new Category(category.name, category._id.toString()));
        } catch (error) {
          console.error("Error fetching categories:", error);
          throw error;
        }
      }
    
      
      addCategory = async (name: string): Promise<{ success: boolean; message: string }> => {
        try {
          // Check if the category already exists
          const existingCategory = await CategoryModel.findOne({ name });
          if (existingCategory) {
           
            return { success: false, message: "Category already exists" };
          }
    
          // Create new category
          const newCategory = new CategoryModel({ name });
          await newCategory.save();
          console.log("newcateee", newCategory);
    
          return { success: true, message: "Category already exists" };
        } catch (error) {
          console.error("Error adding category:", error);
          throw error;
        }
      };

      async updateCategory(id: string, name: string): Promise<{ success: boolean; message: string }> {
        const existingCategory: Category | null = await CategoryModel.findOne({ name }).lean();
      
        if (existingCategory && existingCategory._id && existingCategory._id.toString() !== id) {
          console.log("exists");
          
          return { success: false, message: "Category already exists" };
        }
        
        console.log("existsNot");
        const updatedCategory: Category | null = await CategoryModel.findByIdAndUpdate(
          id,
          { name },
          { new: true }
        ).lean();
      
        if (!updatedCategory) {
          return { success: false, message: "Category not found" };
        }
      
        return { success: true, message: "Category updated successfully" };
      }

      async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
        console.log("inside DONNEe");
        const deletedCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
          return { success: false, message: 'Category not found' };
        }
        console.log("DONNEe");
        
        return { success: true, message: 'Category deleted successfully' };
      }

     
      
    
}