import User from "./user";

export default interface IAuthRepository {
   find(email: string): Promise<User>
   add(name: string, email: string, auth_type: string, passwordHash?: string): Promise<string>
}