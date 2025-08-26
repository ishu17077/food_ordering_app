export default interface ITokenervice {
   encode(payload: string | object): string | object
   decode(token: string | object): string | object
}