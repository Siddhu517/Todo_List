import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import {
  RegisterAPI,
  LoginAPI,
  VerifyEmailAndSendOTPAPI,
  VerifyOTPAPI,
  ResetPassword,
} from "../../services/api";
import { UserContext } from "../../context/Context";

const Auth = () => {
  const [state, setState] = useContext(UserContext);
  const [view, setView] = useState("login");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingV, setIsLoadingV] = useState(false);
  const [isLoadingS, setIsLoadingS] = useState(false);

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOTP] = useState("");

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!loginForm) {
        setIsLoading(false);
        return;
      }
      // console.log(loginForm);
      const { data } = await LoginAPI(loginForm);
      if (data.status !== "ok") {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      setState({
        user: data.user,
        token: data.token,
      });

      // user data and token save localstorage
      window.localStorage.setItem("auth", JSON.stringify(data));

      // navigate home page

      setTimeout(() => {
        // setIsLoading(false);
        toast.success(data.message);
        setIsLoading(false);
        window.location = "/";
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      toast.error("Enter valid credentials to Login");
      console.log(err);
    }
  };

  const submitRegisterForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!registerForm) {
        setIsLoading(false);
        return;
      }
      //console.log(registerForm);
      const { data } = await RegisterAPI(registerForm);
      if (data.status !== "ok") {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }
      toast.success(data.message);
      setIsLoading(false);
      setView("login");
    } catch (err) {
      setIsLoading(false);
      toast.error("Enter valid Data to Create Account");
      console.log(err);
    }
  };

  const handleEmailSendOTP = async () => {
    setIsLoadingS(true);
    try {
      //console.log(email);
      const { data } = await VerifyEmailAndSendOTPAPI(email);
      if (data.status !== "ok") {
        toast.error(data.error);
        setIsLoadingS(false);
        return;
      }
      toast.success(data.message);
      setIsLoadingS(false);
    } catch (err) {
      setIsLoadingS(false);
      console.log(err);
    }
  };

  const handleEmailVerifyOTP = async () => {
    setIsLoadingV(true);
    try {
      //console.log(otp);
      const { data } = await VerifyOTPAPI(otp);
      if (data.status !== "ok") {
        setIsLoadingV(false);
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      setIsLoadingV(false);
    } catch (err) {
      setIsLoadingV(false);
      console.log(err);
    }
  };

  const submitResetPasswordForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    //console.log(email, password, confirmPassword);
    if (!email) {
      toast.error("Enter EmailId");
      setIsLoading(false);
      return;
    }

    if (!password && !confirmPassword) {
      toast.error("Enter Password");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      toast.error("Password and ConfirmPassword not match");
      return;
    }

    try {
      const resetData = { email, password };
      const { data } = await ResetPassword(resetData);
      if (data.status === "ok") {
        toast.success(data.message);
        setView("login");
        setIsLoading(false);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOTP("");
      }
      toast.error(data.error);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const onChangeLogin = (e) => {
    setLoginForm(() => ({
      ...loginForm,
      [e.target.name]: e.target.value,
    }));
  };
  const onChangeRegister = (e) => {
    setRegisterForm(() => ({
      ...registerForm,
      [e.target.name]: e.target.value,
    }));
  };

  const loginView = () => {
    setView("login");
  };
  const registerView = () => {
    setView("register");
  };
  const resetPasswordView = () => {
    setView("resetPassword");
  };

  return (
    <div className="container-fluid m-0 p-0 ">
      <div className="navbar">
        <div className="AppName">
          <span className="name">Todos</span>
        </div>
        <div className="UserAuth">
          <button className="btn btn-primary" onClick={loginView}>
            Login
          </button>
          <button className="btn btn-success ms-5" onClick={registerView}>
            Register
          </button>
        </div>
      </div>
      <div className="body-section">
        {view === "login" ? (
          <div className="login-form">
            <h1 className="form_name">Login</h1>
            <div className="card">
              <div className="card-body">
                <form className="form" onSubmit={submitLoginForm}>
                  <div className="form-group mb-3">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={onChangeLogin}
                      name="username"
                      placeholder="Username / Email"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="password"
                      onChange={onChangeLogin}
                      name="password"
                    />
                  </div>
                  <span
                    className="text-danger"
                    role="button"
                    onClick={resetPasswordView}
                  >
                    Forgot Password?
                  </span>
                  <div className="form-group mt-3">
                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm me-3 fs-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {view === "register" ? (
          <div className="register-form">
             <h1 className="form_name">Register</h1>
            <div className="card">
              <div className="card-body">
                <form className="form" onSubmit={submitRegisterForm}>
                  <div className="form-group mb-3">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Username"
                      onChange={onChangeRegister}
                      name="username"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="email"
                      onChange={onChangeRegister}
                      name="email"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="password"
                      onChange={onChangeRegister}
                      name="password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success mt-2 w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-3 fs-4"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {view === "resetPassword" ? (
          <div className="reset-password-form">
            <h1 className="form_name">Reset_Password</h1>
            <div className="card">
              <div className="card-body">
                <form className="form" onSubmit={submitResetPasswordForm}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span
                      className="input-group-text btn btn-success"
                      id="basic-addon1"
                      onClick={handleEmailSendOTP}
                      disabled={isLoadingS}
                    >
                      {isLoadingS ? (
                        <span
                          className="spinner-border spinner-border-sm me-3 fs-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Send OTP
                    </span>
                  </div>

                  <div className="input-group mb-2">
                    <span
                      className="input-group-text btn btn-primary"
                      id="basic-addon1"
                      role="button"
                      onClick={handleEmailSendOTP}
                    >
                      Resend
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter 4 digit OTP"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                    />
                    <span
                      className="input-group-text btn btn-success"
                      id="basic-addon1"
                      role="button"
                      onClick={handleEmailVerifyOTP}
                      disabled={isLoadingV}
                    >
                      {isLoadingV ? (
                        <span
                          className="spinner-border spinner-border-sm me-3 fs-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Verify OTP
                    </span>
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">ConfirmPassword</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-3 fs-4"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Auth;
