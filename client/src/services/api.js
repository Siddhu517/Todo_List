import axios from "axios";
//const Url = "http://localhost:8000";

/* Auth routes */
export const RegisterAPI = async (registerForm) => {
  try {
    return await axios.post(`/register`, registerForm);
  } catch (err) {
    console.log(err);
  }
};

export const LoginAPI = async (loginForm) => {
  try {
    return await axios.post(`/login`, loginForm);
  } catch (err) {
    console.log(err);
  }
};

export const VerifyEmailAndSendOTPAPI = async (email) => {
  try {
    return await axios.post(`/reset-password/send-otp`, { email });
  } catch (err) {
    console.log(err);
  }
};

export const VerifyOTPAPI = async (otp) => {
  try {
    return await axios.post(`/reset-password/verify-otp`, { otp });
  } catch (err) {
    console.log(err);
  }
};

export const ResetPassword = async (resetData) => {
  try {
    return await axios.put(`/reset-password`, resetData);
  } catch (err) {
    console.log(err);
  }
};

/* home todos routes */

export const addTodo = async (todo) => {
  try {
    return await axios.put(`/add-todo`, { todo });
  } catch (err) {
    console.log(err);
  }
};

export const getTodosList = async () => {
  try {
    return await axios.get(`/get-todos`);
  } catch (err) {
    console.log(err);
  }
};

export const todoTaskComplete = async (id, task) => {
  try {
    return await axios.put(`/todo-task`, { id, task });
  } catch (err) {
    console.log(err);
  }
};

export const deleteTodo = async (id) => {
  try {
    return await axios.put(`/delete-todo`, {id});
  } catch (err) {
    console.log(err);
  }
};

/* account delete */
export const deleteUser = async () => {
  try {
    return await axios.delete(`/delete-user`);
  } catch (err) {
    console.log(err);
  }
};
