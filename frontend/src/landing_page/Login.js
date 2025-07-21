import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext"; // ✅ Adjust the path as needed

const Login = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { isAuthenticated, setIsAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const { email, password } = inputValue;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
    });

  const handleError = (msg) =>
    toast.error(msg, {
      position: "top-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://zerodha-backend-l66r.onrender.com/login",
        inputValue,
        { withCredentials: true }
      );

      const { success, message } = data;

      if (success) {
        handleSuccess(message);
        setIsAuthenticated(true);

        const redirectURL = localStorage.getItem("redirectAfterLogin");

        setTimeout(() => {
          if (redirectURL) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectURL;
          } else {
            navigate("/", { state: { user: data.user } });
          }
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      handleError("Login failed");
    }

    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="container">
      <div className="row p-5">
        <div className="col-6 p-5">
          <img src="media/images/signup.png" alt="Login" className="img-fluid" />
        </div>
        <div className="col-5 p-5 d-flex flex-column align-items-center justify-content-center">
          <h1 className="mb-4">Login</h1>
          <form onSubmit={handleSubmit} style={{ width: "90%" }}>
            <div className="my-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="my-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="mt-4">
              <p className="mb-2">
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  Don't have an account? Sign up
                </Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
