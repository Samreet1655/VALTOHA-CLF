

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LayoutDashboard, LogOut, MapPin, ArrowRight, User, CircleDot } from 'lucide-react';

// const CadreDashboard = () => {
//   const navigate = useNavigate();
//   const [cadre, setCadre] = useState(null);
//   const [assignedVillages, setAssignedVillages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- COMPACT AUTH TRACKING AND REGISTRY GATEWAY ---
//   useEffect(() => {
//     const sessionRole = sessionStorage.getItem('active_role');
//     const sessionData = sessionStorage.getItem('active_cadre');

//     // Safe route protection
//     if (sessionRole !== 'cadre' || !sessionData) {
//       sessionStorage.clear();
//       navigate('/login');
//       return;
//     }

//     const currentCadre = JSON.parse(sessionData);
//     setCadre(currentCadre);

//     // Dynamic extraction: LocalStorage master list se is cadre ke saare assigned villages find karo
//     const savedVillages = localStorage.getItem('villages_master_list');
//     if (savedVillages) {
//       const allVillages = JSON.parse(savedVillages);
//       // Filter out only those villages mapped to this specific cadreId
//       const matches = allVillages.filter(
//         v => String(v.cadreId).trim().toLowerCase() === String(currentCadre.cadreId).trim().toLowerCase() && v.status === 'Active'
//       );
//       setAssignedVillages(matches);
//     } else {
//       // Fallback fallback if master list wasn't pulled correctly
//       if (currentCadre.village) {
//         setAssignedVillages([{ name: currentCadre.village }]);
//       }
//     }

//     setLoading(false);
//   }, [navigate]);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate('/login');
//   };

//   // Kisi bhi village ledger ko open karte waqt filtering state
// const fetchLedgerForVillage = async (villageName) => {
//   const { data, error } = await supabase
//     .from('ledger entries')
//     .select('*')
//     .eq('village_name', villageName); // Aapke column name ke according match kar lena
// };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
//         <div className="animate-pulse font-black text-slate-400 text-xs tracking-widest uppercase">
//           Loading Cadre Terminal Nodes...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fcf9f2] p-4 md:p-6 font-sans">
      
//       {/* HEADER CONTROL BLOCK */}
//       <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
//             <LayoutDashboard size={20} />
//           </div>
//           <div>
//             <h1 className="text-sm font-black text-slate-800 uppercase tracking-wide">Cadre Operational Workspace</h1>
//             <div className="flex items-center gap-1.5 mt-0.5">
//               <User size={11} className="text-slate-400" />
//               <span className="text-[11px] font-bold text-slate-500">{cadre?.name || "Field Agent"}</span>
//               <span className="text-[10px] text-slate-300 font-bold">•</span>
//               <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
//                 ID: {cadre?.cadreId}
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <button 
//           onClick={handleLogout}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg shadow-2xs transition-all cursor-pointer"
//         >
//           <LogOut size={12} /> Terminate
//         </button>
//       </div>

//       {/* CORE WORKSPACE PANEL */}
//       <div className="max-w-4xl mx-auto space-y-4">
        
//         <div className="mb-2">
//           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Assigned Locations ({assignedVillages.length})</h2>
//         </div>

//         {/* ASSIGNED REGISTRY CARDS GRID MAP */}
//         {assignedVillages.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {assignedVillages.map((villageItem, idx) => (
//               <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
//                 <div>
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/40">
//                         Authorized Zone
//                       </span>
//                       <h2 className="text-lg font-black text-slate-800 mt-2 flex items-center gap-1.5">
//                         <MapPin size={16} className="text-slate-400 shrink-0" />
//                         {villageItem.name}
//                       </h2>
//                     </div>
//                     <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200/50">
//                       <CircleDot size={8} className="animate-ping text-emerald-500" /> Active
//                     </div>
//                   </div>
//                   <p className="text-xs text-slate-400">
//                     Access local citizen data ledger logs, and manage context statements for sector <strong>{villageItem.name}</strong>.
//                   </p>
//                 </div>

//                 <div className="border-t border-slate-50 pt-4 mt-4 flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[150px]">
//                     Ledger: {villageItem.name}
//                   </span>
//                   <button
//                     onClick={() => navigate(`/village/${encodeURIComponent(villageItem.name)}`)}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-lg transition-all cursor-pointer"
//                   >
//                     Open Register <ArrowRight size={11} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-400 font-medium text-xs uppercase tracking-wider">
//             ⚠️ No active village allocations mapped to this Cadre ID node.
//           </div>
//         )}

//         {/* COMPLIANCE FOOTER REMARK */}
//         <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-200/30 py-2 rounded-lg border border-dashed border-slate-200/60">
//           🔒 Secure Multi-Node Handshake Sync Protocol Active
//         </div>

//       </div>

//     </div>
//   );
// };

// export default CadreDashboard;





















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LayoutDashboard, LogOut, MapPin, ArrowRight, User, CircleDot, Building } from 'lucide-react';
// import { supabase } from '../supabaseClient'; // Make sure path is correct

// const CadreDashboard = () => {
//   const navigate = useNavigate();
//   const [cadre, setCadre] = useState(null);
//   const [assignedVillages, setAssignedVillages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const sessionRole = sessionStorage.getItem('active_role');
//     const sessionData = sessionStorage.getItem('active_cadre');

//     if (sessionRole !== 'cadre' || !sessionData) {
//       navigate('/login');
//       return;
//     }

//     const currentCadre = JSON.parse(sessionData);
//     setCadre(currentCadre);

//     // Fetch Full Cadre Profile (Name, Location, Assigned Villages)
//     // const fetchCadreProfile = async () => {
//     //   const { data } = await supabase
//     //     .from('profiles')
//     //     .select('name, location, assigned_villages')
//     //     .eq('cadre_id', currentCadre.cadreId) // Using cadreId from session
//     //     .single();

//     //   if (data) {
//     //     setCadre(prev => ({ ...prev, ...data }));
//     //     // Map assigned_villages array to the format your dashboard expects
//     //     const villages = (data.assigned_villages || []).map(v => ({ name: v }));
//     //     setAssignedVillages(villages);
//     //   }
//     //   setLoading(false);
//     // };


//     // CadreDashboard.jsx mein useEffect ke andar fetchProfile function ko aise likho:
// const fetchProfile = async () => {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('name, location, assigned_villages')
//     .eq('cadre_id', currentCadre.cadreId) 
//     .single();

//   if (data) {
//     setCadre(prev => ({ ...prev, ...data }));
    
//     // Yahan check karo: agar assigned_villages array hai, toh use direct map karo
//     if (data.assigned_villages && Array.isArray(data.assigned_villages)) {
//       const villages = data.assigned_villages.map(v => ({ name: v }));
//       setAssignedVillages(villages);
//     } else {
//       setAssignedVillages([]);
//     }
//   }
//   setLoading(false);
// };

//     fetchCadreProfile();
//   }, [navigate]);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
//         <div className="animate-pulse font-black text-slate-400 text-xs tracking-widest uppercase">
//           Initializing Secure Terminal...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fcf9f2] p-4 md:p-6 font-sans">
//       {/* HEADER CONTROL BLOCK */}
//       <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
//             <LayoutDashboard size={20} />
//           </div>
//           <div>
//             <h1 className="text-sm font-black text-slate-800 uppercase tracking-wide">Operational Workspace</h1>
//             <div className="flex flex-col mt-1">
//               <span className="text-[11px] font-bold text-slate-500">{cadre?.name}</span>
//               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
//                  <span>ID: {cadre?.cadreId}</span>
//                  <span className="flex items-center gap-0.5"><Building size={10}/> {cadre?.location || 'General Zone'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <button 
//           onClick={handleLogout}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg transition-all"
//         >
//           <LogOut size={12} /> Terminate
//         </button>
//       </div>

//       {/* CORE WORKSPACE PANEL */}
//       <div className="max-w-4xl mx-auto space-y-4">
//         <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Assigned Locations ({assignedVillages.length})</h2>

//         {assignedVillages.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {assignedVillages.map((v, idx) => (
//               <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
//                 <div className="flex justify-between items-start mb-4">
//                   <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
//                     <MapPin size={16} className="text-emerald-500" /> {v.name}
//                   </h2>
//                   <CircleDot size={10} className="text-emerald-500 animate-pulse" />
//                 </div>
//                 <button
//                   onClick={() => navigate(`/village/${encodeURIComponent(v.name)}`)}
//                   className="w-full flex justify-center items-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-lg"
//                 >
//                   Open Ledger <ArrowRight size={12} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-400 font-bold text-xs uppercase">
//             No active allocations mapped to your ID.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CadreDashboard;



















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, MapPin, ArrowRight, User, CircleDot, Building } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CadreDashboard = () => {
  const navigate = useNavigate();
  const [cadre, setCadre] = useState(null);
  const [assignedVillages, setAssignedVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionRole = sessionStorage.getItem('active_role');
    const sessionData = sessionStorage.getItem('active_cadre');

    if (sessionRole !== 'cadre' || !sessionData) {
      navigate('/login');
      return;
    }

    const currentCadre = JSON.parse(sessionData);
    setCadre(currentCadre);

    // Function ko sahi naam se define aur call kiya hai
    const fetchCadreProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, location, assigned_villages')
          .eq('cadre_id', currentCadre.cadreId)
          .single();

        if (error) throw error;

        if (data) {
          setCadre(prev => ({ ...prev, ...data }));
          
          // Data mapping check
          if (data.assigned_villages && Array.isArray(data.assigned_villages)) {
            const villages = data.assigned_villages.map(v => ({ name: v }));
            setAssignedVillages(villages);
          } else {
            setAssignedVillages([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCadreProfile();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
        <div className="animate-pulse font-black text-slate-400 text-xs tracking-widest uppercase">
          Initializing Secure Terminal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] p-4 md:p-6 font-sans">
      {/* HEADER CONTROL BLOCK */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-wide">Operational Workspace</h1>
            <div className="flex flex-col mt-1">
              <span className="text-[11px] font-bold text-slate-500">{cadre?.name}</span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                 <span>ID: {cadre?.cadreId}</span>
                 <span className="flex items-center gap-0.5"><Building size={10}/> {cadre?.location || 'General Zone'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
        >
          <LogOut size={12} /> Terminate
        </button>
      </div>

      {/* CORE WORKSPACE PANEL */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Assigned Locations ({assignedVillages.length})</h2>

        {assignedVillages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedVillages.map((v, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                    <MapPin size={16} className="text-emerald-500" /> {v.name}
                  </h2>
                  <CircleDot size={10} className="text-emerald-500 animate-pulse" />
                </div>
                <button
                  onClick={() => navigate(`/village/${encodeURIComponent(v.name)}`)}
                  className="w-full flex justify-center items-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-lg transition-all cursor-pointer"
                >
                  Open Ledger <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-400 font-bold text-xs uppercase">
            No active allocations mapped to your ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default CadreDashboard;