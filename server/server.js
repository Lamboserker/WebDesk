import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Connection/Connect.js';

dotenv.config({ path: './secret.env' });

const Port = process.env.PORT || 3000;
const app = express();
connectDB();


app.listen(Port, () => {
    console.log(`The server is running in port : ${Port}`);
})