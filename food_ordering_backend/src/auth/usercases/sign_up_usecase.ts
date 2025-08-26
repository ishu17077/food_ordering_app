import IAuthRepository from "../domain/iauth_repository";
import User from "../domain/user";
import IPasswordService from "../services/ipassword_service";

export default class SignUpUseCase {
    constructor(private readonly authRepository: IAuthRepository,
        private readonly passwordService: IPasswordService
    ) { }

    public async execute(
        email: string,
        auth_type: string,
        password: string,
        name: string,
    ): Promise<string> {
        const user = await this.authRepository.find(email).catch((_) => null)
        if (user) return Promise.reject("User already exist!")
        //! take care if hash password is not null
        const userId = this.authRepository.add(name, email, auth_type, await this.passwordService.hash(password))
        return userId
    }
}