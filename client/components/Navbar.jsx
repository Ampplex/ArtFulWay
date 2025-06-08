import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, LayoutDashboard, Palette } from "lucide-react";
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

  const renderAuthButtons = () => {
    if (userLoggedIn) {
      return (
        <div className="flex flex-row gap-3">
          <Link
            to={
              userRole === "client" ? "/client_dashboard" : "/artist_dashboard"
            }
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => LogOut()}
            className="hidden md:block px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            LogOut
          </motion.div>
        </div>
      );
    }

    return (
      <>
        <Link to="/login">
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </motion.div>
        </Link>
        <button className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          Start Free
        </button>
      </>
    );
  };

  const renderMobileAuthButtons = () => {
    if (userLoggedIn) {
      return (
        <div className="flex flex-col gap-3">
          <Link
            to={userRole === "client" ? "/client_dashboard" : "/artist_dashboard"}
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => LogOut()}
            className="w-full px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
          >
            LogOut
          </motion.div>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
        <button className="text-gray-600 hover:text-gray-900 font-medium text-left">
          Sign In
        </button>
        <button className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
          Start Free
        </button>
      </div>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Palette className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold text-gray-900">ArtfulWay</span>
              </Link>
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item) =>
                isHashLink(item.id) ? (
                  <motion.div
                    key={item.id}
                    className={`px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 font-medium cursor-pointer ${
                      activeSection === item.id
                        ? "text-gray-900 bg-gray-100"
                        : ""
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
                      className={`px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 font-medium ${
                        activeSection === item.id
                          ? "text-gray-900 bg-gray-100"
                          : ""
                      } transition-all duration-200`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center space-x-4">
              {renderAuthButtons()}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden rounded-md p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
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
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) =>
                isHashLink(item.id) ? (
                  <motion.div
                    key={item.id}
                    className={`flex items-center justify-between cursor-pointer ${
                      activeSection === item.id
                        ? "text-gray-900 bg-gray-100 border-l-4 border-purple-500"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } block px-3 py-4 rounded-md text-base font-medium`}
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Link
                    key={item.id}
                    to={item.id}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className={`flex items-center justify-between ${
                        activeSection === item.id
                          ? "text-gray-900 bg-gray-100 border-l-4 border-purple-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      } block px-3 py-4 rounded-md text-base font-medium`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                )
              )}

              <div className="flex gap-2 pt-4 pb-2">
                {renderMobileAuthButtons()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
