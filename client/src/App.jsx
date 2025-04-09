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
import ReduxHydrationWrapper from "../components/ReduxHydrationWrapper";
import SubmitProj from "../pages/SubmitProj";
import ArtistProjectDetails from "../components/viewDetails/Artist";

function App() {
  const dispatch = useDispatch();
  const isHydrated = useSelector((state) => state.auth !== undefined && state.navbar !== undefined);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchUser = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token) {
        const decodedToken = jwtDecode(token);
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
  }, [dispatch, isHydrated]);

  return (
    <ReduxHydrationWrapper>
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
        <Route path="/submit_proj" element={<SubmitProj />} />
        <Route path="/artist/project/:project_id" element={<ArtistProjectDetails />} />

      </Routes>
      <Footer />
    </ReduxHydrationWrapper>
  );
}

export default App;
