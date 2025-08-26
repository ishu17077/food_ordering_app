import ITokenervice from "../../services/itoken_service";
import jwt from "jsonwebtoken"


export default class JwtTokenService implements ITokenervice {
    constructor(private readonly privateKey: string) { }
    encode(payload: object | string): string | object {
        const token = jwt.sign(payload, this.privateKey, {
            issuer: "Srayash_Technologies",
            expiresIn: "1h",
        });
        return token;
    }
    decode(token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.privateKey);
            return decoded;
        } catch (err) {
            return "Invalid Token";
        }
    }

}