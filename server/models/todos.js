import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    todo: { type: String, required: true },
    check: { type: Boolean },
  },
  {
    collection: "Todos",
  }
);

const todo = mongoose.model("Todos", userSchema);
export default todo;
