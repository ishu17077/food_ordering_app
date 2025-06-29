import IAuthRepository from "../domain/iauth_repository";
import IPasswordService from "../services/ipassword_service";

export default class SignInUseCase {
   constructor(private authRepository: IAuthRepository,
      private passwordService: IPasswordService) { }

   public async execute(email: string, password: string): Promise<string> {
      const user = await this.authRepository.find(email);
      if (user.password === '' && user && user.auth_type == "google") {
         return user.id;
      }
      if (!await this.passwordService.compare(password, user.password)){
         return Promise.reject("Invalid Email or Password");
      }

      return user.id;
   }
}