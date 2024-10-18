const express = require('express');
const app = express() ;
// dependencies
import cookieParser from 'cookie-parser';
app.use(express.json());
app.use(cookieParser());
// other imports 
import {router as  userRouter} from './router/userRouter/userRoutes'
// router
app.router('v1/api/user/',userRouter);


// listen