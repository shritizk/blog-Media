// types
import { chnageCredentialsProp } from "../types";


// bycrypt
import { hashSync } from "bcryptjs";

// prisma 
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;

// function to change credentials 
export async function chnageCredentials(prop : chnageCredentialsProp){
    if(prop.cause === "pass"){

        // if right new data is provided or not 
        if (!prop.newData.password) {
            throw new Error("Password is required for updating.");
        }
        
        // Hashing the password
        const hashedPassword: string = hashSync(prop.newData.password, 10);
        

        try {
            // chnage password
            await prisma.user.update({
                where : {id : prop.id} , data : {password : hashedPassword}
            });
        }catch(e){
            console.log(e);
            throw new Error("something went wrong !!")}
    }else if(prop.cause === "email"){
     

            // if prop.newData.email is not null 
            if (!prop.newData.email) {
                throw new Error("email is required for updating.");
            }

            
            try {        
            //chnage  email
            await prisma.user.update({
                where : {id : prop.id} , data : {email : prop.newData.email}
            });
        }catch(e){
            console.log(e);
            throw new Error("something went wrong !!")
        }

    }else if(prop.cause === "Fullname"){
    
    
            // if prop.newData.email is not null 
            if (!prop.newData.Fullname) {
                throw new Error("Fullname is required for updating.");
             }

        try{
            // chnage  Fullname 
            await prisma.user.update({
                where : {id : prop.id} , data : {Fullname : prop.newData.Fullname}
            });
        }catch(e){
            console.log(e);
            throw new Error("something went wrong !!")
        }

        
    }
} ;