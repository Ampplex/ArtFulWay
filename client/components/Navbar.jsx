import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        if (isOpen) setIsOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      
      // Update active section based on scroll position
      const sections = ["features", "testimonials", "pricing", "contact"];
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
  
  const navigationItems = [
    { name: "Home", id: "/" },
    { name: "Features", id: "features" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ];

  const isHashLink = (id) => id !== "/" && id.charAt(0) !== "/";

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : -100,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      >
        <div className="bg-gradient-to-r from-black via-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Link to="/" className="flex items-center">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-xl">
                    ArtfulWay
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-1">
                {navigationItems.map((item) => (
                  isHashLink(item.id) ? (
                    <motion.div
                      key={item.id}
                      className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                        activeSection === item.id
                          ? "text-white bg-purple-600/20 border-b-2 border-purple-500"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      } transition-all duration-200`}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {item.name}
                    </motion.div>
                  ) : (
                    <Link key={item.id} to={item.id}>
                      <motion.div
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          activeSection === item.id
                            ? "text-white bg-purple-600/20 border-b-2 border-purple-500"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        } transition-all duration-200`}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  )
                ))}
              </div>

              {/* Sign In + Mobile Menu Button */}
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:block bg-white text-black px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md shadow-purple-500/20"
                  >
                    Sign In
                  </motion.div>
                </Link>
                
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md shadow-purple-500/20"
                  >
                    Get Started
                  </motion.div>
                </Link>

                {/* Mobile menu button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden rounded-md p-2 text-gray-300 hover:text-white focus:outline-none"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-gradient-to-b from-gray-900 to-black border-b border-white/10 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                isHashLink(item.id) ? (
                  <motion.div
                    key={item.id}
                    className={`flex items-center justify-between cursor-pointer ${
                      activeSection === item.id
                        ? "text-white bg-purple-600/20 border-l-4 border-purple-500"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    } block px-3 py-4 rounded-md text-base font-medium`}
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Link key={item.id} to={item.id} onClick={() => setIsOpen(false)}>
                    <motion.div
                      className={`flex items-center justify-between ${
                        activeSection === item.id
                          ? "text-white bg-purple-600/20 border-l-4 border-purple-500"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      } block px-3 py-4 rounded-md text-base font-medium`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                )
              ))}
              
              <div className="flex gap-2 pt-4 pb-2">
                <Link to="/login" className="w-1/2" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-black px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center"
                  >
                    <p className="font-bold text-amber-200">Sign In</p>
                  </motion.div>
                </Link>
                
                <Link to="/register" className="w-1/2" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center"
                  >
                    Get Started
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;