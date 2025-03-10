import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "../components/Navbar";
import LoginPage from "../pages/Login";
import Landing from "../pages/landing";
import Artist_Client from "../pages/Artist_Client";
import Client from "../pages/Onboarding/Client";
import Artist from "../pages/Onboarding/Artist";
import Artist_SignUp from "../pages/SignUp/Artist/SignUp";
import Client_SignUp from "../pages/SignUp/Client/SignUp";
import ScrollToTop from "../components/ScrollToTop";
import ArtistDashboard from "../Dashboards/Artist";
import ClientDashboard from "../Dashboards/Client";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn, setUserRole } from "../redux/navbar/navbarSlice";
import { setCredentials } from "../redux/auth/authSlice";
import { useEffect } from "react";
import Add_Proj from "../pages/Add_Proj";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetching user if present in the local storage
    const fetchUser = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token) {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        dispatch(setLoggedIn(true));
        dispatch(setUserRole(role));
        dispatch(
          setCredentials({
            token,
            user_id: decodedToken.id,
            email: decodedToken.email,
          })
        );
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup_client" element={<Client_SignUp />} />
        <Route path="/signup_artist" element={<Artist_SignUp />} />
        <Route path="/artist_client" element={<Artist_Client />} />
        <Route path="/client_onboarding" element={<Client />} />
        <Route path="/artist_onboarding" element={<Artist />} />
        <Route path="/artist_dashboard" element={<ArtistDashboard />} />
        <Route path="/client_dashboard" element={<ClientDashboard />} />
        <Route path="/add_proj" element={<Add_Proj />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
