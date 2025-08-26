import mongoose from "mongoose"
import AuthRepository from "../../../../src/auth/data/repository/auth_repository"
import dotenv from "dotenv"
import { expect } from "chai"
import { UserMongo, UserSchema } from "../../../../src/auth/data/models/user_mongo"
import { after } from "mocha"


dotenv.config()
describe("AuthRepository", () => {
   let client: mongoose.Mongoose
   let sut: AuthRepository
   let randomNumber: number

   before(() => {
      client = new mongoose.Mongoose
      //? Connecting the client :)
      const mongoUrl = encodeURI(((process.env.DB_URL) ?? 'mongodb://localhost:27017') as string)
      client.connect(mongoUrl, {
         dbName: "food_ordering"
      })

      sut = new AuthRepository(client)
   })


   beforeEach(() => {
      //? Generate a new random number before test so can give different identity to each email 
      randomNumber = Math.floor((Math.random() * 10000 + 1))
   })


   it("should return user when email is found", async () => {
      //? Mock Data Inserted into MongoDB 
      //! Local Data Not remote data
      const email = "test@mail.orgy"
      const password = "passOrgy"

      //? Get
      const result = await sut.find(email)
      //? check or assert
      expect(result).to.not.be.empty
   })

   it("should return user id when user is added to db", async () => {

      //? Mock Data Inserted into MongoDB 
      //! Local Data Not remote data
      const user = {
         email: `test${randomNumber}@mail.orgy`,
         password: `password${randomNumber}`,
         auth_type: "email",
         name: "Test User",
      }
      //? Get
      const result = await sut.add(user.name, user.email, user.auth_type, user.password)
      //? check or assert
      expect(result).to.not.be.empty
      //? Delete the test user after test
      await client.model<UserMongo>("users", UserSchema).deleteOne({ email: `test${randomNumber}@mail.orgy` })
   })


   after(() => {
      client.disconnect()
   })
})