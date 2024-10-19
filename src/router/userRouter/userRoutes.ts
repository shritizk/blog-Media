import {Router , Response , Request} from 'express';
export const router  = Router();

// hashing 
import {hashSync} from 'bcryptjs';
import { sign} from 'jsonwebtoken';

//.env
import dotenv from 'dotenv';
dotenv.config();

// types 
import { statusCode } from '../../types';

// middleware 
import { loginRecordMiddleWare } from '../../middleware/loginRecordMiddleware';


//db 
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient;
// here i am expecting that all the input validation are already done in front end it self 




// login - sighup route
router.post('/sighup',async  function( req : Request, res : Response) {
    const payload = req.body;
    // use data will incude 
    // email 
    // Fullname 
    // password 
    try { 
        // check if user exist in db or not and if not then add else send a error about that 
       const result = await prisma.user.findUnique({
        where : {
            email : payload.email
        }
       });
       if(result){ // user already exist 
        res.status(statusCode.alreadyExist).json({
            msg : "user already exist !!" , 
            ReqStatus : false , 
            userEmail : result.email
        });
       }else{// user created 

        // hashing of password 
        const HashedPassword = hashSync(payload.password , 10);

         await prisma.user.create({
            data : { 
                email : payload.email , 
                Fullname : payload.Fullname , 
                password : HashedPassword
            }
         });
         res.status(statusCode.userCreated).json({
            msg : "user created !!" ,
            ReqStatus : true 
         })
       }
       
    }catch { 
        res.json({
            msg : "something went wrong !!"
        })
    }
});

// login 
router.get('/login',loginRecordMiddleWare,async function(req,res){
    const payload = req.body;
    // check if user exist or not 
     const result = await prisma.user.findUnique({
    where : {
        email : payload.email
    }
   });
    // if yes then check password else return false 
   
    if(!result){ // user do not exist send error  
        res.status(statusCode.accessDenied).json({
            msg : "user does not exist " , 
            ReqStatus : false 
        });
    }else{ // if user do exist , check for password 
        // create hashed version of the password send by user 
        const  hashVersion = hashSync(payload.password ,10);
        if(hashVersion === result.password){
            
            // create a jason token
            const jsonKey    = process.env.jsonSecretKey;
            if (!jsonKey) {
                res.status(statusCode.ServerError).json({
                    msg: "Server error: JSON secret key is not defined.",
                    ReqStatus: false
                });
            }else{
                const token = sign({
                    email : payload.email
                }, jsonKey);
               res.cookie('auth_token' , token)   
            }   
        }else{
            res.status(statusCode.accessDenied).json({
                msg  : "password is incorrect !!" , 
                ReqStatus : false 
            })
        }
    } 


    


    

});

// edit userData router 

// delete or disable router 


