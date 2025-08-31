import { Request, Response, NextFunction } from "express";
import ITokenervice from "../services/itoken_service";
import ITokenStore from "../services/itoken_store";

export default class TokenValidator {
    constructor(private readonly tokenService: ITokenervice,
        private readonly tokenStore: ITokenStore
    ) { }

    public async validate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization required" })
        }
        if (this.tokenService.decode(authHeader) === '' || (await this.tokenStore.get(authHeader)) != '') {
            return res.status(403).json({ "error": "Invalid token!!" })
        }
        next()
    }
}