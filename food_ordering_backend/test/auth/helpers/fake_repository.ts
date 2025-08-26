import IAuthRepository from "../../../src/auth/domain/iauth_repository";
import User from "../../../src/auth/domain/user";

export default class FakeRepository implements IAuthRepository {
   public users = [{
      email: "nainyMotiBhas@google.com",
      id: "1234",
      name: "Nainy Rani",
      password: "5d41402abc4b2a76b9719d911017c592",
      auth_type: "email"
   }, {
      email: "ishuLegend@suckyCompany.com",
      id: "1214",
      name: "Ishu Legend",
      password: "",
      auth_type: "google"

   }, {
      id: "12333",
      email: "test@gmail.com",
      name: "testMail",
      password: "",
      auth_type: "google"
   }
   ]
   public async find(email: string): Promise<User> {
      const user = this.users.find((x) => x.email == email)
      if (!user) throw Error("User not found!");
      return new User(
         user?.id,
         user?.name,
         user?.email,
         user?.password,
         user?.auth_type
      )
   }
   public async add(name: string, email: string, passwordHash: string, auth_type: string): Promise<string> {
      const max = 9999
      const min = 1000
      //! + is a unary operator which convert any data type to number
      const id = (Math.floor(Math.random() * (+max - +min) + + min)).toString()

      this.users.push({
         email: email,
         id: id,
         password: passwordHash,
         auth_type: auth_type,
         name: name,
      })
      return Promise.resolve(id);
   }

}