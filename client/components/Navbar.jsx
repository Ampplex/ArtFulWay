import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { resetNavbar } from "../redux/navbar/navbarSlice";
import { logOut } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const userLoggedIn = useSelector((state) => !!state.auth.token);
  const userRole = useSelector((state) => state.auth.user_role);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };

  const LogOut = () => {
    dispatch(logOut());
    dispatch(resetNavbar());
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        if (isOpen) setIsOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Updated sections to match landing page
      const sections = ["features", "how-it-works", "testimonials", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  // Updated navigation items to match landing page
  const navigationItems = [
    { name: "Home", id: "/" },
    { name: "Features", id: "features" },
    { name: "How it Works", id: "how-it-works" },
    { name: "Reviews", id: "testimonials" },
    { name: "Contact", id: "contact" },
  ];

  const isHashLink = (id) => id !== "/" && id.charAt(0) !== "/";

  const renderAuthButtons = () => {
    if (userLoggedIn) {
      return (
        <div className="flex items-center space-x-3">
          <Link
            to={
              userRole === "client" ? "/client_dashboard" : "/artist_dashboard"
            }
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-all duration-200 border border-gray-200"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => LogOut()}
            className="hidden md:block px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Log Out
          </motion.button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-6">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            Sign In
          </motion.button>
        </Link>
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Get Started
            <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    );
  };

  const renderMobileAuthButtons = () => {
    if (userLoggedIn) {
      return (
        <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
          <Link
            to={userRole === "client" ? "/client_dashboard" : "/artist_dashboard"}
            onClick={() => setIsOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => LogOut()}
            className="w-full px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Log Out
          </motion.button>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
        <Link to="/login" onClick={() => setIsOpen(false)}>
          <button className="w-full text-gray-600 hover:text-gray-900 font-medium text-center py-2 transition-colors duration-200">
            Sign In
          </button>
        </Link>
        <Link to="/register" onClick={() => setIsOpen(false)}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Get Started
            <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo - exactly matching landing page style */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ArtfulWay
            </Link>
          </motion.div>

          {/* Desktop Navigation - matching landing page spacing and styling */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) =>
              isHashLink(item.id) ? (
                <motion.button
                  key={item.id}
                  className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium ${
                    activeSection === item.id ? "text-gray-900" : ""
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  {item.name}
                </motion.button>
              ) : (
                <Link key={item.id} to={item.id}>
                  <motion.div
                    className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium ${
                      activeSection === item.id ? "text-gray-900" : ""
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              )
            )}
          </div>

          {/* Right side: Auth buttons + Mobile menu toggle */}
          <div className="flex items-center">
            {renderAuthButtons()}
            
            {/* Mobile menu button - matching landing page style */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden ml-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - matching landing page mobile menu style */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100 p-6"
            >
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) =>
                  isHashLink(item.id) ? (
                    <motion.button
                      key={item.id}
                      className={`text-left text-gray-600 hover:text-gray-900 transition-colors duration-200 ${
                        activeSection === item.id ? "text-gray-900 font-medium" : ""
                      }`}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.button>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.id}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className={`text-gray-600 hover:text-gray-900 transition-colors duration-200 ${
                          activeSection === item.id ? "text-gray-900 font-medium" : ""
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  )
                )}
                
                {renderMobileAuthButtons()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;