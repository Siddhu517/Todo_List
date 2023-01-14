import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

/* authentication */

export const register = async (req, res) => {
  //console.log("register => ", req.body);
  const { username, email, password } = req.body;

  //check username exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.json({
      error: "username already exists",
    });
  }

  // chech email exists
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.json({
      error: "email Id already exists",
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    // username: nanoid(6) //username should be 6 letter
    _id: new mongoose.Types.ObjectId(),
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    // console.log("REGISTERED USE => ", user);
    return res.status(201).json({
      status: "ok",
      message: "Successfully Register Account",
    });
  } catch (err) {
    console.log("REGISTER FAILED => ", err);
    return res.status(400).json({
      error: "Error. Try again.",
    });
  }
};

export const login = async (req, res) => {
  //console.log("login", req.body);
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    if (!username || !password) {
      return res.json({
        error: "error",
      });
    }

    //check email
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    // console.log(user); // added debug logging
    if (!user) {
      return res.json({
        error: "no user found",
      });
    }

    //check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong Password",
      });
    }

    //create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // console.log(user);

    res.json({
      token: token,
      user: user,
      status: "ok",
      message: "Successfully Login Account",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Error. Try again",
    });
  }
};

// variable create to store otp
let makeOTP = 0;

export const VerifyEmailAndSendOTP = async (req, res) => {
  try {
    // console.log("email-otp-send => ", req.body);
    const { email } = req.body;
    //console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    generateOTP();
    await handleSendEmail(email, makeOTP);

    res.status(201).json({
      message: "Send OTP Check",
      status: "ok",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create variable to store otp to match previous otp
let matchOTP = "";

export const VerifyOTP = async (req, res) => {
  try {
    //console.log("verify otp => ", req.body);
    const { otp } = req.body;

    if (Number(otp) !== Number(makeOTP)) {
      matchOTP = "Failed";
      return res.json({
        error: "Check email enter Wrong OTP",
      });
    }

    matchOTP = "Success";

    res.status(201).json({
      status: "ok",
      message: "Success",
    });

    //console.log(makeOTP,matchOTP)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const ResetPassword = async (req, res) => {
  // console.log("ResetPassword", req.body);
  const { email, password } = req.body;
  // console.log(email, password);

  if (matchOTP === "") {
    return res.json({ error: "Please Enter OTP and Submit" });
  }

  if (matchOTP === "Failed") {
    return res.json({ error: "OTP not match Retry!" });
  }

  // chech email exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      error: "User Not Found",
    });
  }

  // password verify old and New Match
  const oldPassMatch = await comparePassword(password, user.password);
  if (oldPassMatch) {
    return res.json({
      error: "You have enter Old Password, Please Enter New Password",
    });
  }

  try {
    const hashed = await hashPassword(password);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      message: "Congrats, Now you can login with your new password",
      status: "ok",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong. Try again.",
    });
  }
};

// generate OTP
const generateOTP = () => {
  makeOTP = Math.floor(1000 + Math.random() * 9000);
};

/*  */

// send OTP to specific email address
const handleSendEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "siddhusadadekar517@gmail.com",
      pass: "nuamefswphkmvszp",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "siddhusadadekar517@gmail.com",
    to: email,
    subject: "OTP for Verification",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
  });

  // console.log(`Message sent: %s `, info.messageId);
};

/***************** todos  ******************************/

export const addTodo = async (req, res) => {
  const { todo } = req.body;
  // console.log(req.body);
  //console.log(req.user._id);
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          todos: {
            _id: req.user._id + "-" + Date.now(),
            todo: todo,
            task: false,
          },
        },
      },
      { new: true }
    );
    //console.log(user);
    res.status(200).json({ message: "add todo success", status: "ok" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const getTodosList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    //console.log(user);
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(400).json({ message: "error" });
  }
};

export const todoTaskComplete = async (req, res) => {
  try {
    const { id, task } = req.body;
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "todos.$[elem].task": task,
        },
      },
      {
        arrayFilters: [{ "elem._id": id }],
        new: true,
      }
    );
    let message = "";
    if (task === true) {
      message = "task completed";
    } else {
      message = "task Incomplete";
    }
    res.status(200).json({ message: message, status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.body;
  //console.log(req.body);
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { todos: { _id: id } },
      },
      { new: true }
    );
    res.json({ message: "Deleted Todo", status: "ok" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/* delete user account */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Deleted User", status: "ok" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
