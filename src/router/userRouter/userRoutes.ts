import {Router , Response , Request} from 'express';
export const router  = Router();

// here i am expecting that all the input validation are already done in front end it self 


// interface 
interface Responsedata {
    response : Response
}


// login - sighup route
router.post('/sighup', function( req : Request, res : Responsedata) {
    const payload = req.body;
    // use data will incude 
    // email 
    // name 
    // password 
    try {
        return res
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


