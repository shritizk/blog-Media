import {Router , Response , Request, text } from 'express';
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



router.post('emailSender',async function(req : Request , res : Response){
   try{
    // email 
    // id 
    // cause 
        // cause can be 
            //password 
            // email 
            // general - in our db Fullname
    const payload = req.body;
    // first check if user exist or not 
    const result = await userExist({ userId : payload.Id });

    // create a otp  and send to otp 
    // userId Int
    // otp Int
    // time DateTime
    const time = new Date();
    const otp : number= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false , lowerCaseAlphabets : false });
    await prisma.otpstore.create({
        data : {
            id : payload.userId ,
            otp : otp , 
            time : time            
        }
    });
    // cause we need to check  for the text
    if(payload.cause === "email"){
        const someText = "otp for email"
    }else if (payload.cause === "password"){
        const text = "otp for password "
    }
    if(result ){
        
        const sendEmail = emailSend({email : payload.email , cause :payload.cause ,otp : otp } , secretData);
        // check if email is send or not If not then res with error and remove otp from db 
        if(!sendEmail){
            await prisma.otpstore.delete({
                where : {
                    id : payload.userid
                }
            })
        }else{
            res.status(statusCode.ok).json({
                msg : "send otp" , 
                ReqStatus : true
            });
        }
    }else{
        res.status(statusCode.accessDenied).json({
            msg : "user does not exit " , 
            ReqStatus : false
        });
    }
   }catch(e){
    res.status(statusCode.ServerError).json({
        msg : "something went wrong !!"
    })

   }
});

// route to check otp 
router.delete('checkOtp',async function(req : Request , res : Response ){
    try { 
            // otp , id , cause 
    const payload = req.body;
    // if otp is correct it will delete  
    const result = await prisma.otpstore.findUnique({
        where : {
             id : payload.userId , 
             otp : payload.otp
        }
    });

    
    if(result){
        
        // in frontend show screen based on cause 
        res.status(statusCode.ok).json({
            msg : " verification done !!" , 
            ReqStatus : true , 
            cause : payload.cause
        });
        await prisma.otpstore.delete({
            where : {
                 id : payload.id , 
                 otp  :payload
            }
        });
    }else{
        await prisma.otpstore.delete({
            where : {
                 id : payload.id , 
                 otp  :payload
            }
        });
        res.status(statusCode.accessDenied).json({
            msg : "wrong otp" , 
            ReqStaus : false 
        });
    };
    }catch(e){
        res.status(statusCode.ServerError).json({
            msg : "something went wrong !!"
        })
    }
}); 

// to update data of user 
 router.put('changeCredentials',async function(req : Request , res : Response){
    try {
    // cause 
    // to be changed     
    const payload = req.body;
    
    // check what is cause 
    // email
    //password
    // credentials 
    if(payload.cause === 'email'){
        try {
            await prisma.user.update({
                where : {
                    id : payload.id
                } , data : {
                    email : payload.email
                }
            });
        }catch(e){
            res.status(statusCode.ServerError).json({msg : "due to some Error , email can not be changed write now !!" , ReqStatus : false});  
        }
    }
    else if(payload.cause === 'password'){
        try{
            const password = hashSync(payload.password , 10);
            await prisma.user.update({
                where : {
                    id : payload.id
                } , data : {
                    password : password
                }
            });
        }catch(e){
            res.status(statusCode.ServerError).json({msg : "due to some Error password can not be changed !!" , ReqStatus : false});
        }
    }
    else if(payload.cause === 'credentials'){
//id      Int
//email   String   
//Fullname    String 
//password String 
        try {
            await prisma.user.update({
                where : {
                    id : payload.id
                } , data : {
                     Fullname : payload.Fullname 
                }
            });
        }catch(e){
            res.status(statusCode.ServerError).json({msg : "due to some Error credentials can not be changed !!" , ReqStatus : false});  
        }
    }
    else {
        res.status(statusCode.wrongInput).json({
            msg : "wrong input given!!" , 
            ReqStatus : false
        });
    }

    
    const userCheck = await userExist({ userId : payload.id});
    }
    catch(e){
        res.status(statusCode.ServerError).json({
            msg : "something went wrong !!"
        })
    }
 });    


// delete or disable router 


