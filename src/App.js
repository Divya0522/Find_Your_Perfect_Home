
import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import Home from "./components/Home/Home";
import AboutUs from "./components/About/AboutUs";
import ContactUs from "./components/ContactUs";
import SignUpSignInAuth from "./components/SignUpSignInAuth";
import AdminDashboard from "./components/AdminDashboard";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import RealEstateSearch from "./components/RealEstateSearch";
import Chat from "./pages/Chat";
import Profile from "./components/Profile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ListingForm from "./components/ListingForm";
import ListingList from "./components/ListingList";
import SellerDashboard from "./components/SellerDashboard";
import LikedProperties from "./pages/LikedProperties";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import PropertyDetails from "./components/PropertyDetails";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import BlockedUsers from "./components/BlockedUsers";
import LoanRequestForm from "./components/LoanRequestForm";

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  // Add this in your main App.js
useEffect(() => {
  if (typeof window !== 'undefined' && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);


  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
          <Route path="/contact-us" element={<Layout><ContactUs /></Layout>} />
          <Route path="/signin" element={<SignUpSignInAuth />} />
          <Route path="/signup" element={<SignUpSignInAuth />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/liked-properties" element={<LikedProperties/>}/>
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/create-listing" element={<ListingForm/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blocked-users" element={<BlockedUsers/>}/>
          <Route path="/loan-form" element={<LoanRequestForm/>}/>
    {/* Route for Reset Password with token as a parameter */}
    <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
  path="/create-listing"
  element={
    <ProtectedRoutes requiredRole="sell">
      <ListingForm />
    </ProtectedRoutes>
  }
/>
          <Route
            path="/search"
            element={
              <ProtectedRoutes requiredRole="buy/rent">
                <RealEstateSearch />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/listings"
            element={
              <ProtectedRoutes requiredRole="sell"> {/* Only sellers can manage listings */}
                <Layout>
                  <ListingList />
                  <ListingForm />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route path="/chat" element={<ProtectedRoutes><Chat/></ProtectedRoutes>} />
        </Routes>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}

export default App;