
import  express,{ Express }  from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'


import adminRouter from "../routes/adminRouter";
import userRouter from "../routes/usersRouter";
import jobRouter from "../routes/JobRouter";
import profileRouter from "../routes/profileRouter";
import messageRouter from "../routes/messageRouter";
import graphRouter from "../routes/graphRouter";


const app:Express=express()

//parce json bodys
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser())

//cors
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000'
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, 
  })
);


// Routes
app.use("/user", userRouter);
app.use('/admin',adminRouter);
app.use('/job',jobRouter);
app.use('/profile',profileRouter);
app.use("/chat",messageRouter);
app.use('/graph',graphRouter)



export default app;