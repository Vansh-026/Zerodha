import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear cookies/localStorage if needed
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      // ✅ User is authenticated, go to dashboard (external app)
      window.location.href = "https://zerodha-dashboard-sj2g.onrender.com/";
    } else {
      // 🔒 Not logged in, store intended URL and redirect to login
      localStorage.setItem("redirectAfterLogin", "https://zerodha-dashboard-sj2g.onrender.com/");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#FFF" }}>
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img src="media/images/logo.svg" style={{ width: "25%" }} alt="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link text-danger">
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link active" to="/signup">
                  Signup
                </Link>
              </li>
            )}

            {/* Navigation Links */}
            <li className="nav-item">
              <Link className="nav-link active" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/product">
                Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/pricing">
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/support">
                Support
              </Link>
            </li>

            {/* Dashboard Button */}
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleDashboardClick}>
                Dashboard
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
