import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Adjust path to your firebaseConfig file

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    if (email && email.includes("@")) {
      try {
        // Add email to Firestore
        await addDoc(collection(db, "subscribers"), {
          email: email,
          timestamp: new Date(),
        });

        setIsSubscribed(true);
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail("");
        }, 3000);
      } catch (error) {
        console.error("Error adding email to Firestore: ", error);
      }
    }
  };

  return (
    <>
      {/* Main Footer Section */}
      <div className="relative z-10 py-16 bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">
                About ArtfulWay
              </h3>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <p className="text-gray-300">
                ArtfulWay connects creative talent with businesses seeking
                quality artistic work. Our platform ensures fair project
                matching, secure payments, and provides AI-driven tools to
                empower the creative economy.
              </p>
              <p className="text-gray-400">
                Founded in 2024, we're on a mission to transform how artists
                collaborate and grow their careers in the digital age.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">Quick Links</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <ul className="space-y-2">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/services", label: "Our Services" },
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/pricing", label: "Pricing Plans" },
                  { href: "/testimonials", label: "Testimonials" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/contact", label: "Contact Us" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">Resources</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <ul className="space-y-2">
                {[
                  { href: "/blog", label: "Art Blog" },
                  { href: "/tutorials", label: "Creative Tutorials" },
                  { href: "/events", label: "Upcoming Events" },
                  { href: "/marketplace", label: "Marketplace" },
                  { href: "/community", label: "Community Forum" },
                  { href: "/career-resources", label: "Career Resources" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaEnvelope className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <a
                      href="mailto:hello@artfulway.in"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      hello@artfulway.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhoneAlt className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-300 font-medium">Phone</p>
                    <a
                      href="tel:+918668959768"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      +91 8668959768
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-300 font-medium">Location</p>
                    <p className="text-gray-400">
                      Koregaon Park, Pune
                      <br />
                      Maharashtra, India - 411001
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Newsletter and Social Media */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold text-white">
                  Stay Updated
                </h4>
                <p className="text-gray-400">
                  Subscribe to our newsletter for creative insights,
                  opportunities, and exclusive offers.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-md gap-2"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-l-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubscribed}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-r-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    {isSubscribed ? "Thank You!" : "Subscribe"}
                  </motion.button>
                </form>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-sm"
                  >
                    You're subscribed! We'll keep you updated.
                  </motion.p>
                )}
              </motion.div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4 text-center lg:text-right"
              >
                <h4 className="text-lg font-semibold text-white">Follow Us</h4>
                <p className="text-gray-400">
                  Join our creative community on social media for inspiration
                  and updates.
                </p>
                <div className="flex justify-center lg:justify-end gap-4">
                  {[
                    {
                      href: "https://www.instagram.com/artfullway/",
                      icon: <FaInstagram className="w-6 h-6 text-white" />,
                      label: "Instagram",
                    },
                    {
                      href: "https://www.linkedin.com/company/artfulway/",
                      icon: <FaLinkedin className="w-6 h-6 text-white" />,
                      label: "LinkedIn",
                    },
                    {
                      href: "https://www.youtube.com/@Artfullways",
                      icon: <FaYoutube className="w-6 h-6 text-white" />,
                      label: "YouTube",
                    },
                    {
                      href: "https://x.com/artfullway",
                      icon: (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                      label: "X",
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.href}
                      whileHover={{ scale: 1.1 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-block"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center transition-transform duration-300 hover:bg-purple-600/40">
                        {social.icon}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="relative z-10 py-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ArtfulWay. All rights reserved.
            </div>
            <div className="flex gap-6">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/cookies-policy", label: "Cookies Policy" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 text-sm hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
