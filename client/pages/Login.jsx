import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn, setUserRole } from "../redux/navbar/navbarSlice";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { persistor } from "../redux/store";

function Login() {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_loggedIn = useSelector((state) => state.navbar.user_loggedIn);
  const userRole = useSelector((state) => state.navbar.user_role);


  useEffect(() => {
    if (user_loggedIn) {
      if (userRole === "client") {
        navigate("/client_dashboard", {});
      } else {
        navigate("/artist_dashboard");
      }
    }
  }, [user_loggedIn, userRole, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/${role}/login`, // Dynamic endpoint based on role
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const decoded = jwtDecode(data.token);
      console.log("Decoded JWT:", decoded);


      // Store token and role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      const user_id =  decoded.id; // Extract user ID from token
      console.log("Prop user_id:", user_id);
      // Update Redux state
      dispatch(setLoggedIn(true));
      dispatch(setUserRole(role));

      // Wait for persistence to complete
      await persistor.flush();

      setSuccess("Login successful!");

      navigate(role === "client" ? "/client_dashboard" : "/artist_dashboard", {state: {user_id}});
      
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-black to-gray-900 min-h-screen p-4 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/70 backdrop-blur-lg rounded-xl p-8 md:p-12 mt-15 shadow-2xl w-full max-w-md z-10 border border-gray-800"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white text-3xl font-bold text-center mb-8"
        >
          Welcome Back
        </motion.h2>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 p-1 rounded-lg flex">
            <button
              onClick={() => setRole("client")}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                role === "client"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setRole("artist")}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                role === "artist"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Artist
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-red-500 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-green-500 text-center"
          >
            {success}!
          </motion.div>
        )}

        {/* Input Fields */}
        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-end"
          >
            <a
              href="/forgot-password"
              className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-300"
            >
              Forgot password?
            </a>
          </motion.div>

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `Log in as ${role === "client" ? "Client" : "Artist"}`
              )}
            </motion.button>

            {/* Sign in with Google */}
            <motion.button
              type="button"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center mt-8 text-gray-400"
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:underline transition-colors duration-300"
          >
            Sign up
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
