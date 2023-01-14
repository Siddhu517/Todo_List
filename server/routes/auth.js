import express from "express";
import { requireSignin } from "../Middleware/index";

import {
  login,
  register,
  VerifyEmailAndSendOTP,
  VerifyOTP,
  ResetPassword,
  addTodo,
  getTodosList,
  todoTaskComplete,
  deleteTodo,
  deleteUser,
} from "../controllers/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password/send-otp", VerifyEmailAndSendOTP);
router.post("/reset-password/verify-otp", VerifyOTP);
router.put("/reset-password", ResetPassword);

/* todos  */
router.put("/add-todo", requireSignin, addTodo);
router.get("/get-todos", requireSignin, getTodosList);
router.put("/todo-task", requireSignin, todoTaskComplete);
router.put("/delete-todo", requireSignin, deleteTodo);

/* account delete */
router.delete("/delete-user", requireSignin, deleteUser);

export default router;
