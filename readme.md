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
    If a user wants to change password , credentials or email . They have to go through a email otp verification 
    -> create a email sender with dedicated msg ::::  done 
    -> create a otp db to save send otp :::: 
    -> create a route to change user data as they req 

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


