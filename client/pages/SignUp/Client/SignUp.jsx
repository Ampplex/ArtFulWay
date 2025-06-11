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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../../redux/auth/authSlice";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    linkedInUrl: "",
    instaUrl: "",
    businessName: "",
    company_website_url: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const criteria = [
      { regex: /.{8,}/, weight: 20 },
      { regex: /.{12,}/, weight: 10 },
      { regex: /[A-Z]/, weight: 15 },
      { regex: /[a-z]/, weight: 15 },
      { regex: /[0-9]/, weight: 20 },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, weight: 20 },
      { regex: /(.)\1{2,}/, weight: -15 },
    ];

    criteria.forEach((rule) => {
      if (rule.regex.test(password)) {
        strength += rule.weight;
      }
    });

    return Math.min(Math.max(strength, 0), 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 30) return "bg-red-400";
    if (strength < 50) return "bg-orange-400";
    if (strength < 75) return "bg-yellow-400";
    return "bg-green-400";
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
    if (!formData.company_website_url?.trim())
      newErrors.company_website_url = "Website URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const apiFormData = {
          client_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          linkedin_url: formData.linkedInUrl,
          instagram_url: formData.instaUrl,
          business_name: formData.businessName,
          company_website_url: formData.company_website_url
        };

        console.log("Sending data:", apiFormData);

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
        console.log("Server response:", responseData);

        if (!response.ok) {
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

        if (responseData.token && responseData.user) {
          dispatch(setCredentials({
            token: responseData.token,
            user_id: responseData.user.id,
            email: responseData.user.email,
            user_role: "client",
          }));

          navigate("/login");
        } else {
          throw new Error("Signup successful, but no token or user data received.");
        }

      } catch (error) {
        console.error("Signup error details:", error);

        let errorMessage = "An unexpected error occurred during signup.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          errorMessage = JSON.stringify(error);
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
      label: "Email Address",
      icon: <Mail className="w-5 h-5" />,
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      icon: <Lock className="w-5 h-5" />,
      placeholder: "Create a strong password",
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
      name: "businessName",
      label: "Business Name",
      icon: <Building className="w-5 h-5" />,
      placeholder: "Enter your business name",
    },
    {
      name: "company_website_url",
      label: "Website URL",
      icon: <Building className="w-5 h-5" />,
      placeholder: "https://yourwebsite.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-20 right-40 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '6s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8 m-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header Card */}
          <div className="bg-slate-900 rounded-t-2xl px-8 py-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full mb-4">
                <User className="w-4 h-4 text-slate-300" />
                <span className="text-slate-300 text-sm font-medium">CREATE ARTIST ACCOUNT</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Join ArtfulWay</h1>
              <p className="text-slate-300 text-sm">Start your creative journey with us today</p>
            </div>
          </div>

          {/* Form Card */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-b-2xl shadow-2xl px-8 py-8"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.slice(0, 4).map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={field.name === 'fullName' || field.name === 'email' ? 'md:col-span-1' : 'md:col-span-1'}
                >
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {field.icon}
                    </div>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200 text-sm"
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {field.name === "password" && formData.password && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 30 ? 'text-red-500' :
                          passwordStrength < 50 ? 'text-orange-500' :
                          passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {getStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300 rounded-full`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      {passwordStrength < 75 && (
                        <ul className="text-xs text-slate-500 mt-2 space-y-1">
                          {getPasswordSuggestions(formData.password).map(
                            (suggestion, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-slate-400 mt-0.5">•</span>
                                <span>{suggestion}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  )}

                  {errors[field.name] && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors[field.name]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social and Business Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {inputFields.slice(4).map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: (index + 4) * 0.1 }}
                  className="md:col-span-1"
                >
                  <label className="block text-slate-700 text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {field.icon}
                    </div>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200 text-sm"
                    />
                  </div>
                  {errors[field.name] && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors[field.name]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Skills Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mt-6"
            >
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Skills & Expertise
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Building className="w-5 h-5" />
                </div>
                <textarea
                  name="skills"
                  placeholder="e.g., Digital Art, UI/UX Design, Illustration"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200 text-sm resize-none"
                  rows="3"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full mt-8 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Artist Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Google Sign Up */}
            <motion.button
              type="button"
              className="w-full mt-3 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </motion.button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-slate-600 text-sm">Already have an account? </span>
              <button 
                type="button"
                className="text-slate-900 font-medium text-sm hover:underline"
                onClick={() => navigate('/login')}
              >
                Sign in here
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
