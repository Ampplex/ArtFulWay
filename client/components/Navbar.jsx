import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold">ArtfulWay</a>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <ul className={`md:flex space-x-6 ${isOpen ? "block" : "hidden"} md:block`}>
          <li><a href="/" className="hover:text-gray-400">Home</a></li>
          <li><a href="#" className="hover:text-gray-400">Products</a></li>
          <li><a href="#" className="hover:text-gray-400">Resources</a></li>
          <li><a href="#" className="hover:text-gray-400">Pricing</a></li>
        </ul>

        <div className="hidden md:flex space-x-4">
            <Link to='/login'>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
                    Log in
                </button>
            </Link>

            <Link to='/signup'>
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    Create account
                </button>
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
