import mongoose from "mongoose";
import colors from "colors";
import 'dotenv/config';




//  const MONGO_URL ='mongodb+srv://FaisalImtiaz:Alimola12345@broshall.n7vfjqf.mongodb.net/Ecommerce'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(process.env.MONGO_URL);
    console.log(`Connected to mongoose successfully...${conn.connection.host}`.bgMagenta.white);
  } catch (err) {
    console.error(`Error in mongodb ${err}`.bgRed.white);
  }
};
export default connectDB;

