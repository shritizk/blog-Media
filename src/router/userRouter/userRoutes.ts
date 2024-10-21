import {Router , Response , Request, text } from 'express';
export const router  = Router();

// hashing 
import { hashSync} from 'bcryptjs';
import { sign} from 'jsonwebtoken';

// otp 
const otpGenerator = require('otp-generator')

// email sender 
import { secretData } from '../../config'; 

//utils 
import { emailSend } from '../../utils/emailsSender';
import { userExist } from '../../utils/userExist';
//.env
import dotenv from 'dotenv';
dotenv.config();

// types 
import { statusCode } from '../../types';

// zod
import {z} from "zod";
const userSchema = z.object({
    email: z.string().email('Invalid email format'),
    fullname: z.string().min(1, 'Fullname is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });


//db 
import {PrismaClient} from '@prisma/client';
import { chnageCredentials } from '../../utils/credentialChnage';
const prisma = new PrismaClient;
// here i am expecting that all the input validation are already done in front end it self 

// function to check if user exist in userDb or not 
// {
//     email?: string ;
//     userId? : number
// }




// login - sighup route
router.post('/sighup',async  function( req : Request, res : Response) {
    const payload = req.body;
    // use data will incude 
    // email 
    // Fullname 
    // password 
    try { 
        // do zod validation 
        if(!userSchema.safeParse(payload)){
            res.status(statusCode.wrongInput).json({
                msg : "wrong input !!" , 
                ReqStatus : false
            })
        }

        // check if user exist in db or not and if not then add else send a error about that 
       const result = await userExist({ email  : payload.email} )
       if(result){ // user already exist 
        res.status(statusCode.alreadyExist).json({
            msg : "user already exist !!" , 
            ReqStatus : false , 
            userEmail : payload.email
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
        res.status(statusCode.ServerError).json({
            msg : "something went wrong !!"
        })
    }
});

// login 
// here i have to add a create table to loginRecord to add sesson for the user 
// also increment in totalLogin in table "LoginCount"
router.get('/login',async function(req,res){
    const payload = req.body;
    // check if user exist or not 
    try{
        const result = await userExist({email : payload.email})
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
                        const time = new Date()
                        const token = sign({
                            email : payload.email , 
                            time
                        }, jsonKey);
                        // send this cookie to loginRecord
                        // id /
                        // date
                        //token
                        await prisma.loginRecord.create({
                            data : {
                                id : result.id , 
                                date : time , 
                                token : token
                            }
                        });
                        
                       res.cookie('auth_token' , token)   
                    }   
                }else{
                    res.status(statusCode.accessDenied).json({
                        msg  : "password is incorrect !!" , 
                        ReqStatus : false 
                    })
                }
            } 
    }catch(e){
        res.status(statusCode.ServerError).json({
            msg : "something went wrong !!"
        })
    }

});
// edit userData router 
// edit data of a user with email to verify  credibility of the source .:::: authed 
// better way to do emailvalidation 
router.post('emailSender',async function(req : Request , res : Response){
    // Id
    // email
    // cause
    const payload = req.body;

    // send email if user exist 
        // check if user exist 
    const userEcxist = await userExist({userId : payload.id});
    
    // if yes 
    if(userEcxist){  
        try{
               
    // generate a otp 
    const otp : number= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets : false });
    const TheString : string     = String(otp) + String({id : payload.id , email : payload.email , cause : payload.cause}) ; 
    const hashedOtp : string = hashSync(TheString ,  String({id : payload.id , email : payload.email , cause : payload.cause}) ) ;
            // send email with the cuase 
        const sendEmail = emailSend({email : payload.email , cause :payload.cause ,otp : hashedOtp } , secretData);
            res.status(statusCode.ok).json({
                msg : "email send ;" , 
                ReqStatus : true , 
                hashedOtp : hashedOtp
            });    
        
            
            
        }catch(e){
            // something went wrong 
            console.log(e);
            res.status(statusCode.ServerError).json({
                msg : "something went wrong !!" ,
                ReqStatus : false
            })
        }
    }
else{
        // send a error if user does not exist 
        res.status(statusCode.accessDenied).json({
            msg : "user do not exist !" , 
            ReqStatus : false
        })
     } 
   
     
        
});

// change credentials 
router.put('chnageCredentials',async function(req : Request , res : Response){
    // body 
     // Id
    // email
    // cause - > pass , email ,FullNmae 
    const payload = req.body;

    //check if user exist 
    const result = await userExist({ userId : payload.Id });

    if(result){
        try {   
            await chnageCredentials(payload);
        }catch(e){
            throw new Error("something  went wong !!")
        }
    }else{
        // send a error if user does not exist 
        res.status(statusCode.accessDenied).json({
            msg : "user do not exist !" , 
            ReqStatus : false
        });
    }

    
})

// delete or disable router 

// make a checker in login to be sure account is not disabled 
// if accoiunt is disabled and not in delted table then enable account 



