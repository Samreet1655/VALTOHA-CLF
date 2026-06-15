// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import AdminDashboard from './pages/AdminDashboard';
// import VillageLedger from './pages/VillageLedger'; // 👈 1. Yeh import add karo
// import CadreDashboard from './pages/CadreDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* 1. Sabse pehle khulega Landing Page */}
//         <Route path="/" element={<LandingPage />} />
        
//         {/* 2. Get Started dabane par khulega Login Page */}
//         <Route path="/login" element={<LoginPage />} />
        
//         {/* 3. Secure Login karne par khulega Admin Dashboard */}
//         <Route path="/admin" element={<AdminDashboard />} />

//         {/* 4. CRITICAL FIX: Ledger page ka rasta yahan set karo */}
//         <Route path="/admin/village/:villageName" element={<VillageLedger />} />
//         <Route path="/cadre-dashboard" element={<CadreDashboard />} />
//         <Route path="/village/:villageName" element={<VillageLedger />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;












import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Sabhi components ko lazy import karein
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VillageLedger = lazy(() => import('./pages/VillageLedger'));
const CadreDashboard = lazy(() => import('./pages/CadreDashboard'));

function App() {
  return (
    <Router>
      {/* 2. Suspense wrapper se Routes ko cover karein */}
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>}>
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