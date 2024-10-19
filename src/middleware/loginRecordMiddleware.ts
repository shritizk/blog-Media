import {NextFunction , Response , Request} from 'express';

//prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;

// types
import { statusCode } from '../types'; 

// This function is the middleware that will check if email and token is already in db "loginRecord"
// if user already in here then it will res with a error 
export async  function loginRecordMiddleWare(req : Request , res : Response , next : NextFunction) : Promise<void>{
    const payload = req.body;
    // check if this email is in db and have a token with it , if yes then remove and send a error else next.
    
    const result = await prisma.loginRecord.findUnique({
        where : {
            email : payload.email
        }
    });
    
    // if ans is true then send a error 
    if(result){
        
        //del from db 
        await prisma.loginRecord.delete({
            where : {
                email : payload.email
            }
        });

        res.status(statusCode.accessDenied).json({
            msg : "already logged in !!" , 
            ReqStatus : false
        });

    }else { 
        next()
    }
}

// this will check if user is logged in or not in the db 
// so that if its not then it will send a error in front end with a res error 404 and redirect user to login page 
export async  function loginCheckWhileAuth(req : Request , res : Response , next : NextFunction){
    const payload = req.body;
    // if yes then send a positive else send a error 

    const result = await prisma.loginRecord.findUnique({
        where : {
            email : payload.email
        }
    });

    //if the result is true then continue else send a error 
    if(result){
        next();
    }else { 
        return res.status(statusCode.accessDenied).json({
            msg : "user not logged in !", 
            ReqStatus  : false
        });
    }
}