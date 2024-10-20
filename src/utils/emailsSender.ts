

// email sender 
const nodemailer = require("nodemailer");
import { secretData } from "../config"; 

//types
import { secretDataType } from "../types";
import { emailSender } from "../types";

// email : String  ; 
// text : String  ;

export async function emailSend(prop : emailSender ,secretData : secretDataType ){

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: `${secretData.email}`,
          pass: `${secretData.password}`,
        },
      });
      

    try {
        const info = await transporter.sendMail({
        from: `${secretData.email}`, // sender address
        to: `${prop.email}`, // list of receivers
        subject: "One Time Password", // Subject line
        text: `${prop.text}` // plain text body
        });
        return true
        

    }catch(e){
        console.log(e)
        throw new Error("something went wrong while sending email!!")

    }
      
};