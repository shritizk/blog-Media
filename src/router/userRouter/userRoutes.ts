import {Router , Response , Request} from 'express';
export const router  = Router();


//db 

// here i am expecting that all the input validation are already done in front end it self 


// interface 
interface Responsedata {
    response : Response
}


// login - sighup route
router.post('/sighup',async  function( req : Request, res : Response) {
    const payload = req.body;
    // use data will incude 
    // email 
    // name 
    // password 
    try { 
        res.json({
            msg : "done "
        })
    }catch { 
        res.json({
            msg : "done something wrong !!"
        })
    }
})
// edit userData router 

// delete or disable router 


