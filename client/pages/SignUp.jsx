import React from "react";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1116] relative text-white px-4">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

    {/* Animated Login Card */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="z-10 bg-[#13151B]/80 p-8 rounded-2xl shadow-lg max-w-md w-full text-center backdrop-blur-lg border border-gray-700"
    >
      <h2 className="text-3xl font-semibold mb-6">Create Account</h2>
      
      {/* Input Fields */}
      <div className="mb-4">
        <input
          type="name"
          placeholder="Username"
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      {/* Buttons */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-5 py-3 bg-gradient-to-r hover:bg-zinc-100 from-white to-[#fafafa] text-black font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      >
        Submit
      </motion.button>

      {/* Sign in with Google */}
      <div className="mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={""}
          className="w-full py-3 bg-[#fff] text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all duration-300"
        >
          <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className="h-5 w-5" />
          <p className="text-black">Sign up with Google</p>
        </motion.button>
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-white hover:underline">
          Sign in
        </a>
      </p>
    </motion.div>
  </div>
  );
};

export default Signup;