//types
import { userEcxist } from "../types";
import { Result } from "../types";

//db 
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient;


export async function userExist( prop : userEcxist) : Promise<Result | null> {
    try { 
        if(prop.userId){    
            const result = await prisma.user.findUnique({
                where : {
                    id : prop.userId
                }
            }) ; 
            return result ; 
        }else if(prop.email){
            const result = await prisma.user.findUnique({
                where : {
                    email : prop.email
                }
            }) ; 
            return result ; 
        }else{
            throw new Error("please provide userId or email");
        }; 
        
    }catch(e){
        console.log(e);
        throw new Error(" sorry something went wrong ");
    }
};   