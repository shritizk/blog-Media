






// types and codes 
export enum statusCode {
    ok = 200 , 
    accessDenied  = 404 , 
    alreadyExist = 409 , 
    userCreated  = 201,
    ServerError = 500 , 
    wrongInput = 422
}   

// type for userExist function
export interface userEcxist {   
        email?: string ;
        userId? : number ;  
}
  
export type Result =  {
    id :     number
    email :    String  
    Fullname :   String 
    password  : String 
}

export interface emailSender {
    email : String  ; 
    cause : string ; 
    otp : string ;
}

export type secretDataType =  { 
    email : string ;
    password : string ; 
} 

export interface chnageCredentialsProp {
    cause : "pass" | "email" | "Fullname" ; 
    id : number ; 
    emaiil? : string ;
    newData : {
        email? : string ; 
        Fullname? : string ; 
        password? : string ; 
    }
};