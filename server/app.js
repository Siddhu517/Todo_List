import express from "express";
import cors from "cors";
import { dbConnection } from "./dbConnection/db";
import Routes from "./routes/route";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL }));

//route
app.use("/", Routes);

//db
const url = process.env.DATABASE_URL;
dbConnection(url);

const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server Running on port:${port}`));
