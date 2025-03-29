import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Linkedin,
  Instagram,
  Building,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn, setUserRole } from "../../../redux/navbar/navbarSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    linkedInUrl: "",
    instaUrl: "",
    businessName: "",
    company_website_url: "", // Added missing field
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();
  const user_loggedIn = useSelector((state) => state.navbar.user_loggedIn);
  const userRole = useSelector((state) => state.navbar.user_role);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_loggedIn) {
      if (userRole === "client") {
        navigate("/client_dashboard");
      } else {
        navigate("/artist_dashboard");
      }
    }
  }, [user_loggedIn, navigate])


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
    if (!formData.confirm_password.trim())
      newErrors.confirm_password = "Confirm Password is required";
    else if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    if (!formData.businessName.trim())
      newErrors.businessName = "Business Name is required";
    if (!formData.company_website_url?.trim())  // Added optional chaining
      newErrors.company_website_url = "Website URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Format the data according to the API requirements
        const apiFormData = {
          client_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          linkedin_url: formData.linkedInUrl,
          instagram_url: formData.instaUrl,
          business_name: formData.businessName,
          company_website_url: formData.company_website_url
        };

        console.log("Sending data:", apiFormData); // Debug log

        const response = await fetch(
          "http://localhost:8080/api/client/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiFormData),
          }
        );

        const responseData = await response.json();
        console.log("Server response:", responseData); // Debug log

        if (!response.ok) {
          throw new Error(
            responseData.message || responseData.error || "Signup failed"
          );
        }

        // Clear form after successful signup
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirm_password: "",
          linkedInUrl: "",
          instaUrl: "",
          businessName: "",
          company_website_url: "",
        });
        console.log(responseData)
        // Store JWT token in local storage
        localStorage.setItem("token", responseData);
        localStorage.setItem("role", "client");

        // Update navbar and user role state
        dispatch(setLoggedIn(true));
        dispatch(setUserRole("client"));

      } catch (error) {
        console.error("Signup error details:", error);

        // Show error message
        let errorMessage = "Failed to create account: ";
        if (error.message === "Failed to fetch") {
          errorMessage +=
            "Unable to connect to the server. Please check your internet connection.";
        } else {
          errorMessage += error.message;
        }

        alert(errorMessage);
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
      label: "Email",
      icon: <Mail className="w-5 h-5" />,
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      icon: <Lock className="w-5 h-5" />,
      placeholder: "Enter your password",
      type: "password",
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      icon: <Lock className="w-5 h-5" />,
      placeholder: "Confirm your password",
      type: "password",
    },
    {
      name: "linkedInUrl",
      label: "LinkedIn URL",
      icon: <Linkedin className="w-5 h-5" />,
      placeholder: "Enter your LinkedIn URL (Optional)",
    },
    {
      name: "instaUrl",
      label: "Instagram URL",
      icon: <Instagram className="w-5 h-5" />,
      placeholder: "Enter your Instagram URL (Optional)",
    },
    {
      name: "company_website_url", // Changed from 'company_url' to match state
      label: "Website URL",
      icon: <Building className="w-5 h-5" />,
      placeholder: "Website URL",
    },
    {
      name: "businessName",
      label: "Business Name",
      icon: <Building className="w-5 h-5" />,
      placeholder: "Enter your Business Name",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <span className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
              Join ArtfulWay
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
            Create Your Account
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 mb-8">
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6"
              >
                <label className="text-gray-300 mb-2 block">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {field.icon}
                  </div>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-3 pl-10 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                  />
                </div>

                {/* Password Strength Indicator and Suggestions */}
                {field.name === "password" && formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">
                        Password Strength:
                      </span>
                      <span
                        className={`text-sm ${getStrengthColor(
                          passwordStrength
                        )} text-opacity-90`}
                      >
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor(
                          passwordStrength
                        )} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    {passwordStrength < 75 && (
                      <ul className="text-xs text-red-400 mt-2">
                        {getPasswordSuggestions(formData.password).map(
                          (suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          )
                        )}
                      </ul>
                    )}
                  </div>
                )}

                {errors[field.name] && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors[field.name]}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mb-16"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;