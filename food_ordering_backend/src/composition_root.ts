import mongoose from "mongoose";
import AuthRepository from "./auth/data/repository/auth_repository";
import JwtTokenService from "./auth/data/services/jwt_token_service";
import BcryptPassworrdService from "./auth/data/services/bcrypt_password_service";
import AuthRouter from "./auth/entrypoint/routers/auth_router";
import redis from "redis"
import { createClient } from "redis";
import RedisTokenStore from "./auth/data/services/redis_token_store";
import TokenValidator from "./auth/helpers/token_validator";

export default class CompositionRoot {
    private static client: mongoose.Mongoose
    private static redisClient: redis.RedisClientType

    public static async configure() {
        this.client = new mongoose.Mongoose()
        this.redisClient = createClient()
        this.redisClient.on("error", (err) => console.log("Redis Client Error", err))
        await this.redisClient.connect()
        const connectionStr = encodeURI(process.env.DB_URL ?? "mongodb://localhost:27017")
        await this.client.connect(connectionStr, {
            dbName: "food_ordering"
        })
    }

    public static authRouter() {
        const repository = new AuthRepository(this.client)
        const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string ?? '')
        const passwordService = new BcryptPassworrdService()
        const tokenStore = new RedisTokenStore(this.redisClient)
        const tokenValidator = new TokenValidator(tokenService, tokenStore)

        return AuthRouter.configure(repository, tokenService, passwordService, tokenValidator, tokenStore)
    }
}