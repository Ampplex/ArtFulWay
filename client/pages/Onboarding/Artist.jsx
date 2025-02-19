import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  BookOpen,
  Zap,
  LineChart,
  Users,
  Award,
  Check,
  ArrowRight,
  Star,
  Rocket,
  Shield,
} from "lucide-react";
import ArtistComparisonCard from "../../components/ArtistComparisonCard";
import { Link } from "react-router-dom";

function Artist() {
  const scrollToCTA = () => {
    const ctaSection = document.getElementById("start-your-journey");
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 pt-20"
        >
          <div className="mb-6">
            <span className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
              Your Creative Journey Starts Here
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100 mb-6">
            Turn Your Passion into a Thriving Career
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful artists who've found their creative
            home on ArtfulWay. Unlike other platforms, we're committed to your
            long-term growth with AI-powered opportunities, guaranteed fair pay,
            and a supportive community.
          </p>
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToCTA}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Begin Your Success Story
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {[
            {
              icon: <Target />,
              title: "Smart Opportunity Matching",
              description:
                "Our AI ensures you never miss relevant projects, with guaranteed response times and fair competition based on skills, not just reviews.",
            },
            {
              icon: <Shield />,
              title: "Guaranteed Fair Pay",
              description:
                "Transparent 20-30% commission structure with secure payments and clear terms. No more chasing clients or dealing with payment uncertainty.",
            },
            {
              icon: <Rocket />,
              title: "AI Career Acceleration",
              description:
                "Our AI analyzes your work and market trends to suggest high-paying opportunities and skill development paths tailored to your goals.",
            },
            {
              icon: <Star />,
              title: "Quality Recognition",
              description:
                "Stand out with our verified artist badge, showcase your expertise, and get featured in our top talent pool for premium opportunities.",
            },
            {
              icon: <Users />,
              title: "Supportive Community",
              description:
                "Connect with fellow artists, share experiences, and access mentorship from industry leaders. You're never alone in your journey.",
            },
            {
              icon: <Award />,
              title: "Long-Term Growth",
              description:
                "Access exclusive job opportunities, partnership deals, and career advancement paths that go beyond freelancing.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-5 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-purple-600/10 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-purple-400">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="text-center mb-12">
            <span className="px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
              Why We're Different
            </span>
            <h2 className="text-3xl font-bold text-white mt-6 mb-4">
              Not Just Another Freelance Platform
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              See how ArtfulWay stands out from traditional platforms by putting
              artists first
            </p>
          </div>

          <ArtistComparisonCard />

          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg backdrop-blur-md bg-white/5"
            >
              <h4 className="text-3xl font-bold text-purple-400 mb-2">85%</h4>
              <p className="text-gray-300 text-sm">Higher Project Match Rate</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg backdrop-blur-md bg-white/5"
            >
              <h4 className="text-3xl font-bold text-purple-400 mb-2">40%</h4>
              <p className="text-gray-300 text-sm">Average Income Increase</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg backdrop-blur-md bg-white/5"
            >
              <h4 className="text-3xl font-bold text-purple-400 mb-2">24h</h4>
              <p className="text-gray-300 text-sm">
                Average Project Match Time
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg backdrop-blur-md bg-white/5"
            >
              <h4 className="text-3xl font-bold text-purple-400 mb-2">92%</h4>
              <p className="text-gray-300 text-sm">Artist Satisfaction Rate</p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          id="start-your-journey"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative py-8"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-full" />

          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Your Success Story Begins Here
              </h2>
              <p className="text-gray-300 mb-6 text-base max-w-2xl mx-auto">
                Join thousands of artists who've found sustainable success on
                ArtfulWay. We're more than a platform - we're your partner in
                building a thriving creative career.
              </p>

              <Link to="/signup_artist">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                    Start Creating Your Future
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <p className="text-gray-400 mt-4 text-sm">
                Join now and get 3 months of premium features free. Limited time
                offer.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Artist;
