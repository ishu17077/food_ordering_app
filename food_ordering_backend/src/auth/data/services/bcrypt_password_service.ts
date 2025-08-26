import IPasswordService from "../../services/ipassword_service";
import bcrypt from "bcrypt";

export default class BcryptPassworrdService implements IPasswordService {
    constructor(private readonly saltRounds: number = 10) { }
    hash(rawPassword: string): Promise<string> {
        return bcrypt.hash(rawPassword, this.saltRounds)
    }
    compare(rawPassword: string, hash: string): Promise<boolean> {
        return bcrypt.compare(rawPassword, hash)
    }

}