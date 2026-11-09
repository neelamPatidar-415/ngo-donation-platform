
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/public/Home";
import SchemeDetails from "./pages/public/SchemeDetails";
import EligibilityFinder from "./pages/public/EligibilityFinder";
import EligibilityResults from "./pages/public/EligibilityResults";

import Login from "./pages/donor/Login";
import Register from "./pages/donor/Register";
import DonorDashboard from "./pages/donor/DonorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import Campaigns from "./pages/donor/Campaigns";
import CampaignDetails from "./pages/donor/CampaignDetails";

import DonationHistory from "./pages/donor/DonationHistory";

import DonationCheckout from "./pages/donor/DonationCheckout";
import PaymentResult from "./pages/donor/PaymentResult";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminSchemes from "./pages/admin/AdminSchemes";

import AdminCampaigns from "./pages/admin/AdminCampaigns";

import AdminReports from "./pages/admin/AdminReports";

import AdminAIDrafts from "./pages/admin/AdminAIDrafts";

import EligibilityAssistant from "./pages/public/EligibilityAssistant";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
          <Route path="/eligibility" element={<EligibilityFinder />} />
          <Route path="/eligibility/results" element={<EligibilityResults />} />
          <Route
            path="/eligibility-assistant"
            element={<EligibilityAssistant />}
          />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected donor routes */}
          {/* Donor-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["DONOR"]} />}>
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/history" element={<DonationHistory />} />
            <Route
              path="/campaigns/:campaignId/donate"
              element={<DonationCheckout />}
            />
            <Route path="/donor/payment-result" element={<PaymentResult />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["TRUST_ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/schemes" element={<AdminSchemes />} />
            <Route path="/admin/campaigns" element={<AdminCampaigns />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/ai-drafts" element={<AdminAIDrafts />} />
          </Route>

          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:campaignId" element={<CampaignDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
