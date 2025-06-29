import 'mocha'
import chai, { expect } from 'chai'
import SignInUseCase from '../../../src/auth/usercases/sign_in_usecase'
import IAuthRepository from '../../../src/auth/domain/iauth_repository'
import IPasswordService from '../../../src/auth/services/ipassword_service'
import User from '../../../src/auth/domain/user'

describe('SignInUseCase', () => {
   let sut: SignInUseCase
   let authRepository: IAuthRepository

   let passwordService: IPasswordService

   const user = {
      email: "nainyMotiBhas@"
   }


})