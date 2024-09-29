import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import JWTToken from '../utils/generateToken';
import AdminRepository from '../../repository/adminRepository';
import dotenv from "dotenv";
dotenv.config();

import { AdminData } from '../../usecase/interfaces/admin/IAdminData';
import { ObjectId } from 'mongoose';

interface CustomRequest extends Request {
    admin?: string | ObjectId;
}

interface CustomResponse extends Response {
    admin?: string | ObjectId;
}

const adminRepository = new AdminRepository();
const jwtToken = new JWTToken();

async function createAccessToken(decoded: JwtPayload,req:CustomRequest, res: CustomResponse, next: NextFunction) {
    if (decoded) {
        const admin: AdminData | null = await adminRepository.findAdminbyId(decoded._id as string);

        if (admin) {
            const newAccessToken = jwtToken.accessToken(admin);

            res.cookie('AdminAccessToken', newAccessToken, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'strict',
            });

            req.admin = admin._id;
            next();
           
        } else {
            res.status(401).json('Admin not found');
           
        }
    } else {
        res.status(401).json('Invalid token');
       
    }
}

const protectAdmin = async (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
    let accessToken = req.cookies.AdminAccessToke;
    let refreshToken = req.cookies.AdminRefreshToken;

    const accessSecret = process.env.JWT_ACCESS_KEY;
    const refreshSecret = process.env.JWT_REFRESH_KEY;
    
    //console.log(1234,refreshToken);
    
    if(!refreshToken){
        res.clearCookie('AdminAccessToken');
        res.status(401).json('No token'); 
        return;
    }
    
    if (accessToken) {
        if (accessSecret) {
            try {
                const decoded = jwt.verify(accessToken, accessSecret) as JwtPayload;
                req.admin = decoded._id;
                next();
               
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    console.error('Access token has expired:', error.message);

                    if (refreshToken) {
                        if (refreshSecret) {
                            try {
                                const decoded = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
                                await createAccessToken (decoded, req,res, next);
                               
                            } catch (error) {
                                if (error instanceof TokenExpiredError) {
                                    console.error('Refresh token has expired:', error.expiredAt);
                                    res.status(401).json('Refresh token has expired');
                                    
                                   
                                } else {
                                    console.error('Refresh token verification failed:', error);
                                    res.status(401).json('Invalid refresh token');
                                    
                                   
                                }
                            }
                        } else {
                            res.status(500).json('Missing JWT_REFRESH_KEY environment variable');
                           
                        }
                    } else {
                        res.status(401).json('No refresh token');
                        
                       
                    }
                } else {
                    console.error('Access token verification failed:', error);
                    res.status(401).json('Invalid access token');
                   
                }
            }
        } else {
            res.status(500).json('Missing JWT_ACCESS_KEY environment variable');
           
        }
    } else {
        if (refreshToken) {
            if (refreshSecret) {
                try {
                    const decoded = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
                    await createAccessToken(decoded,req,res, next);
                   
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        console.error('Refresh token has expired:', error.expiredAt);
                        res.status(401).json('Refresh token has expired');
                        
                       
                    } else {
                        console.error('Refresh token verification failed:', error);
                        res.status(401).json('Invalid refresh token');
                        
                       
                    }
                }
            } else {
                res.status(500).json('Missing JWT_REFRESH_KEY environment variable');
               
            }
        } else {
            res.status(401).json('No refresh token');
            
           
        }
    }


   

};

export default protectAdmin;
