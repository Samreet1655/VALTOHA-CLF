import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import VillageLedger from './pages/VillageLedger'; // 👈 1. Yeh import add karo
import CadreDashboard from './pages/CadreDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Sabse pehle khulega Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 2. Get Started dabane par khulega Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 3. Secure Login karne par khulega Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 4. CRITICAL FIX: Ledger page ka rasta yahan set karo */}
        <Route path="/admin/village/:villageName" element={<VillageLedger />} />
        <Route path="/cadre-dashboard" element={<CadreDashboard />} />
        <Route path="/village/:villageName" element={<VillageLedger />} />
      </Routes>
    </Router>
  );
}

export default App;