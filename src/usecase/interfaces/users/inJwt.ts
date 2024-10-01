import { Token } from "./TokenType";
interface JWT {

    accessToken(Token:any): string;
}

export default JWT;