import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  BarChart3,
  CreditCard,
  Workflow,
  MonitorCheck,
} from "lucide-react";

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

      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
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

// Dashboard Mockup Component
const DashboardMockup = React.memo(() => {
  return (
    <div className="relative">
      {/* Main Dashboard Window */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-1 transition-transform duration-700">
        {/* Browser Bar */}
        <div className="bg-gray-100 px-4 py-3 flex items-center border-b border-gray-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="ml-4 bg-white px-3 py-1 rounded text-xs text-gray-500 flex-1 max-w-xs">
            artfulway.com/dashboard
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-gradient-to-br from-white to-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Artist Dashboard</h3>
              <p className="text-gray-500 text-sm">Welcome back, Sarah!</p>
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-xs text-gray-500">Active Projects</div>
              <div className="text-green-500 text-xs mt-1">↗ +12%</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">$12.5k</div>
              <div className="text-xs text-gray-500">This Month</div>
              <div className="text-green-500 text-xs mt-1">↗ +8%</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">4.9</div>
              <div className="text-xs text-gray-500">Rating</div>
              <div className="text-yellow-500 text-xs mt-1">★★★★★</div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900 text-sm">Revenue Overview</h4>
              <div className="text-xs text-gray-500">Last 7 days</div>
            </div>
            <div className="h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-end justify-center">
              <div className="w-full h-full bg-gradient-to-t from-purple-400/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-200 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">Payment Received</span>
        </div>
        <div className="text-lg font-bold text-gray-900 mt-1">$2,500</div>
      </div>

      <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-200 transform rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-500" size={12} />
          <span className="text-xs font-medium text-gray-700">New Review</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">"Amazing work!"</div>
      </div>
    </div>
  );
});

// TestimonialCard Component
const TestimonialCard = React.memo(({ quote, author, title, avatar }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transform hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <p className="font-bold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed italic">"{quote}"</p>
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-yellow-400 fill-current" size={16} />
        ))}
      </div>
    </div>
  );
});

// HowItWorksSection Component
const HowItWorksSection = React.memo(() => {
  return (
    <div className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 mb-6">
            <CheckCircle className="text-blue-600 mr-2" size={16} />
            <span className="text-sm font-semibold text-gray-700">EASY AS 1-2-3</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How ArtfulWay Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl">
            Connecting artists and businesses seamlessly, every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group animate-on-scroll opacity-0 translate-y-4" style={{ transitionDelay: '0ms' }}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
              1
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Create Your Profile</h3>
            <p className="text-gray-600 leading-relaxed">
              Showcase your skills, portfolio, and set your preferences to attract the right opportunities.
            </p>
          </div>

          <div className="text-center group animate-on-scroll opacity-0 translate-y-4" style={{ transitionDelay: '150ms' }}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
              2
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Get Matched with Projects</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI intelligently connects you with projects and clients tailored to your expertise.
            </p>
          </div>

          <div className="text-center group animate-on-scroll opacity-0 translate-y-4" style={{ transitionDelay: '300ms' }}>
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
              3
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Collaborate & Earn</h3>
            <p className="text-gray-600 leading-relaxed">
              Work securely, manage milestones, and receive timely payments through our protected escrow system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

// Testimonials Section
const TestimonialsSection = React.memo(() => {
  return (
    <div id="testimonials" className="relative z-10 py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-green-100 rounded-full border border-teal-200 mb-6">
            <Users className="text-teal-600 mr-2" size={16} />
            <span className="text-sm font-semibold text-gray-700">HEAR FROM OUR USERS</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl">
            Real stories from artists and businesses thriving with ArtfulWay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="ArtfulWay transformed how I find projects. The AI matching is spot on, and payments are always secure. Highly recommend!"
            author="Alice Johnson"
            title="Freelance Illustrator"
            avatar="https://randomuser.me/api/portraits/women/68.jpg"
          />
          <TestimonialCard
            quote="We've found incredible talent through ArtfulWay. The platform is intuitive, and the quality of work we receive is consistently high."
            author="Bob Williams"
            title="Creative Director at InnovateCorp"
            avatar="https://randomuser.me/api/portraits/men/70.jpg"
          />
          <TestimonialCard
            quote="Finally, a platform that truly understands artists' needs. The community aspect is fantastic for networking and support."
            author="Carla Davis"
            title="Digital Artist"
            avatar="https://randomuser.me/api/portraits/women/72.jpg"
          />
        </div>
      </div>
    </div>
  );
});

// Comparison Card Component
const ComparisonCard = React.memo(() => {
  const comparisons = [
    {
      feature: "Payment Protection",
      artfulway: "Secure escrow system with milestone payments",
      others: "Basic payment processing",
      highlight: true
    },
    {
      feature: "AI Matching",
      artfulway: "Smart algorithm matches skills & style",
      others: "Manual browsing only",
      highlight: true
    },
    {
      feature: "Portfolio Optimization",
      artfulway: "AI-powered suggestions & analytics",
      others: "Static portfolio display",
      highlight: false
    },
    {
      feature: "Community",
      artfulway: "Thriving artist & business network",
      others: "Isolated transactions",
      highlight: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="p-8 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Feature</h3>
          </div>
          <div className="p-8 bg-gradient-to-br from-gray-900 to-black">
            <h3 className="text-xl font-bold text-white mb-2">ArtfulWay</h3>
          </div>
          <div className="p-8 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Others</h3>
          </div>
        </div>
        
        {comparisons.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-gray-100">
            <div className="p-6 bg-white">
              <p className="font-semibold text-gray-900">{item.feature}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black">
              <p className="text-white font-medium">{item.artfulway}</p>
              {item.highlight && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    ✨ Premium
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50">
              <p className="text-gray-600">{item.others}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const Landing = () => {
  const [text, setText] = useState("");
  const fullText = "AI-Matched Talent. Dynamic Portfolios. Seamless Collaboration";
  const [index, setIndex] = useState(0);
  const headingRef = useRef(null);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);

  useEffect(() => {
    if (isHeadingVisible) {
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
    } else if (index !== 0 || text !== "") {
      // Reset animation when not visible
      setIndex(0);
      setText("");
    }
  }, [index, fullText, isHeadingVisible, text]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeadingVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, [headingRef]);

  const features = [
    {
      icon: <Workflow className="text-white" size={24} />,
      title: "Multi-Artist Workflow",
      description: "Break large creative projects into smaller tasks and assign them to the best-fit artists using our dependency graph logic and smart task allocation.",
      gradient: "from-fuchsia-500 to-purple-600"
    },
    {
      icon: <MonitorCheck className="text-white" size={24} />,
      title: "On-Screen Creative Assistant",
      description: "Stay aligned with client expectations in real-time using our AI design coach for trend suggestions, brand alignment, and live quality checks.",
      gradient: "from-cyan-500 to-sky-600"
    },
    {
      icon: <Sparkles className="text-white" size={24} />,
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithms connect artists with projects that match their style, expertise, and career goals.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Zap className="text-white" size={24} />,
      title: "Portfolio Optimization",
      description:
        "AI tools analyze your portfolio and suggest improvements to attract your ideal clients and projects.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Star className="text-white" size={24} />,
      title: "Quality Assurance",
      description:
        "Our review system maintains high standards while providing constructive feedback for improvement.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: <Shield className="text-white" size={24} />,
      title: "Secure Payments",
      description:
        "Our escrow system ensures artists get paid fairly and clients receive quality work, with milestone-based releases.",
      gradient: "from-blue-500 to-purple-600"
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;

        if (isVisible) {
          el.classList.remove("opacity-0", "translate-y-4");
          el.classList.add("opacity-100", "translate-y-0");
        }
      });
    };

    const debounce = (func, delay) => {
      let timeout;
      return function executed(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
      };
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    window.addEventListener("scroll", debouncedHandleScroll);
    debouncedHandleScroll(); // Initial check on mount

    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  return (
    <div className="bg-white relative min-h-screen overflow-hidden">
      {/* Geometric Background Elements */}
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

      {/* Hero Section */}
      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">The Future of Creative Collaboration</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span ref={headingRef} className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {text}
                  </span>
                  <span className="animate-pulse text-gray-900">|</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                "Unleashing the next generation of creative freelancing—where AI empowers artists, and businesses scale effortlessly."
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                </button>

                <button className="group px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <Play className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 from 1000+ reviews</span>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Mockup */}
            <div className="relative">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Section */}
      <div id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200 mb-6">
              <Sparkles className="text-purple-600 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">POWERFUL FEATURES</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose ArtfulWay?
            </h2>

            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              Our platform is designed with both artists and businesses in mind,
              providing tools that foster creativity, fairness, and growth.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Comparison Section */}
      <div className="relative z-10 py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-200 mb-6">
              <BarChart3 className="text-orange-600 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">Why We're Different</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Not Just Another Freelance Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xl">
              See how ArtfulWay stands out from traditional platforms
            </p>
          </div>

          <ComparisonCard />
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 sm:p-16 shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your Creative Journey?
              </h2>

              <p className="text-gray-300 mb-10 text-xl leading-relaxed">
                Join thousands of artists and businesses already using ArtfulWay
                to connect, create, and grow.
              </p>

              <button className="group px-12 py-5 bg-white text-gray-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg">
                <span className="flex items-center justify-center">
                  Get Started Now
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </button>

              <p className="text-gray-400 mt-8 text-lg">
                No credit card required. Start for free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default Landing;