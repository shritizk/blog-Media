// node mailer 
import { transporter } from './config';
import { statusCode } from './types';


// prima
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;


// types
type data =  {
  email : string ; 
  cause : "Password Chnage" | "change email" | "change credentials"  ; 
}


// otp genrator 
function generateOTP() { 
  let digits = '0123456789'; 
  let OTP = ''; 
  let len = digits.length 
  for (let i = 0; i < 4; i++) { 
      OTP += digits[Math.floor(Math.random() * len)]; 
  } 
   
  return OTP; 
} 


export async function emailSender(data : data){
  try{
    let textToBeSend : string ; 
    // genrate a opt 
    const otp = generateOTP();
  //   genrate a text to send based on the otp 
    
  if(data.cause ==="Password Chnage" ){
    textToBeSend = `Otp to change password is ${otp}`
    }else if(data.cause ===  "change email" ) {
       textToBeSend = `Otp to change email is ${otp}`
    }else if(data.cause ===  "change credentials") {
    textToBeSend = `Otp to change credentials is ${otp}`
    }else {
       return {
        msg : "wrong input" , 
        status : statusCode.wrongInput 
       }
    };

    // save send otp with user data in a db to be checked after 


    await transporter.sendMail({
        from: "shritizkumar" , 
        to: `${data.email}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: textToBeSend// plain text body
        
      });
  }catch(e){
    console.log(e);
  }
}