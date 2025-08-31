import * as express from "express"
import IAuthRepository from "../../domain/iauth_repository";
import ITokenervice from "../../services/itoken_service";
import IPasswordService from "../../services/ipassword_service";
import AuthController from "../controllers/auth_controller";
import SignInUseCase from "../../usercases/sign_in_usecase";
import SignUpUseCase from "../../usercases/sign_up_usecase";
import { signInValidationRules, signUpValidationRules, validate } from "../../helpers/validators";
import morgan from "morgan";
import SignOutUseCase from "../../usercases/sign_out_usecase";
import ITokenStore from "../../services/itoken_store";
import TokenValidator from "../../helpers/token_validator";

export default class AuthRouter {
    public static configure(
        authRepository: IAuthRepository,
        tokenService: ITokenervice,
        passwordService: IPasswordService,
        tokenValidator: TokenValidator,
        tokenStore: ITokenStore
    ): express.Router {
        const router = express.Router()
        let controller = AuthRouter.composeController(authRepository, tokenService, passwordService, tokenStore)
        router.post('/signin', signInValidationRules(),
            validate,
            (req: express.Request, res: express.Response) => controller.signIn(req, res))
        router.post('/signup', signUpValidationRules(),
            validate,
            (req: express.Request, res: express.Response) => controller.signUp(req, res))
        router.post('/signout', (req, res, next) => tokenValidator.validate(req, res, next),
            (req: express.Request, res: express.Response) => controller.signout(req, res))
        //! could return an error prone code due to params, if it does, fix it
        return router
    }
    private static composeController(authRepository: IAuthRepository,
        tokenService: ITokenervice,
        passwordService: IPasswordService,
        tokenStore: ITokenStore,
    ): AuthController {
        const signInUseCase = new SignInUseCase(authRepository, passwordService)
        const signUpUseCase = new SignUpUseCase(authRepository, passwordService)
        const signOutUseCase = new SignOutUseCase(tokenStore)
        const controller = new AuthController(signInUseCase, tokenService, signUpUseCase, signOutUseCase)
        return controller
    }
}