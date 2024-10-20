import {Router , Response , Request } from 'express';
export const router  = Router();

// hashing 
import {hashSync} from 'bcryptjs';
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
import { emailSender, Result, secretDataType, statusCode, userEcxist } from '../../types';

// middleware 


//db 
import {PrismaClient, user} from '@prisma/client';
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
        res.json({
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
        const result = await userExist({userId : payload.userId})
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
                        await prisma.loginRecord.create({
                            data : {
                                date : time , 
                                userId  : result.id , 
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
        console.log(e)
    }

});



// edit userData router 
// edit data of a user with email to verify  credibility of the source .:::: authed 



router.post('credentialChnager',async function(req : Request , res : Response){
    const payload = req.body;
    // first check if user exist or not 
    const result = await userExist({ userId : payload.userId });

    // create a otp  and send to otp 
    // userId Int
    // otp Int
    // time DateTime
    const time = new Date();
    const otp : number= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets : false });
    const OtpState = await prisma.otpstore.create({
        data : {
            userId : payload.userId ,
            otp : otp , 
            time : time            
        }
    });

    if(result ){
        const sendEmail = emailSend(payload , secretData);
        // check if email is send or not If not then res with error and remove otp from db 
        if(!sendEmail){
            await prisma.otpstore.delete({
                where : {
                    id : OtpState.id
                }
            })
        }
    }else{

    }
});

// delete or disable router 


