import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/user';
import authRoutes from './routes/auth'
import mongoose from 'mongoose';
import cookieParser from "cookie-parser"
import path from 'path';
import {v2 as cloudinary} from 'cloudinary'
import myHotelRoutes from './routes/my-hotels'
import hotelRoutes from "./routes/hotels"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
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
server.use(express.json());
server.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname,"../../frontend/dist")))

server.use('/api/auth',authRoutes);
server.use('/api/users', userRoutes);
server.use('/api/my-hotels',myHotelRoutes);
server.use("/api/hotels",hotelRoutes)

server.listen(7000, () => {
    console.log("Server is listening on port 7000");
});
