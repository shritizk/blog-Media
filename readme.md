## blog project 
this is project is to work as a blog website just like tiwtter

feature to add 
1) login / sighup / edit user data / delete or disable user 

    # sighup router
    In this route i have check if user exist or not , if not then create a new user else return false 
    # login  router 
    In this route i first check if user exist or not  , if not then return false 
    else check password  , if the password is correct then return a token .

    # extra micro service 
    Here I have created a small micro service that if a user is already logged in on a device and if user try to login to another device it will logout the user user from first machine . 
    -> how will it logout . 
        For that i have added a middleware in all the req from login and other things that will always check the 2nd db "loginRecord" for the token and the the assosiated email with it . If it do exist at the time of logIn it will del it and when the machine that the user is already logged in try to access some authed route it will send a error as the token is not in the db "loginRecord" . 
    
    ::::: I might try to add something that will force fully logout user . ::::::
 



3) search for users 
4) follow users 
5) upload a blog 
6) delete a blog 
7) edit some blog content 
8) support service 
9) account related stuff
10) deploy front end and backend properly


