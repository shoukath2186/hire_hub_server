import jwt from "jsonwebtoken";
import JWT from "../../usecase/interfaces/users/inJwt";
import { Token } from "../../usecase/interfaces/users/TokenType";
import dotenv from "dotenv";
dotenv.config();

class JWTToken implements JWT {

  accessToken(userData:Token): string {
    const SECRETKEY = process.env.JWT_ACCESS_KEY;
    
    if (SECRETKEY) {

      const payload = {
        _id: userData._id.toString(), 
        user_role: userData.user_role,
      };

      
      const token = jwt.sign(payload, SECRETKEY, { 
        expiresIn: '15m'
      });
      
      return token;
    }
    throw new Error("JWT key is not defined!");
  }
  refreshToken(userData:Token): string{
    const SECRETKEY = process.env.JWT_REFRESH_KEY;

    if (SECRETKEY) {

      const payload = {
        _id: userData._id.toString(), 
        user_role: userData.user_role,
      };

      const token = jwt.sign(payload, SECRETKEY, { 
        expiresIn: '10d'
      });
      return token;
    }
    throw new Error("JWT key is not defined!");
  }
}

export default JWTToken;