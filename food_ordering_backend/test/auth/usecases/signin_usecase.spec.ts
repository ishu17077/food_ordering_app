import { expect } from 'chai'
import * as chai from 'chai'
import SignInUseCase from '../../../src/auth/usercases/sign_in_usecase'
import IAuthRepository from '../../../src/auth/domain/iauth_repository'
import IPasswordService from '../../../src/auth/services/ipassword_service'
import User from '../../../src/auth/domain/user'
import FakeRepository from '../helpers/fake_repository'
import FakePasswordService from '../helpers/fake_password_service'
import { it } from 'mocha'
import chaiAsPromised from 'chai-as-promised'


chai.use(chaiAsPromised)
describe('SignInUseCase', () => {

   let sut: SignInUseCase
   let authRepository: IAuthRepository

   let passwordService: IPasswordService

   const user0 = {
      email: "nainyMotiBhas@google.com",
      id: "1234",
      name: "Nainy Rani",
      password: "5d41402abc4b2a76b9719d911017c592",
      type: "email"
   }
   const user1 = {
      email: "ishuLegend@suckyCompany.com",
      id: "1214",
      name: "Nainy Rani",
      password: "",
      type: "google"
   }


   beforeEach(() => {
      authRepository = new FakeRepository()
      passwordService = new FakePasswordService()
      sut = new SignInUseCase(authRepository, passwordService)
   })


   it('Should throw and error, when user is not found', async () => {
      const user = {
         email: "wrongEmail@ds.com",
         password: "1234"
      }
      //? assert
      await expect(sut.execute(user.email, user.password)).to.be.rejectedWith("User not found!")
   })

   it("Should return a user id if email and passowrd are correct", async () => {
      const id = await sut.execute(user0.email, user0.password);
      expect(id).to.be.equal(user0.id)
   })
   it("Should return a user id if auth_type is google without password", async () => {
      const id = await sut.execute(user1.email, user1.password);
      expect(id).to.be.equal(user1.id)
   })
   it("Should return Error if password is incorrect", async () => {
      let id: Promise<string>
      id = sut.execute(user0.email, 'sadsad')
      await expect(id).to.be.rejectedWith("Invalid Email or Password")
   })
})