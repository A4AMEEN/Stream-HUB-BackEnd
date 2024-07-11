
import { IuserRepository } from "../providers/interfaces/userRepository";
import { UserModel, UserDocument } from "../model/userModel";
import { User } from "../entities/User";
import { hashPassword } from "../utils/validPassword";
//import * as nodemailer from 'nodemailer';
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
// import { User } from "../entities/Admin";
  export class UserRepository implements IuserRepository {
    private transporter: nodemailer.Transporter;
    private _repostitory: any;
    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'testtdemoo11111@gmail.com',
          pass: 'wikvaxsgqyebphvh',
        },
      });
    }
    async userData(email: string): Promise<null | User> {
      try {
        const data = await UserModel.findOne({ email: email }).exec();
        console.log("JWWWT", data);
        if (data) {

          return data as User;
        }
        
      } catch (error) {
        throw new Error("Method not implemented.");
        
      }
      throw new Error("Method not implemented.");
    }
    jwt = async (payload: User) => {
      try {
        console.log("here the jwt ", payload);
        const plainPayload = {
          _id: payload._id,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          password: payload.password,
          isblocked: payload.isblocked,
        };
        console.log("PayLoad",plainPayload);
        
        const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string,{
          expiresIn:'5s',
        });
        console.log("tokkeens",token);
        
        
        
        return token;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    };
    async isAdmin(email: string,password:string): Promise<string | Boolean> {
      try {

        const admin = await UserModel.findOne({ email: email, password: password, role: "admin" });
    if (admin) {
      console.log("User is an Admin:", admin.role);
      return true;
    }
       
       
        return false

        
      } catch (error) {
        throw new Error("Internal Server error");
      }
    }
   
    isUser = async(email: string,password:string):Promise<string|Boolean>=>{
      try {
        const user = await UserModel.find({email:email,password:password});
        console.log("user",user);
        
        if(user.length>0){
          return true
        }
        console.log("Not loged in",user.length);
        
        return false
        
      } catch (error) {
        
        throw new Error("Method not implemented.");
      }
    }
    
    
    

    createUser = async (
      name: string,
      email: string,
      password: string,
    ): Promise<string> => {
      try {
        const user = {
          username: name,
          email: email,
          password: password,
          role: "user",
          isblocked: false,
        };

        const newuser = await UserModel.create(user);
        console.log(newuser, "created");
        return "userCreated";
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    }
  mailExist = async (email: string): Promise<User | boolean> => {
    try {
      const isMailExist = await UserModel.find({ email: email });
      if(isMailExist.length>0){
        console.log("already User",isMailExist);
        return true
        
      }

       
        return false;
      
    } catch (error) {
      throw error;
    }
  };

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'STREAM HUB Authorization Policy Verification',
      text: `Your OTP for verification is: ${otp}`,
    };
    console.log("Mailing Options", mailOptions);
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:',info.response);
      return info
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  } 

  async verifyOtp(otp:number):Promise<string|Boolean>{
    try {

      return true
      
    } catch (error) {
      return false
    }
  }

  async getUserById(userId: string): Promise<any> {
    return UserModel.findById(userId).exec();
  }

  async updateUser(user: any): Promise<void> {
    await UserModel.findByIdAndUpdate(user._id, user).exec();
  }

  async forgotPassword(email: string, newPassword: string): Promise<void> {
    console.log("heellsosod");
    
   
    try {
      const user = await UserModel.findOneAndUpdate({ email }, { password: newPassword });
      console.log("chanegd",user);
      
      if (!user) {
        throw new Error('User not found');
      }

    } catch (error) {
      throw new Error('Error resetting password');
    }
  }


}
