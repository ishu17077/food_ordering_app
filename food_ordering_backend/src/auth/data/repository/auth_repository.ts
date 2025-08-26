import IAuthRepository from "../../domain/iauth_repository";
import User from "../../domain/user";
import * as mongoose from "mongoose"
import { UserMongo, UserSchema } from "../models/user_mongo";

export default class AuthRepository implements IAuthRepository {
   constructor(private readonly client: mongoose.Mongoose) { }
   public async find(email: string): Promise<User> {
      email = email.toLowerCase();
      const users = this.client.model<UserMongo>('user', UserSchema)
      const user = await users.findOne({ email: email })
      if (!user) {
         return Promise.reject("User not found!")
      }
      return new User(user.id, user.name, user.email, user.password ?? '', user.auth_type)
   }
   public async add(name: string, email: string, auth_type: string, passwordHash?: string): Promise<string> {
      email = email.toLowerCase();
      try {
         const userModel = this.client.model<UserMongo>("user", UserSchema)
         const user = await userModel.findOne({ email: email })
         if (user) {
            return Promise.reject("User already Exist!")
         }

         const savedUser = new userModel({
            auth_type: auth_type,
            email: email,
            name: name,
         })
         if (passwordHash) { savedUser.password = passwordHash }
         await savedUser.save()
         return savedUser.id;
      } catch (error) {
         return Promise.reject("Error: User cannot be created");
      }
   }
}