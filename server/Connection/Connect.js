import mongoose from "mongoose";



const connectDB = async () => {
    const DB = process.env.USER_DB;
    try {
        await mongoose.connect(DB);
        console.log('Database is connected');

    }
    catch (err) {
        console.log(err.massage);
    }
}

export default connectDB;