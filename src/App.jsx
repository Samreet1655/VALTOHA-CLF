import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component ko lazy load karein taaki build fast ho
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VillageLedger = lazy(() => import('./pages/VillageLedger'));
const CadreDashboard = lazy(() => import('./pages/CadreDashboard'));

function App() {
  return (
    <Router>
      {/* Suspense zaroori hai lazy components ke liye */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/village/:villageName" element={<VillageLedger />} />
          <Route path="/cadre-dashboard" element={<CadreDashboard />} />
          <Route path="/village/:villageName" element={<VillageLedger />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;