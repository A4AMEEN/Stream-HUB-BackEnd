import { Request, Response } from 'express';
import { IuserInteractor } from '../providers/interfaces/userInteractor';
import { User } from '../entities/Admin';
const otpStore: { [email: string]: string } = {};

export class UserController {
  bind(controller: UserController): import("express-serve-static-core").RequestHandler<{}, any, any, import("qs").ParsedQs, Record<string, any>> {
      throw new Error('Method not implemented.');
  }
  private userInteractor: IuserInteractor
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
    

  constructor(private _interactor: IuserInteractor) {
    this.userInteractor = _interactor
  }

  async signup(req: Request, res: Response) {
    console.log("INSIDEEEE");
    
    try {
      const { name, email, password, confirmPassword } = req.body;
      console.log('req body', name);
      if (!req.body) {
        return res
          .status(400)
          .json({ message: "No User Data Provided" });

      }

      const user = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!user.password || !user.email) {
        return res
          .status(400)
          .json({ message: "password or email is required" });

      }
      const isMailExist = await this._interactor.mailExist(user.email)
      console.log('checking', isMailExist);
      if (isMailExist) {
        console.log("email ano",isMailExist);
        
        res.status(400).json({ message: "Mail already Exists please Login" })
      } else {
        //  const otp = this.generateOTP();
        //  console.log("login",otp);
        
        //  const otpSend=await this._interactor.sendOtpEmail(email,otp)
        //  console.log("sendWith",otpSend);
        
        const createUser = await this._interactor.createUser(name, email, password)
        if (!createUser) {
          res.status(400).json({ message: "Error while insertion" })
        }
        res.status(200).json({ message: "User data created!now you can Proceed to login" })
      }

    } catch (error) {
      res.status(400).json({ error });
    }
  }
  
  async login(req:Request,res:Response){
    try {

      const {email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const isUser = await this._interactor.isUser(email,password);
      console.log("isUser",isUser);
      if(!isUser){
        res.status(401).json({message: "Invalid Email and password"})
      }
      
      const idAdmin= await this._interactor.isAdmin(email,password)
      console.log("admeeen",idAdmin);
      
      const userdata=await this._interactor.userData(email);
      console.log("DATA OF",userdata);
      if(userdata){
        if(userdata.isblocked){
          console.log("he is blockked");
          
          return res.status(401).json({message: "This User is Blocked Please contact @Admin"})
        }
      }
      if (!userdata) {
        return res.status(500).json({ message: "Error retrieving user data" });
      }
  
      const token = await this._interactor.jwt(userdata);
      console.log("TOken for front token",token);
      

      if(idAdmin){
        console.log("Admin spotted",idAdmin);
        
        res.status(200).json({message:"Admin",token,userdata});
        
        
      }
      
      
      

        res.status(200).json({message:"Login SuccessFully",token,userdata})
      
    } catch (error) {
      
    }
  }

  async sendOtp(req:Request,res:Response){

    try {
      console.log("get it insiddde");
      
      const email = req.body.email;
      console.log("eemail",email);
      
      const isMailExist=await this._interactor.mailExist(email)
      console.log("MailingExist",isMailExist);
      
      if(!isMailExist){
        return res.status(401).json({Message:"Entered Email is either not valid or Dosent Exists"})
      }
      const otp = this.generateOTP();
      otpStore[email] = otp;
         console.log("login",otp);
         console.log("login",otpStore);
        
         const otpSend=await this._interactor.sendOtpEmail(email,otp)
         console.log("sendWith",otpSend);
         return res.status(200).json({message:"Otp Send Successfully",email,otp})

    } catch (error) {
      
    }
  }
  
  async verify(req: Request, res: Response) {
    console.log("insdddie");
    
    try {
      const { email, otp } = req.body;
      const storedOtp = otpStore[email];
      console.log("from user",email,otp);
      

      if (!storedOtp || storedOtp !== otp) {
        console.log("not doneee");
        
        return res.status(401).json({ message: "Invalid OTP" });
      }
      console.log("successss");
      

      delete otpStore[email]; // Clear OTP after verification
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error verifying OTP", error });
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    const { userId, oldPassword, newPassword } = req.body;
    console.log("id",userId);
    console.log("id",oldPassword);
    console.log("id",newPassword);
    
    try {
      const user = await this._interactor.getUserById(userId);
      console.log("uzer",user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log("uzer",user);
      

      // Compare oldPassword with stored password (assumes passwords are stored as plain text)
      if (user.password !== oldPassword) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }

      // Update password directly (assumes storing passwords as plain text)
      user.password = newPassword;

      await this._interactor.updateUser(user);
      console.log("updated One",user);
      

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log("errer");
      
    }
  };

  async forgotPassword(req: Request, res: Response) {
    const { email, newPassword } = req.body;
    console.log("emailsss",email,newPassword);
    
    try {
      await this._interactor.forgotPassword(email, newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.log("error");
      // Pass error to error handling middleware
    }
  }

  

  
}
