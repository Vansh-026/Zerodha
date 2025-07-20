import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const { name, username, email, password } = inputValue;

  // ✅ STEP 2: Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard"); // Replace with your actual route
    }
  }, [navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
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

    if (!name || !username || !email || !password) {
      handleError("Please fill all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://zerodha-backend-8yu9.onrender.com/signup",
        inputValue,
        { withCredentials: true }
      );

      const { success, message } = data;

      if (success) {
        handleSuccess(message);

        // ✅ STEP 1: Save auth status
        localStorage.setItem("isAuthenticated", "true");

        // ✅ STEP 3: Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard"); // Replace with your desired post-signup route
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      handleError("Signup failed");
    }

    setInputValue({
      name: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-7 p-5">
          <img
            src="media//images/signup.png"
            alt="Signup"
            className="img-fluid"
          />
        </div>
        <div className="col-5 p-5">
          <h1 className="mb-4 mt-3">Signup Now</h1>
          <form onSubmit={handleSubmit}>
            <div
              className="form-row align-items-center"
              style={{ width: "90%" }}
            >
              <div className="my-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleOnChange}
                />
              </div>

              <div className="my-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleOnChange}
                />
              </div>

              <div className="my-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleOnChange}
                />
              </div>

              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleOnChange}
                />
              </div>

              <div className="col-auto">
                <p className="mt-3 mb-2">
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Already have an account?
                  </Link>
                </p>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Signup;
