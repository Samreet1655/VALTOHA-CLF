






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Users, ArrowLeft } from 'lucide-react';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null); 

//   const [usernameInput, setUsernameInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();

//     if (role === 'admin') {
//       if (usernameInput === 'PARMEET SINGH' && passwordInput === '8791') {
//         // Clear old cadre locks, save clear role context
//         sessionStorage.setItem('active_role', 'admin');
//         sessionStorage.removeItem('active_cadre');
//         navigate('/admin');
//       } else {
//         alert("❌ Invalid Admin Credentials!");
//       }
//     } else {
//       const savedVault = localStorage.getItem('credentials_vault');
//       const vault = savedVault ? JSON.parse(savedVault) : [];

//       const foundCadre = vault.find(c => 
//         String(c.cadreId).trim().toLowerCase() === usernameInput.trim().toLowerCase() && 
//         String(c.password).trim() === passwordInput.trim()
//       );

//       if (foundCadre) {
//         const cadreData = { 
//           ...foundCadre, 
//           village: foundCadre.village || 'Valtoha' 
//         };

//         sessionStorage.setItem('active_role', 'cadre');
//         sessionStorage.setItem('active_cadre', JSON.stringify(cadreData));
        
//         alert(`🎉 Welcome ${cadreData.name}!`);
//         navigate('/cadre-dashboard'); 
//       } else {
//         alert("❌ Authentication Failed!");
//       }
//     }
//   };

//   const handleRoleSelection = (selectedRole) => {
//     setRole(selectedRole);
//     setUsernameInput('');
//     setPasswordInput('');
//   };

//   const handleCadreLoginBackend = async (enteredId, enteredPassword) => {
//   try {
//     // Fetch user details from profiles table
//     const { data: profile, error } = await supabase
//       .from('profiles')
//       .select('username, full_name, phone, password, role, assigned_villages')
//       .eq('username', enteredId.trim())
//       .eq('role', 'cadre')
//       .single();

//     if (error || !profile) return alert("Cadre Profile not found.");
//     if (profile.password !== enteredPassword) return alert("Invalid Security Token.");

//     // Extracting the clean native postgres array
//     const villagesArray = profile.assigned_villages || [];

//     const sessionPayload = {
//       cadreId: profile.username,
//       name: profile.full_name,
//       phone: profile.phone,
//       village: villagesArray[0] || "Valtoha", // Layout compatibility fallback index
//       villages: villagesArray // The complete dynamic 1-to-many text array matrix
//     };

//     sessionStorage.setItem('active_role', 'cadre');
//     sessionStorage.setItem('active_cadre', JSON.stringify(sessionPayload));

//     navigate('/cadre-dashboard');
//   } catch (err) {
//     console.error("Login Exception:", err.message);
//   }
// };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#fcf9f2]">
      
//       <button 
//         onClick={() => navigate('/')} 
//         className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
//       >
//         <ArrowLeft size={16} /> Back to Home
//       </button>

//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        
//         {!role ? (
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-slate-800">Select Login Role</h2>
//             <p className="text-sm text-slate-500 mt-1">Choose your account type to proceed</p>
//           </div>
//         ) : (
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-slate-800 capitalize">{role} Hub</h2>
//             <p className="text-sm text-slate-500 mt-1">⚡ TESTING BYPASS ACTIVE ⚡</p>
//           </div>
//         )}

//         {!role ? (
//           <div className="flex flex-col gap-4">
//             <button 
//               onClick={() => handleRoleSelection('admin')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-amber-50/40 border-2 border-slate-200 hover:border-amber-500 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-amber-100 rounded-lg text-amber-500 group-hover:scale-105 transition-transform">
//                 <Shield size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Admin Login</h3>
//                 <p className="text-xs text-slate-500">For Block Program Manager panel</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => handleRoleSelection('cadre')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-emerald-600 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-105 transition-transform">
//                 <Users size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Cadre Access</h3>
//                 <p className="text-xs text-slate-500">For assigned village field workers</p>
//               </div>
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
//                 {role === 'admin' ? 'Admin User ID' : 'Cadre ID (Type Anything)'}
//               </label>
//               <input 
//                 type="text" 
//                 required
//                 placeholder={role === 'admin' ? "e.g. admin" : "Kuch bhi likh do..."} 
//                 value={usernameInput}
//                 onChange={(e) => setUsernameInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm font-semibold"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
//               <input 
//                 type="password" 
//                 required
//                 placeholder="••••••••" 
//                 value={passwordInput}
//                 onChange={(e) => setPasswordInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
//               />
//             </div>

//             <button 
//               type="submit"
//               className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer ${
//                 role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
//               }`}
//             >
//               Secure Login (Bypass Active)
//             </button>

//             <button 
//               type="button"
//               onClick={() => setRole(null)}
//               className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors pt-2 cursor-pointer"
//             >
//               Go Back to Role Selection
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



















































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Users, ArrowLeft } from 'lucide-react';
// import { supabase } from '../supabaseClient'; // 👈 Client Import kiya

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null); 

//   const [usernameInput, setUsernameInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');

//   // --- 1. CORE AUTH HANDLING CONTROL (SUPABASE LIVE LINK) ---
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     if (role === 'admin') {
//       // Admin bypass control (As per your rule matrix)
//       if (usernameInput === 'PARMEET SINGH' && passwordInput === '8791') {
//         sessionStorage.setItem('active_role', 'admin');
//         sessionStorage.removeItem('active_cadre');
//         navigate('/admin');
//       } else {
//         alert("❌ Invalid Admin Credentials!");
//       }
//     } else {
//       // 🌟 CADRE LIVE DATABASE ROUTING
//       try {
//         // Aapke DB schema (name, role, assigned_villages, password) ke mutabik query mapping
//         const { data: profile, error } = await supabase
//           .from('profiles')
//           .select('id, name, role, assigned_villages, password') // ID primary key fetch logic
//           .eq('name', usernameInput.trim()) // Username input ko profiles ke name filter se link kiya
//           .eq('role', 'cadre')
//           .single();

//         if (error || !profile) {
//           return alert("❌ Cadre Profile not found in cloud database.");
//         }

//         // Plain text checking layer (For current schema compatibility matrix)
//         if (profile.password !== passwordInput.trim()) {
//           return alert("❌ Invalid Security Token / Password.");
//         }

//         const villagesArray = profile.assigned_villages || [];

//         // Exact block session context mapping jo aapki ledger component reads karti hai
//         const sessionPayload = {
//           cadreId: profile.id,
//           name: profile.name,
//           village: villagesArray[0] || "Valtoha", // Layout compatibility fallback index
//           villages: villagesArray // Complete array track structure for Multi-Village mapping
//         };

//         sessionStorage.setItem('active_role', 'cadre');
//         sessionStorage.setItem('active_cadre', JSON.stringify(sessionPayload));

//         alert(`🎉 Welcome ${profile.name}!`);
//         navigate('/cadre-dashboard'); 

//       } catch (err) {
//         console.error("Login Exception Matrix:", err.message);
//         alert("Cloud Connection Fault: " + err.message);
//       }
//     }
//   };

//   const handleRoleSelection = (selectedRole) => {
//     setRole(selectedRole);
//     setUsernameInput('');
//     setPasswordInput('');
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#fcf9f2]">
      
//       <button 
//         onClick={() => navigate('/')} 
//         className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
//       >
//         <ArrowLeft size={16} /> Back to Home
//       </button>

//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        
//         {!role ? (
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-slate-800">Select Login Role</h2>
//             <p className="text-sm text-slate-500 mt-1">Choose your account type to proceed</p>
//           </div>
//         ) : (
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-slate-800 capitalize">{role} Hub</h2>
//             <p className="text-sm text-slate-500 mt-1">⚡ CLOUD DATABASE ACTIVE ⚡</p>
//           </div>
//         )}

//         {!role ? (
//           <div className="flex flex-col gap-4">
//             <button 
//               onClick={() => handleRoleSelection('admin')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-amber-50/40 border-2 border-slate-200 hover:border-amber-500 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-amber-100 rounded-lg text-amber-500 group-hover:scale-105 transition-transform">
//                 <Shield size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Admin Login</h3>
//                 <p className="text-xs text-slate-500">For Block Program Manager panel</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => handleRoleSelection('cadre')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-emerald-600 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-105 transition-transform">
//                 <Users size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Cadre Access</h3>
//                 <p className="text-xs text-slate-500">For assigned village field workers</p>
//               </div>
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
//                 {role === 'admin' ? 'Admin User ID' : 'Cadre Name (As per Database)'}
//               </label>
//               <input 
//                 type="text" 
//                 required
//                 placeholder={role === 'admin' ? "e.g. PARMEET SINGH" : "Enter Cadre Full Name"} 
//                 value={usernameInput}
//                 onChange={(e) => setUsernameInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm font-semibold"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
//               <input 
//                 type="password" 
//                 required
//                 placeholder="••••••••" 
//                 value={passwordInput}
//                 onChange={(e) => setPasswordInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
//               />
//             </div>

//             <button 
//               type="submit"
//               className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer ${
//                 role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
//               }`}
//             >
//               Secure Cloud Login
//             </button>

//             <button 
//               type="button"
//               onClick={() => setRole(null)}
//               className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors pt-2 cursor-pointer"
//             >
//               Go Back to Role Selection
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;














































































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Shield, Users, ArrowLeft } from 'lucide-react';
// import { supabase } from '../supabaseClient'; 

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState(null); 

//   const [usernameInput, setUsernameInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     if (role === 'admin') {
//       if (usernameInput === 'PARMEET SINGH' && passwordInput === '8791') {
//         sessionStorage.setItem('active_role', 'admin');
//         sessionStorage.removeItem('active_cadre');
//         navigate('/admin');
//       } else {
//         alert("❌ Invalid Admin Credentials!");
//       }
//     } else {
//       try {
//         console.log("Searching for Cadre with Name:", usernameInput.trim());

//         // 🌟 Use ilike for case-insensitive matching so spelling cases won't block you
//         const { data: profile, error } = await supabase
//           .from('profiles')
//           .select('*') // Saare columns ek sath fetch kar lo complex debugging ke liye
//           .ilike('name', usernameInput.trim()) 
//           .eq('role', 'cadre')
//           .maybeSingle(); // single() ki jagah maybeSingle() use kiya taaki crash na ho

//         if (error) {
//           console.error("Supabase Query Error:", error);
//           return alert(`❌ Database Error: ${error.message}`);
//         }

//         if (!profile) {
//           console.log("No profile matched in DB rows.");
//           return alert("❌ Cadre Profile not found in cloud database. Please check the exact spelling.");
//         }

//         console.log("Profile Found Successfully:", profile);

//         // Password verification layer
//         // if (String(profile.password).trim() !== passwordInput.trim()) {
//         //   return alert("❌ Invalid Security Token / Password.");
//         // }

//         const villagesArray = profile.assigned_villages || [];

//         const sessionPayload = {
//           cadreId: profile.id,
//           name: profile.name,
//           village: villagesArray[0] || "Valtoha", 
//           villages: villagesArray 
//         };

//         sessionStorage.setItem('active_role', 'cadre');
//         sessionStorage.setItem('active_cadre', JSON.stringify(sessionPayload));

//         alert(`🎉 Welcome ${profile.name}!`);
//         navigate('/cadre-dashboard'); 

//       } catch (err) {
//         console.error("Login Exception Matrix:", err);
//         alert("Cloud Connection Fault: " + err.message);
//       }
//     }
//   };

//   const handleRoleSelection = (selectedRole) => {
//     setRole(selectedRole);
//     setUsernameInput('');
//     setPasswordInput('');
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#fcf9f2]">
//       <button 
//         onClick={() => navigate('/')} 
//         className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
//       >
//         <ArrowLeft size={16} /> Back to Home
//       </button>

//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
//         {!role ? (
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-slate-800">Select Login Role</h2>
//             <p className="text-sm text-slate-500 mt-1">Choose your account type to proceed</p>
//           </div>
//         ) : (
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-slate-800 capitalize">{role} Hub</h2>
//             <p className="text-sm text-slate-500 mt-1">⚡ CLOUD DATABASE ACTIVE ⚡</p>
//           </div>
//         )}

//         {!role ? (
//           <div className="flex flex-col gap-4">
//             <button 
//               onClick={() => handleRoleSelection('admin')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-amber-50/40 border-2 border-slate-200 hover:border-amber-500 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-amber-100 rounded-lg text-amber-500 group-hover:scale-105 transition-transform">
//                 <Shield size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Admin Login</h3>
//                 <p className="text-xs text-slate-500">For Block Program Manager panel</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => handleRoleSelection('cadre')}
//               className="flex items-center gap-4 p-5 w-full bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-emerald-600 rounded-xl transition-all text-left group cursor-pointer"
//             >
//               <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-105 transition-transform">
//                 <Users size={24} />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-800 text-lg">Cadre Access</h3>
//                 <p className="text-xs text-slate-500">For assigned village field workers</p>
//               </div>
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleLoginSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
//                 {role === 'admin' ? 'Admin User ID' : 'Cadre Name'}
//               </label>
//               <input 
//                 type="text" 
//                 required
//                 placeholder={role === 'admin' ? "e.g. PARMEET SINGH" : "Enter Cadre Name"} 
//                 value={usernameInput}
//                 onChange={(e) => setUsernameInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm font-semibold"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
//               <input 
//                 type="password" 
//                 required
//                 placeholder="••••••••" 
//                 value={passwordInput}
//                 onChange={(e) => setPasswordInput(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
//               />
//             </div>

//             <button 
//               type="submit"
//               className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer ${
//                 role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
//               }`}
//             >
//               Secure Cloud Login
//             </button>

//             <button 
//               type="button"
//               onClick={() => setRole(null)}
//               className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors pt-2 cursor-pointer"
//             >
//               Go Back to Role Selection
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




















































import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 
  // State name change kiya taaki ID ke liye clear rahe
  const [cadreIdInput, setCadreIdInput] = useState(''); 
  const [passwordInput, setPasswordInput] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (role === 'admin') {
      if (cadreIdInput === 'PARMEET SINGH' && passwordInput === '8791') {
        sessionStorage.setItem('active_role', 'admin');
        sessionStorage.removeItem('active_cadre');
        navigate('/admin');
      } else {
        alert("❌ Invalid Admin Credentials!");
      }
    } else {
      try {
        // ID-based query (Ensure your Supabase column is named 'cadre_id')
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('cadre_id', cadreIdInput.trim()) 
          .eq('role', 'cadre')
          .maybeSingle();

        if (error) return alert(`❌ Database Error: ${error.message}`);
        if (!profile) return alert("❌ Cadre ID not found. Please check your ID.");

        // Password verification (Case sensitive)
        if (String(profile.password).trim() !== passwordInput.trim()) {
          return alert("❌ Invalid Password.");
        }

        const sessionPayload = {
          cadreId: profile.cadre_id,
          name: profile.name,
          villages: profile.assigned_villages || []
        };

        sessionStorage.setItem('active_role', 'cadre');
        sessionStorage.setItem('active_cadre', JSON.stringify(sessionPayload));

        navigate('/cadre-dashboard'); 

      } catch (err) {
        alert("Cloud Connection Fault: " + err.message);
      }
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setCadreIdInput('');
    setPasswordInput('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#fcf9f2]">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        {!role ? (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Select Login Role</h2>
            <p className="text-sm text-slate-500 mt-1">Choose your account type to proceed</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{role} Hub</h2>
            <p className="text-sm text-slate-500 mt-1">⚡ CLOUD DATABASE ACTIVE ⚡</p>
          </div>
        )}

        {!role ? (
          <div className="flex flex-col gap-4">
            <button onClick={() => handleRoleSelection('admin')} className="flex items-center gap-4 p-5 w-full bg-white hover:bg-amber-50/40 border-2 border-slate-200 hover:border-amber-500 rounded-xl transition-all text-left group cursor-pointer">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-500 group-hover:scale-105 transition-transform"><Shield size={24} /></div>
              <div><h3 className="font-bold text-slate-800 text-lg">Admin Login</h3><p className="text-xs text-slate-500">For Block Program Manager panel</p></div>
            </button>
            <button onClick={() => handleRoleSelection('cadre')} className="flex items-center gap-4 p-5 w-full bg-white hover:bg-emerald-50/40 border-2 border-slate-200 hover:border-emerald-600 rounded-xl transition-all text-left group cursor-pointer">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 group-hover:scale-105 transition-transform"><Users size={24} /></div>
              <div><h3 className="font-bold text-slate-800 text-lg">Cadre Access</h3><p className="text-xs text-slate-500">For assigned village field workers</p></div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                {role === 'admin' ? 'Admin User ID' : 'Cadre ID'}
              </label>
              <input 
                type="text" required placeholder={role === 'admin' ? "e.g. PARMEET SINGH" : "Enter Cadre ID"} 
                value={cadreIdInput}
                onChange={(e) => setCadreIdInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" required placeholder="••••••••" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
              />
            </div>
            <button type="submit" className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer ${role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              Secure Cloud Login
            </button>
            <button type="button" onClick={() => setRole(null)} className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors pt-2 cursor-pointer">
              Go Back to Role Selection
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;