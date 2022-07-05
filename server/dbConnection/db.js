import mongoose from "mongoose";

export const dbConnection = async (url) => {
  await mongoose
    .connect(url)
    .then(() => console.log("DBConnection successfully"))
    .catch((err) => console.log("DB connection error", err));
};
