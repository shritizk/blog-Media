import {NextFunction , Response , Request} from 'express';

// This function is the middleware that will check if email and token is already in db "loginRecord"
// if user already in here then it will res with a error 
export function loginRecordMiddleWare(req : Request , res : Response , next : NextFunction){
    const payload = req.body;
    // check if this email is in db and have a token with it , if yes then remove and send a error else next 
    
}

// this will check if user is logged in or not in the db 
// so that if its not then it will send a error in front end with a res error 404 and redirect user to login page 
export function loginCheckWhileAuth(req : Request , res : Response , next : NextFunction){
    const payload = req.body;
    // if yes then send a positive else send a error 
}