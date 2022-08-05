import mongoose from "mongoose";
import 'dotenv/config'


const MONGODB_URI = process.env.DB_URI;

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.error('error connection to MongoDB', error.message)
})