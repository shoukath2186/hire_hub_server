import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import JWTToken from '../utils/generateToken';
import { AuthToken } from '../../usecase/interfaces/users/IUserTokenData';

import UserRepository from '../../repository/userRepository';
const userRepository = new UserRepository()

interface CustomRequest extends Request {
    user?: string | ObjectId;
}

interface CustomResponse extends Response {
    user?: string | ObjectId;
}

const jwtToken = new JWTToken();

async function createAccessToken(decoded: JwtPayload, req: CustomRequest, res: CustomResponse, next: NextFunction) {
    if (decoded) {
        const user: AuthToken | any = await userRepository.FindbyIdforAccessToken(decoded._id as string);


        if (user) {

            const newAccessToken = jwtToken.accessToken(user);
            
            // console.log(1212,newAccessToken);
            
            
             res.cookie('accessToken', newAccessToken,{
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000,
                secure: true, 
                sameSite: 'strict',
            });

            req.user = user._id;
            next();

        } else {
           
            res.status(414).json('user not found');

        }
    } else {
      
        res.status(414).json('Invalid token');

    }
}

async function ProtectRouter(req: CustomRequest, res: CustomResponse, next: NextFunction) {

    let accessToken = req.cookies.accessToken;
    let refreshToken = req.cookies.refreshToken;

  
    const accessSecret = process.env.JWT_ACCESS_KEY;
    const refreshSecret = process.env.JWT_REFRESH_KEY;

    if(!refreshToken){
        res.clearCookie('accessToken');
      
        res.status(414).json('No User token'); 
        return;
    }

    if (accessToken) {
        if (accessSecret) {

            try {
                const data = jwt.verify(accessToken, accessSecret) as JwtPayload;
                
                
                let id = data._id
                const block = await userRepository.checkUserBlock(id);
                if (block) {
                  
                    res.status(414).json('User is Blocked.');
                } else {
                    req.user = id
                    next()
                }
               
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    // console.error('Access token has expired:', error.message);

                    if (refreshToken && refreshSecret) {
                       
                        try {
                            const data = jwt.verify(refreshToken, refreshSecret) as JwtPayload
                            
                            let id = data._id
                            const block = await userRepository.checkUserBlock(id);
                            if (block) {
                               
                                res.status(414).json('User is Blocked.');
                            } else {
                                req.user = id
                                
                                await createAccessToken(data, req, res, next);  
                                
                            }
                        } catch (error) {

                            res.clearCookie('accessToken');
                            
                            res.status(414).json('User Unauthorized');

                        }

                    } else {
                        res.clearCookie('accessToken');
                      
                        res.status(414).json( 'User Unauthorized' );
                    }
                }

            }
        }
    } else {
        if (refreshToken && refreshSecret) {
            try {
                const data = jwt.verify(refreshToken, refreshSecret) as JwtPayload
                let id = data._id

                const block = await userRepository.checkUserBlock(id);

                if (block) {
                   
                    res.status(414).json('User is Blocked.');
                } else {
                    req.user = id
                    await createAccessToken(data, req, res, next);

                }
            } catch (error) {

                res.clearCookie('accessToken');
                
                res.status(414).json('User Unauthorized');

            }
           
        } else {
            res.clearCookie('accessToken');
            
            res.status(414).json('User Unauthorized');
        }

    }
}
export default ProtectRouter;