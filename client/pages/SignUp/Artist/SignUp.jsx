import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Linkedin,
  Instagram,
  FileText,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../../redux/auth/authSlice";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    linkedInUrl: "",
    instaUrl: "",
    skillset: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const criteria = [
      { regex: /.{8,}/, weight: 20 }, // Minimum length 8
      { regex: /.{12,}/, weight: 10 }, // Bonus for length 12+
      { regex: /[A-Z]/, weight: 15 }, // Uppercase letter
      { regex: /[a-z]/, weight: 15 }, // Lowercase letter
      { regex: /[0-9]/, weight: 20 }, // Number
      { regex: /[!@#$%^&*(),.?":{}|<>]/, weight: 20 }, // Special character
      { regex: /(.)\1{2,}/, weight: -15 }, // Penalize repeated characters
    ];

    criteria.forEach((rule) => {
      if (rule.regex.test(password)) {
        strength += rule.weight;
      }
    });

    return Math.min(Math.max(strength, 0), 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 30) return "bg-red-500"; // Weak
    if (strength < 50) return "bg-orange-500"; // Fair
    if (strength < 75) return "bg-yellow-500"; // Good
    return "bg-green-500"; // Strong
  };

  const getStrengthLabel = (strength) => {
    if (strength < 30) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const getPasswordSuggestions = (password) => {
    let suggestions = [];
    if (!/.{8,}/.test(password)) suggestions.push("Use at least 8 characters.");
    if (!/[A-Z]/.test(password))
      suggestions.push("Include an uppercase letter.");
    if (!/[a-z]/.test(password))
      suggestions.push("Include a lowercase letter.");
    if (!/[0-9]/.test(password)) suggestions.push("Include a number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      suggestions.push("Include a special character.");
    if (/(.)\1{2,}/.test(password))
      suggestions.push("Avoid repeated characters.");

    return suggestions;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.linkedInUrl.trim())
      newErrors.linkedInUrl = "LinkedIn URL is required";
    if (!formData.instaUrl.trim())
      newErrors.instaUrl = "Instagram URL is required";
    if (!formData.skillset.trim()) newErrors.skillset = "Skillset is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
        // Format the data according to the API requirements
        const apiFormData = {
          artist_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          linkedin_url: formData.linkedInUrl,
          instagram_url: formData.instaUrl,
          skillSets: formData.skillset,
          experience: "-",
          work_title: "Artist",
        };

        console.log("Sending data:", apiFormData); // Log the data being sent

        const response = await fetch(
          "http://localhost:8080/api/artist/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiFormData),
          }
        );

        const responseData = await response.json();
        console.log("Server response:", responseData); // Log the server's response

        if (!response.ok) {
          // Check for specific error message from the backend
          if (responseData.error && responseData.error.errorResponse && responseData.error.errorResponse.email) {
            throw new Error(responseData.error.errorResponse.email);
          } else if (responseData.error && responseData.error.errorLabelSet && responseData.error.errorLabelSet.code === 11000) {
            throw new Error("This email is already registered. Please use a different email or log in.");
          } else {
            throw new Error(
              responseData.message || responseData.error || "Signup failed"
            );
          }
        }

        setSuccess("Account created successfully!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          linkedInUrl: "",
          instaUrl: "",
          skillset: "",
        });

        // Update Redux auth state ONLY if response is OK and token/user data exists
        if (responseData.token && responseData.user) {
          dispatch(setCredentials({
            token: responseData.token,
            user_id: responseData.user.id,
            email: responseData.user.email,
            user_role: "artist", // Set user role upon signup
          }));

          // Redirect to the artist dashboard
          setTimeout(() => {
            navigate("/under_review");
          }, 1000);
        } else {
          // This case should ideally not be reached if response.ok is true, but as a safeguard
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }

      } catch (error) {
        console.error("Signup error details:", error);
        
        // Show error message more gracefully
        let errorMessage = "An unexpected error occurred during signup.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          errorMessage = JSON.stringify(error);
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputFields = [
    {
      name: "fullName",
      label: "Full Name",
      icon: <User className="w-5 h-5" />,
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email Address",
      icon: <Mail className="w-5 h-5" />,
      placeholder: "Enter your email",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      icon: <Lock className="w-5 h-5" />,
      placeholder: "Create a strong password",
      type: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      icon: <Lock className="w-5 h-5" />,
      placeholder: "Confirm your password",
      type: "password",
    },
    {
      name: "linkedInUrl",
      label: "LinkedIn Profile",
      icon: <Linkedin className="w-5 h-5" />,
      placeholder: "https://linkedin.com/in/your-profile",
    },
    {
      name: "instaUrl",
      label: "Instagram Profile",
      icon: <Instagram className="w-5 h-5" />,
      placeholder: "https://instagram.com/your-profile",
    },
    {
      name: "skillset",
      label: "Skills & Expertise",
      icon: <FileText className="w-5 h-5" />,
      placeholder: "e.g., Digital Art, UI/UX Design, Illustration",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative mt-20 pb-10 mb-10 overflow-hidden flex items-center justify-center p-6">
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

      {/* Signup Container */}
      <div className="relative z-10 w-full max-w-2xl">
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
                <Sparkles className="w-4 h-4 text-purple-300 mr-2" />
                <span className="text-sm font-semibold text-white">CREATE ARTIST ACCOUNT</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Join ArtfulWay
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-300"
              >
                Start your creative journey with us today
              </motion.p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
              >
                <CheckCircle className="text-green-600 mr-2" size={16} />
                <p className="text-green-600 text-sm font-medium">{success}</p>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className={field.name === 'skillset' ? 'md:col-span-2' : ''}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {field.icon}
                      </div>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {/* Password visibility toggle */}
                      {field.name === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      )}
                      {field.name === "confirmPassword" && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      )}
                    </div>

                    {/* Password Strength Indicator */}
                    {field.name === "password" && formData.password && (
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Password Strength:
                          </span>
                          <span className={`text-sm font-medium ${
                            passwordStrength < 30 ? 'text-red-500' :
                            passwordStrength < 50 ? 'text-orange-500' :
                            passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {getStrengthLabel(passwordStrength)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        {passwordStrength < 75 && (
                          <ul className="text-xs text-gray-500 mt-2 space-y-1">
                            {getPasswordSuggestions(formData.password).map(
                              (suggestion, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                  {suggestion}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    )}

                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {errors[field.name]}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={`w-full px-8 py-4 bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Artist Account</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </motion.button>

              {/* Google Sign Up */}
              <motion.button
                type="button"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="w-full px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                  />
                </svg>
                Sign up with Google
              </motion.button>
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="text-center pt-6 border-t border-gray-100 mt-8"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login"
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;