import ITokenervice from "../../services/itoken_service"
import SignInUseCase from "../../usercases/sign_in_usecase"
import * as express from "express"
import SignUpUseCase from "../../usercases/sign_up_usecase"

export default class AuthController {
    private readonly signInUseCase: SignInUseCase
    private readonly tokenService: ITokenervice
    private readonly signUpUseCase: SignUpUseCase
    constructor(signInUseCase: SignInUseCase, tokenService: ITokenervice, signUpUseCase: SignUpUseCase) {
        this.signInUseCase = signInUseCase
        this.tokenService = tokenService
        this.signUpUseCase = signUpUseCase
    }
    public async signIn(req: express.Request, res: express.Response) {
        try {
            const { name, email, password, auth_type } = req.body
            return this.signInUseCase.execute(name, email, auth_type, password).then((id: string) =>
                res.status(200).json({ auth_token: this.tokenService.encode({ "id": id, "email": email, "password": password }) })
            ).catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }

    public async signUp(req: express.Request, res: express.Response) {
        try {
            const { name, email, password, auth_type } = req.body
            return this.signUpUseCase.execute(email, auth_type, password, name).then((id: string) =>
                res.status(200).json({ auth_token: this.tokenService.encode({ "id": id, "email": email, "password": password }) })
            ).catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }

}