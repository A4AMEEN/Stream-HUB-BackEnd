import { User } from "../../entities/Admin"
import { UserDocument } from "../../model/userModel"

export interface IuserInteractor{
    isAdmin(email: string,password:string):Promise<string|Boolean>
    isUser(email: string,password:string): Promise<string|Boolean>
    jwt(payload: User): string | Promise<string>;
    mailExist(email:string):Promise<User|boolean>;
    userData(email:string):Promise<User|null>;
    createUser(name:string,email:string,password:string,isblocked?: boolean):Promise<string>
    sendOtpEmail(email: string, otp: string): Promise<void>;
    verifyOtp(otp:number):Promise<string|Boolean>
    getUserById(userId: string): Promise<any>;
    updateUser(user: any): Promise<void>;
    forgotPassword(email: string, newPassword: string): Promise<void>;
}
