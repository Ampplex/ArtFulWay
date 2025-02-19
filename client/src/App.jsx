import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "../components/Navbar";
import LoginPage from "../pages/Login";
import Signup from "../pages/SignUp";
import Landing from "../pages/landing";
import Artist_Client from "../pages/Artist_Client";
import Client from "../pages/Onboarding/Client";
import Artist from "../pages/Onboarding/Artist";
import Artist_SignUp from "../pages/SignUp/Artist/SignUp";
import Client_SignUp from "../pages/SignUp/Client/SignUp";
import ScrollToTop from "../components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      {/* <Router> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup_client" element={<Client_SignUp />} />
          <Route path="/signup_artist" element={<Artist_SignUp />} />
          <Route path="/artist_client" element={<Artist_Client />} />
          <Route path="/client_onboarding" element={<Client />} />
          <Route path="/artist_onboarding" element={<Artist />} />
        </Routes>
      {/* </Router> */}
    </>
  );
}

export default App;
