import { Token } from "./TokenType";
interface JWT {

    accessToken(Token): string;
}

export default JWT;