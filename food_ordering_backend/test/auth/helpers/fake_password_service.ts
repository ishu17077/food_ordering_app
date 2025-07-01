import IPasswordService from "../../../src/auth/services/ipassword_service";

export default class FakePasswordService implements IPasswordService {
   public async hash(rawPassword: string): Promise<string> {
      return rawPassword;
   }
   public async compare(rawPassword: string, hash: string): Promise<boolean> {
      return rawPassword == hash;
   }

}