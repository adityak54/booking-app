import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/user';
import authRoutes from './routes/auth'
import mongoose from 'mongoose';
import cookieParser from "cookie-parser"
import path from 'path';

try {
    mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(()=>{
        console.log("Connected to database: ",process.env.MONGODB_CONNECTION_STRING)
    })
} catch (error) {
    console.log(error);
}

const server = express();

// Middlewares
server.use(cookieParser());
server.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname,"../../frontend/dist")))

server.use('/api/auth',authRoutes);
server.use('/api/users', userRoutes);

server.get("/api/test", async (req, res) => {
    res.json({ message: "Hello from endpoint!" });
});

server.listen(7000, () => {
    console.log("Server is listening on port 7000");
});
