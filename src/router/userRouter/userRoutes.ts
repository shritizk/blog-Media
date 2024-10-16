import {Router , Response , Request} from 'express';
export const router  = Router();

// here i am expecting that all the input validation are already done in front end it self 


// interface 
interface Responsedata {
    response : Response
}

//error to be fixed in function 
//its type is not working thats given to me by express - Response , custom interface is not worling as well evenif i put some data and say make it strig or someting like that ( have done some gpt as well but same as always )
// its working for any type  only  
//
// login - sighup route
router.post('/sighup', function( req : Request, res : Response) {
    const payload = req.body;
    // use data will incude 
    // email 
    // name 
    // password 
    try {
        return res.json({
            msg : "done"
        })
        // heere all the signup login will go 
    }catch(e) {
        // here all the error are going to be handled 
        console.log(e);
        return res.json({
            msg : "something went wrong "
        });
    }
})
// edit userData router 

// delete or disable router 


