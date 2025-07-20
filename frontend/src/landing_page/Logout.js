import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const handleLogout = async () => {
    try {
      await axios.get("https://zerodha-backend-aylf.onrender.com/logout", {
        withCredentials: true,
      });
      toast.success("Logout successful");

      // Redirect to login page after logout
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="container text-center">
      <h1>Welcome, {user?.username || "User"}!</h1>
      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
