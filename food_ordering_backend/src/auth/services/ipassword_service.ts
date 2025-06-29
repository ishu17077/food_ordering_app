export default interface IPasswordService {
   hash(rawPassword: string): Promise<string>
   compare(rawPassword: string, hash: string): Promise<boolean>
}