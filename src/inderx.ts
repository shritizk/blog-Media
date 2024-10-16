const express = require('express');
const app = express() ;
// dependencies
app.use(express.json());
// other imports 
import {router as  userRouter} from './router/userRouter/userRoutes'
// router
app.router('v1/api/user/',userRouter);


// listen