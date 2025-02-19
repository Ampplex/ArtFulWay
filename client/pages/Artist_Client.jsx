import React from "react";
import Lottie from "lottie-react";
import artist_client from "../src/assets/animation/artist.json";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Artist_Client() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-black to-gray-900 min-h-screen p-4 overflow-hidden">
      {/* Left Content - Text and Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-16 z-10 space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white text-3xl md:text-5xl font-bold text-center lg:text-left"
        >
          Join Our Creative Community
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-gray-300 text-lg max-w-md text-center lg:text-left mb-8"
        >
          Connect with talented artists and clients from around the world
        </motion.p>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <Link
            to="/artist_onboarding"
            className="w-full h-full flex items-center justify-center"
          >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 w-full"
          >
            Join as Artist
          </motion.button>
          </Link>

          <Link
            to="/client_onboarding"
            className="w-full h-full flex items-center justify-center"
          >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 w-full"
          >
              Join as Client
          </motion.button>
            </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>

      {/* Right Content - Animation */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
        <div className="w-full max-w-xl lg:max-w-none lg:w-5/6 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-transparent lg:hidden"></div>
          <Lottie
            animationData={artist_client}
            loop={true}
            autoplay={true}
            className="w-full"
          />
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl"></div>
      </div>
    </div>
  );
}

export default Artist_Client;
