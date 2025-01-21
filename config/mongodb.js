import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Successfully connected to MongoDB"))
    await mongoose.connect(`${process.env.MONGODB_URI}/booking`)
}

export default connectDB