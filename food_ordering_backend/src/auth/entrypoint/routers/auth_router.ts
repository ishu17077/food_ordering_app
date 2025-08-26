import * as express from "express"
import IAuthRepository from "../../domain/iauth_repository";
import ITokenervice from "../../services/itoken_service";
import IPasswordService from "../../services/ipassword_service";
import AuthController from "../controllers/auth_controller";
import SignInUseCase from "../../usercases/sign_in_usecase";
import SignUpUseCase from "../../usercases/sign_up_usecase";
import { signInValidationRules, signUpValidationRules, validate } from "../../helpers/validators";
import morgan from "morgan";

export default class AuthRouter {
    public static configure(authRepository: IAuthRepository,
        tokenService: ITokenervice,
        passwordService: IPasswordService): express.Router {
        const router = express.Router()
        let controller = AuthRouter.composeController(authRepository, tokenService, passwordService)
        router.use(morgan("combined"))
        router.post('/signin', signInValidationRules(), validate, (req: express.Request, res: express.Response) => controller.signIn(req, res))
        router.post('/signup', signUpValidationRules(), validate, (req: express.Request, res: express.Response) => controller.signUp(req, res))
        return router
    }
    private static composeController(authRepository: IAuthRepository,
        tokenService: ITokenervice,
        passwordService: IPasswordService): AuthController {
        const signInUseCase = new SignInUseCase(authRepository, passwordService)
        const signUpUseCase = new SignUpUseCase(authRepository, passwordService)
        const controller = new AuthController(signInUseCase, tokenService, signUpUseCase)
        return controller
    }
}