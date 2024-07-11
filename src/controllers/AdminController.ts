import { Request, Response, NextFunction } from "express";
import { IAdminInteractor } from "../providers/interfaces/IAdminInteractor";
import { CategoryResponse } from "../entities/category";
export class AdminController {
    private _interactor: IAdminInteractor;
   
    
    
    
    
    constructor(interactor: IAdminInteractor) {
      this._interactor = interactor;
    }
    getUsers = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("It come insdie the get suers");
        
        const users = await this._interactor.getUsers();
        if (users) {
          return res.status(200).json({ message: "Successfully get all the users", users });
        }
        console.log("users", users);
      } catch (error) {
        next(error);
      }
    };
    

    onBlockUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("id is", req.params.id);
        const status = await this._interactor.blockUser(req.params.id);
       
        if (status.update) {
          console.log("success");
          res
            .status(200)
            .json({ message: "Successfully Updated",updated:status.update,id:status.user?._id });
        } else {
          res
            .status(400)
            .json({ message: "Error toggling user status" });
        }
      } catch (error) {
        next(error);
      }
    };

   

    getCategory = async (req: Request, res: Response, next: NextFunction) => {
      console.log("get i n hereee");
      try {
        const categories = await this._interactor.getCategories();
        console.log("catttee",categories)
        res.status(200).json(categories);
      } catch (error) {
        next(error);
      }
    };

    addCategory = async (req: Request, res: Response) => {
      try {
        const { name } = req.body;
        const result = await this._interactor.addCategory(name);
        if (result.success) {
          console.log("scess",result.success);
          
          return res.status(201).json({ message: result.message });
        } else {
          return res.status(400).json({ message: result.message });
        }
      } catch (error) {
        console.error("Error in controller while adding category:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    };

    updateCategory = async (req: Request, res: Response) => {
      console.log("upIn");
      
      try {
        const {name } = req.body;
        const { id } = req.params;
        console.log("namaas",id,name);
        
        const result = await this._interactor.updateCategory(id, name);
        if (result.success) {
          return res.status(200).json({ message: result.message });
        } else {
          return res.status(400).json({ message: result.message });
        }
      } catch (error) {
        console.error("Error in controller while updating category:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    };

    deleteCategory = async (req: Request, res: Response) => {
      try {
        const categoryId = req.params.id;
        const result = await this._interactor.deleteCategory(categoryId);
        if (result.success) {
          return res.status(200).json({ message: result.message });
        } else {
          return res.status(400).json({ message: result.message });
        }
      } catch (error) {
        console.error('Error in controller while deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    

   
    
}