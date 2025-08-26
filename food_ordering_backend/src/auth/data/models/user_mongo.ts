import * as mongoose from "mongoose";
export interface UserMongo extends mongoose.Document {
   auth_type: string,
   name: string,
   email: string,
   password?: string
}

export const UserSchema = new mongoose.Schema({
   auth_type: { type: String, required: true },
   name: String,
   email: { type: String, required: true },
   password: String,
})