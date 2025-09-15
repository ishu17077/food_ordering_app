import ITokenervice from "../../services/itoken_service"
import SignInUseCase from "../../usercases/sign_in_usecase"
import * as express from "express"
import SignUpUseCase from "../../usercases/sign_up_usecase"
import SignOutUseCase from "../../usercases/sign_out_usecase"

export default class AuthController {
    private readonly signInUseCase: SignInUseCase
    private readonly tokenService: ITokenervice
    private readonly signUpUseCase: SignUpUseCase
    private readonly signOutUseCase: SignOutUseCase
    constructor(signInUseCase: SignInUseCase, tokenService: ITokenervice, signUpUseCase: SignUpUseCase, signOutUseCase: SignOutUseCase) {
        this.signInUseCase = signInUseCase
        this.tokenService = tokenService
        this.signUpUseCase = signUpUseCase
        this.signOutUseCase = signOutUseCase
    }
    public async signIn(req: express.Request, res: express.Response) {
        try {
            const { name, email, password, auth_type } = req.body

            return this.signInUseCase.execute(name, email, auth_type, password).then((id: string) => {
                console.log(`Sign In ${name} ${email} ${password} ${auth_type}`)
                return res.status(200).json({ auth_token: this.tokenService.encode({ "id": id, "email": email, "password": password }) })
            }
            ).catch((err) => {
                return res.status(401).json({ error: err })
            })
        } catch (err) {
            return res.status(400).json({ "error": err })
        }
    }

    public async signUp(req: express.Request, res: express.Response) {
        try {
            const { name, email, password, auth_type } = req.body
            console.log(`Sign Up ${name} ${email} ${password} ${auth_type}`)
            return this.signUpUseCase.execute(email, auth_type, password, name).then((id: string) =>
                res.status(200).json({ auth_token: this.tokenService.encode({ "id": id, "email": email, "password": password }) })
            ).catch((err) => res.status(400).json({ error: err }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }

    public async signout(req: express.Request, res: express.Response) {
        try {
            const token = req.headers.authorization!
            return this.signOutUseCase.execute(token)
                .then((result) => res.status(200).json({ "message": result }))
                .catch((err) => res.status(404).json({ error: err }))
        } catch (err) {
            return res.status(400).json({ error: err }).send()
        }
    }
}