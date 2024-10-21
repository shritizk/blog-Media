## blog project 
this is project is to work as a blog website just like tiwtter



feature to add 
1) login / sighup / edit user data / delete or disable user 

    # sighup router
    In this route i have check if user exist or not , if not then create a new user else return false 
    # login  router 
    In this route i first check if user exist or not  , if not then return false 
    else check password  , if the password is correct then return a token .
    When even user login , it stores its token and creates a row in LoginRecord table 
    with 3 things in it . " id " which is auto genrated , " user id "  which is taken from user table  , "token " which is same cookie that got genrated at tgat time  ,  "date" which is time same used while genrateing the jwt token .

    # email sender for changed 
    **NOTE** here user will send reqData in body that will contain 
        -> userId :: to be searched in db to check if user even exist 
        -> email :: to send email to user 
        
        it will return a hashed version of otp 
        and in fronend it will hash the otp that user will write . if the otp is correct and matchs the hashed version then it will send  a req to change credentials else not .
        

    # disable account or delete 
    Here eather delete or disable the user account ::: just mark so that if user ever want to recover its data or restore account . They can do it without any issue as soon as they login .  



3) search for users 
4) follow users 
5) upload a blog 
6) delete a blog 
7) edit some blog content 
8) support service 
9) account related stuff
10) deploy front end and backend properly


