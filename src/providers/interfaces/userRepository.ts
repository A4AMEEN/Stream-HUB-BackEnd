// import  {userSchema}  from '../../model/userModel';
// import { User } from '../../entities/User';

import { User } from "../../entities/Admin"

// class UserRepository {
//   async createUser(user: User): Promise<User> {
//     const newUser = new userSchema(user);
//     return await newUser.save();
//   }

//   async findUserByEmail(email: string): Promise<User | null> {
//     return await userSchema.findOne({ email }).exec();
//   }
 
// }

// export default new UserRepository();
export interface IuserRepository{
    verifyOtp(otp: number): string | Boolean | PromiseLike<string | Boolean>;
    jwt(payload: User): string | Promise<string>;
    isAdmin(email: string,password:string):Promise<string|Boolean>;
    isUser(email: string,password:string):Promise<string|Boolean>
    mailExist(email:string):Promise<User|boolean>
    userData(email:string):Promise<User|null>
    createUser(name:string,email:string,password:string):Promise<string>
    sendOtpEmail(email: string, otp: string): Promise<void>;
    verifyOtp(otp:number):Promise<string|Boolean>
    getUserById(userId: string): Promise<any>;
  updateUser(user: any): Promise<void>;
  forgotPassword(email: string, newPassword: string): Promise<void>;
}
