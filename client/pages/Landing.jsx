import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import "../src/index.css";
import {
  Shield,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
} from "lucide-react"; // or your preferred icon library
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ComparisonCard from "../components/ComparisonCard";

// Custom hook for number animation
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

      // Parse the end value to handle strings with '+'
      const targetValue = parseInt(end.replace(/\D/g, ""));
      const currentValue = Math.floor(easeOutQuart * targetValue);

      setCount(currentValue);

      if (percentage < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration]);

  return count;
};

function AnimatedStat({ value, label, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const animatedValue = useCountUp(isVisible ? value : "0", 2000);
  const suffix = value.includes("+") ? "+" : "";
  const isPercentage = value.includes("%");

  return (
    <div
      ref={elementRef}
      className="animate-on-scroll text-center opacity-0 translate-y-8"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl font-bold text-white mb-2">
        {animatedValue}
        {suffix}
        {isPercentage ? "%" : ""}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

const Landing = () => {
  const [text, setText] = useState("");
  const fullText = "Connect, Create, and Thrive with ArtfulWay";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
    setTimeout(() => {
      setIndex(0);
      setText("");
    }, 3500);
  }, [index, fullText]);

  // Feature items
  const features = [
    {
      icon: <Shield className="text-purple-400" />,
      title: "Secure Payments",
      description:
        "Our escrow system ensures artists get paid fairly and clients receive quality work, with milestone-based releases.",
    },
    {
      icon: <Sparkles className="text-purple-400" />,
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithms connect artists with projects that match their style, expertise, and career goals.",
    },
    {
      icon: <Zap className="text-purple-400" />,
      title: "Portfolio Optimization",
      description:
        "AI tools analyze your portfolio and suggest improvements to attract your ideal clients and projects.",
    },
    {
      icon: <TrendingUp className="text-purple-400" />,
      title: "Analytics Dashboard",
      description:
        "Track your performance, earnings, and growth opportunities with detailed insights and forecasts.",
    },
    {
      icon: <Users className="text-purple-400" />,
      title: "Community Support",
      description:
        "Join a thriving community of artists and businesses who share resources and opportunities.",
    },
    {
      icon: <Star className="text-purple-400" />,
      title: "Quality Assurance",
      description:
        "Our review system maintains high standards while providing constructive feedback for improvement.",
    },
  ];

  // Stats
  const stats = [
    { value: "2000+", label: "Active Artists" },
    { value: "1500+", label: "Businesses" },
    { value: "3000", label: "Projects Completed" },
    { value: "98", label: "Satisfaction Rate" },
  ];

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;

        if (isVisible) {
          el.classList.add("animate-in");
          el.classList.remove("opacity-0", "translate-y-8");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl px-4"
        >
          <div className="mb-3 flex justify-center">
            <span className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
              The Future of Creative Collaboration
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 min-h-[80px] bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
            {text}
            <span className="animate-blink text-white">|</span>
          </h1>

          <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            ArtfulWay ensures fair project matching, secure payments, and
            AI-driven tools to empower both artists and businesses in today's
            creative economy.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/artist_client">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 w-full sm:w-auto"
              >
                Get Started
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById("features").scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/40 backdrop-blur-sm text-white font-semibold rounded-lg transition-all duration-300 mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Explore Features <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stats Section with Glassmorphism */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-900/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30 inline-block mb-3"
            >
              POWERFUL FEATURES
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              Why Choose ArtfulWay?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Our platform is designed with both artists and businesses in mind,
              providing tools that foster creativity, fairness, and growth.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-purple-600/10 hover:border-purple-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <Testimonials /> */}

      <div className="text-center mb-12">
        <span className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
          Why We're Different
        </span>
        <h2 className="text-3xl font-bold text-white mt-6 mb-4">
          Not Just Another Freelance Platform
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          See how ArtfulWay stands out from traditional platforms
        </p>
      </div>

      <div className="px-20">
        <ComparisonCard />
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-10 shadow-xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Transform Your Creative Journey?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mb-8 text-lg"
            >
              Join thousands of artists and businesses already using ArtfulWay
              to connect, create, and grow.
            </motion.p>

            <Link to="/artist_client">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                Get Started Now
              </motion.button>
            </Link>

            <p className="text-gray-400 mt-6">
              No credit card required. Start for free.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
