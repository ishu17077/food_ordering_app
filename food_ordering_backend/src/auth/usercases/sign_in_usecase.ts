import IAuthRepository from "../domain/iauth_repository";
import IPasswordService from "../services/ipassword_service";

export default class SignInUseCase {
   constructor(private authRepository: IAuthRepository,
      private passwordService: IPasswordService) { }

   public async execute(name: string = '', email: string, auth_type: string, password: string = ''): Promise<string> {
      if (auth_type === 'email') return this.emailLogic(email, password);
      return this.oauthLogin(name, email, auth_type);
   }

   private async emailLogic(email: string, password: string): Promise<string> {
      const user = await this.authRepository.find(email).catch((_) => null);
      if (!user || !(await this.passwordService.compare(password, user.password))) {
         return Promise.reject("Invalid email or password");
      }
      return user.id;
   }
   private async oauthLogin(name: string, email: string, auth_type: string): Promise<string> {
      const user = await this.authRepository.find(email).catch((_) => null);
      if (user && user.auth_type === "email") {
         return Promise.reject("Account already exist, log in with password");
      } else if (user) {
         return user.id;
      }
      const userId = await this.authRepository.add(name, email, "google", undefined)
      return userId;
   }
}