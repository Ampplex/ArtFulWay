import React, { useState, useEffect } from "react";
import {
  Shield,
  Sparkles,
  Zap,
  Users,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  BarChart3,
  Workflow,
  MonitorCheck,
  Menu,
  X
} from "lucide-react";

// Hooks
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

// Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          ArtfulWay
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-600">Features</a>
            <a href="#how-it-works" className="text-gray-600">How it Works</a>
            <a href="#testimonials" className="text-gray-600">Reviews</a>
            <button className="px-4 py-2 bg-black text-white rounded-lg text-left">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Vertical Rolling Text
const RollingText = () => {
  const texts = ["AI-Matched Talent", "Smart Portfolios", "Secure Payments", "Creative Excellence"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 flex items-center justify-center overflow-hidden relative">
      <div className="relative w-full flex justify-center">
        {texts.map((text, index) => (
          <div
            key={text}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? '-translate-y-10 opacity-100'
                : index < currentIndex
                ? '-translate-y-full opacity-0'
                : 'translate-y-full opacity-0'
            }`}
          >
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-4xl md:text-6xl whitespace-nowrap">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Counter
const StatsCounter = ({ end, label, suffix = "" }) => {
  const count = useCountUp(end);
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Feature Card
const FeatureCard = ({ icon, title, description, gradient, index }) => (
  <div 
    className="group relative overflow-hidden"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-cyan-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-0"></div>
    
    {/* Floating orb effect */}
    <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:border-white/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 h-full">
      {/* Icon with enhanced styling */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  </div>
);

// Process Step
const ProcessStep = ({ number, title, description, delay = 0 }) => (
  <div className="text-center" style={{ animationDelay: `${delay}ms` }}>
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial Card
const TestimonialCard = ({ quote, author, title }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="text-yellow-400 fill-current" size={14} />
      ))}
    </div>
    <p className="text-gray-700 mb-4 text-sm italic">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900 text-sm">{author}</p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  </div>
);

// Main Landing Component
const Landing = () => {
  const features = [
    {
      icon: <Sparkles className="text-white" size={20} />,
      title: "AI Matching",
      description: "Smart algorithms connect you with perfect projects based on your style and expertise.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Shield className="text-white" size={20} />,
      title: "Secure Payments",
      description: "Protected escrow system ensures fair payment with milestone-based releases.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Workflow className="text-white" size={20} />,
      title: "Smart Workflow",
      description: "Break large projects into tasks with intelligent dependency management.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: <MonitorCheck className="text-white" size={20} />,
      title: "Live Assistance",
      description: "AI coach provides real-time feedback and quality suggestions.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Zap className="text-white" size={20} />,
      title: "Portfolio Boost",
      description: "AI-powered optimization suggestions to attract ideal clients.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Star className="text-white" size={20} />,
      title: "Quality Control",
      description: "Maintain high standards with our intelligent review system.",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-200/30 to-purple-300/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-white rounded-full border border-purple-100 shadow-sm mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">The Future of Creative Work</span>
            </div>

            {/* Heading with Vertical Rolling Animation */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Creative Work with
              <br />
              <RollingText />
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered platform connecting artists with businesses for seamless creative collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200">
                <span className="flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2" size={16} />
                </span>
              </button>
              <button className="px-8 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center">
                  <Play className="mr-2" size={16} />
                  Watch Demo
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <StatsCounter end={10000} label="Active Artists" suffix="+" />
              <StatsCounter end={5000} label="Projects Done" suffix="+" />
              <StatsCounter end={4.9} label="User Rating" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="text-blue-600 mr-2" size={14} />
              <span className="text-sm font-medium text-blue-900">Simple Process</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ArtfulWay Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to start your creative journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep
              number={1}
              title="Create Profile"
              description="Showcase your skills and set preferences to attract the right opportunities."
            />
            <ProcessStep
              number={2}
              title="Get Matched"
              description="AI connects you with projects tailored to your expertise and style."
              delay={150}
            />
            <ProcessStep
              number={3}
              title="Collaborate"
              description="Work securely with milestone payments through our escrow system."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full mb-4">
              <Sparkles className="text-purple-600 mr-2" size={14} />
              <span className="text-sm font-medium text-purple-900">Powerful Features</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ArtfulWay?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Features designed for both artists and businesses to foster creativity and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full mb-4">
              <Users className="text-green-600 mr-2" size={14} />
              <span className="text-sm font-medium text-green-900">User Stories</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="ArtfulWay transformed how I find projects. The AI matching is incredibly accurate."
              author="Sarah Chen"
              title="Digital Illustrator"
            />
            <TestimonialCard
              quote="We've found amazing talent here. The platform makes collaboration seamless."
              author="Mike Rodriguez"
              title="Creative Director"
            />
            <TestimonialCard
              quote="Finally, a platform that truly understands artists' needs and fair payment."
              author="Emma Taylor"
              title="Graphic Designer"
            />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-orange-100 rounded-full mb-4">
              <BarChart3 className="text-orange-600 mr-2" size={14} />
              <span className="text-sm font-medium text-orange-900">Why Different</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ArtfulWay vs Others</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              <div className="p-4 bg-gray-50 font-semibold text-gray-900">Feature</div>
              <div className="p-4 bg-gray-900 font-semibold text-white">ArtfulWay</div>
              <div className="p-4 bg-gray-50 font-semibold text-gray-900">Others</div>
            </div>
            
            {[
              ["AI Matching", "Smart algorithm matches skills & style", "Manual browsing only"],
              ["Payment Security", "Escrow with milestone payments", "Basic processing"],
              ["Portfolio AI", "AI-powered optimization tips", "Static display"],
              ["Community", "Active network & support", "Isolated transactions"]
            ].map(([feature, artful, others], index) => (
              <div key={index} className="grid grid-cols-3 gap-0 border-t border-gray-100">
                <div className="p-4 text-sm text-gray-900">{feature}</div>
                <div className="p-4 bg-gray-900 text-sm text-white">{artful}</div>
                <div className="p-4 text-sm text-gray-600">{others}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Creative Journey?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of artists and businesses already using ArtfulWay.
              </p>
              <button className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200">
                <span className="flex items-center justify-center">
                  Get Started Now
                  <ArrowRight className="ml-2" size={18} />
                </span>
              </button>
              <p className="text-gray-400 mt-6">No credit card required</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;