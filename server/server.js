import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Routes from "./routes/auth";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL }));

//route
app.use("/api", Routes);

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Connection ERROR", err));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Running on port:${port}`));
