import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { persistor } from "../redux/store";
import { ArrowRight, Eye, EyeOff, Users, Sparkles } from "lucide-react";

function Login() {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get token from Redux store and role from Redux
  const reduxToken = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user_role);

  // Effect to navigate after successful login, relying on Redux state
  useEffect(() => {
    if (reduxToken && userRole) {
      setSuccess("Login successful!");
      
      // Add a small delay to ensure Redux Persist has time to rehydrate fully
      setTimeout(() => {
        console.log("Login.jsx useEffect (after timeout): Navigating...");
        console.log("Login.jsx useEffect (after timeout): Redux Token:", reduxToken);
        console.log("Login.jsx useEffect (after timeout): User Role from Redux:", userRole);
        navigate(userRole === "client" ? "/client_dashboard" : "/artist_dashboard", {
          state: { user_id: jwtDecode(reduxToken).id }, // Pass user_id via state
        });
      }, 50); // 50ms delay
    }
  }, [reduxToken, userRole, navigate]);

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

      // Update Redux state FIRST, Redux Persist will handle storage
      dispatch(
        setCredentials({
          token: data.token,
          user_id: decoded.id,
          email: decoded.email,
          user_role: role, // Set user role from login process
        })
      );

      // Wait for persistence to complete (critical for immediate rehydration across app)
      await persistor.flush();

      // Navigation will now be handled by the useEffect above

    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-white relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Elements - Matching Landing Page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-purple-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-48 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 rounded-full blur-3xl"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg rotate-45 opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-br from-green-200 to-teal-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-32 w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-300 rounded-lg rotate-12 opacity-25"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-4"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-semibold text-white">SECURE LOGIN</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Welcome Back
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-300"
              >
                Sign in to continue your creative journey
              </motion.p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            {/* Role Selector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-3"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === "client"
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Users className={`mx-auto mb-2 ${role === "client" ? "text-white" : "text-gray-400"}`} size={20} />
                  <div className="text-sm font-semibold">Client</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("artist")}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === "artist"
                      ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Sparkles className={`mx-auto mb-2 ${role === "artist" ? "text-white" : "text-gray-400"}`} size={20} />
                  <div className="text-sm font-semibold">Artist</div>
                </button>
              </div>
            </motion.div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <p className="text-green-600 text-sm font-medium">{success}!</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-end"
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className={`group w-full px-8 py-4 bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign in as {role === "client" ? "Client" : "Artist"}</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </motion.button>

              {/* Google Sign In */}
              <motion.button
                type="button"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="w-full px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                  />
                </svg>
                Continue with Google
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-center pt-6 border-t border-gray-100"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to={role === "client" ? "/signup_client" : "/signup_artist"}
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-300"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
