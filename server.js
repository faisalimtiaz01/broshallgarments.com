import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import path from 'path'
import {fileURLToPath} from 'url'

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"

import cors from 'cors';


dotenv.config();

//databse connect
connectDB();
// esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//rest objects
const app = express();

//middleware
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'./client/build')))

// routes

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)


//rest api
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))

})

// app.get("/", (req, res) => {
//   res.send(" <h1>welcome to broshall garments</h1>");
// });

const PORT = process.env.port || 8080;

app.listen(PORT, (req, res) => {
  console.log(`listening on port:${PORT}`.bgCyan.white);
});
