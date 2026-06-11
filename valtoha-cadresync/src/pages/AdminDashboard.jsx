
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, LayoutGrid, LogOut, ArrowRight, KeyRound, Eye, EyeOff, ShieldCheck, Trash2, Edit3, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { DEFAULT_USER } from '../config';

const OFFICIAL_VALTOHA_VILLAGES = [
  "ABADI AMARKOT", "ABADI MALKA", "ADDA AMARKOT", "ADDA VALTOHA", "AMARKOT", 
  "AMEERKE", "ASAL HAVELI JIWANSINGH", "ASAL JIWAN SINGH", "ASAL UTTAR", "BAHADERNAGAR", 
  "BALLIANWALA", "BEHERWAL", "BHANDAL", "BHURA KOHNA", "BHURA KRIMPUR", 
  "CHAK BAMBA", "CHAKWALIA", "CHEEMA", "CHEEMA HAKAM SINGH", "DASMESH NAGAR", 
  "DASUWAL", "DAUDPURA", "DHOLAN", "DIBBIPUR", "DUHAL KOHNA", 
  "DUHAL NAU", "FATEHPUR", "GAJJAL", "GHARYALA", "GHARYALA ARADIAN", 
  "GHARYALA DASUWAL", "GHARYALA KHURD", "JAGATPURA", "JAND", "JHAAR SAHIB", 
  "JHUGGIAN KALU", "JODHSINGHWALA", "KALIA", "KALS", "KLANJAR", 
  "KOTLI", "LAKHNA", "MAAN", "MACHHIKE", "MADDAR", 
  "MAHNEKE", "MANAWA", "MANDI", "MASTGARH", "MEHDIPUR", 
  "MEHDIPUR HAVELIAN", "MEHMUDPUR", "MIANWALA", "NOORWAL", "PATTI PLO", 
  "PREMNAGAR", "PUNIA", "RAJOKE", "RAM KHARA", "RAMUWAL", 
  "RATTOKE", "RATTOKE GURDWARA", "SANKATRA", "SARAI", "TALWANDI BUDH", 
  "TALWANDI SOBHA", "THATHA", "THATHI JAIMAL SINGH", "THEH SARHALI", "T MUTSADDA", 
  "VALTOHA", "VALTOHA KHURD", "VALTOHA SANDHUAN", "WAAN TARA SINGH", "WARANALA", 
  "WARNALA KALAN", "WARA THATHI"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('villages'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordSearch, setPasswordSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- LOCAL EDIT TRACKING STATES ---
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ phone: '', password: '' });

  // Master States
  const [villages, setVendors] = useState([]);
  const [credentialsVault, setCredentialsVault] = useState([]);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Admin Profile Settings (Can remain in localStorage for session/config)
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('admin_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [securityForm, setSecurityForm] = useState({ newUsername: '', newPassword: '' });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');

  const [formData, setFormData] = useState({ name: '', husbandName: '', phone: '', village: '', password: '', cadreId: '' });

  // 🌟 STEP 2 FIX: SUPABASE SE LIVE DATA FETCH KARNA (NO LOCAL STORAGE DEPENDENCY)
  const fetchCloudData = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'cadre');

      if (error) throw error;

      // 1. Credentials Vault map karo direct database rows se
      const vaultData = profiles.map((p, idx) => ({
  id: p.id || idx + 1,
  cadreId: p.cadre_id || `CAD-${100 + idx}`,
  name: p.name,
  phone: p.phone || "N/A",
  password: p.password || "",
  // Yahan join use karein taaki saare villages dikhein
  village: (p.assigned_villages && p.assigned_villages.length > 0) 
           ? p.assigned_villages.join(', ') 
           : "No Village Assigned"
}));
setCredentialsVault(vaultData);

      // 2. Villages Directory map karo live database information ke sath
      const mappedVillages = OFFICIAL_VALTOHA_VILLAGES.map((vName, index) => {
        // Check karo agar koi cadre is village se mapped hai
        const matchingProfile = profiles.find(p => p.assigned_villages && p.assigned_villages.includes(vName));
        
        if (matchingProfile) {
          return {
            id: index + 1,
            name: vName,
            cadreId: matchingProfile.cadre_id || "Active",
            cadreName: matchingProfile.name,
            phone: matchingProfile.phone || "N/A",
            status: "Active",
            password: matchingProfile.password || ""
          };
        }
        return {
          id: index + 1,
          name: vName,
          cadreId: "N/A",      
          cadreName: "Not Assigned", 
          phone: "N/A",
          status: "Pending Assignment",
          password: ""
        };
      });
      setVendors(mappedVillages);

    } catch (err) {
      console.error("Error loading data from Supabase:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  const filteredVillages = villages.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVault = credentialsVault.filter(c =>
    c.name.toLowerCase().includes(passwordSearch.toLowerCase()) ||
    c.village.toLowerCase().includes(passwordSearch.toLowerCase()) ||
    c.cadreId.toLowerCase().includes(passwordSearch.toLowerCase())
  );

  const startEditing = (account) => {
    setEditingId(account.id);
    setEditFormData({ phone: account.phone, password: account.password });
  };

  // 🌟 LIVE EDIT CLOUD SYNC WITH VALIDATIONS
  const handleSaveEdit = async (id, targetVillageName, cadreName) => {
    if (!editFormData.phone || !editFormData.password) {
      return alert("Fields cannot be left completely empty.");
    }

    // Client Safeguard: Phone validation check
    if (!/^\d{10}$/.test(editFormData.phone.trim())) {
      return alert("⚠️ Client Error: Please enter a valid 10-digit phone number.");
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          password: editFormData.password.trim(),
          phone: editFormData.phone.trim() // Database columns should match
        })
        .eq('name', cadreName)
        .eq('role', 'cadre');

      if (error) throw error;

      setEditingId(null);
      alert("📝 Credentials successfully synced online!");
      fetchCloudData(); // Reload perfectly from server
    } catch (err) {
      console.error("Supabase Update Error:", err.message);
      alert("Database par update nahi ho paya: " + err.message);
    }
  };

  // 🌟 LIVE DELETE CLOUD SYNC
  const handleDeleteCadre = async (id, targetVillageName, cadreName) => {
    if (window.confirm(`🗑️ Are you sure you want to completely wipe out and de-assign ${cadreName || 'this Cadre'}?`)) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('name', cadreName)
          .eq('role', 'cadre');

        if (error) throw error;

        alert("🧹 Profile completely unassigned and wiped from Cloud Database!");
        fetchCloudData(); // Re-fetch absolute fresh matrix
      } catch (err) {
        console.error("Supabase Delete Error:", err.message);
        alert("Database se delete nahi ho paya: " + err.message);
      }
    }
  };

  // 🌟 SUPABASE LIVE REGISTER FLOW WITH CLIENT-SAFEGUARD VALIDATIONS
  // const handleCreateId = async (e) => {
  //   e.preventDefault();
  //   if(!formData.name || !formData.village || !formData.cadreId || !formData.password) {
  //     return alert("Please fill all details manually.");
  //   }

  //   // Client Safeguard: Phone validation check
  //   if (!/^\d{10}$/.test(formData.phone.trim())) {
  //     return alert("⚠️ Client Error: Please enter a valid 10-digit phone number.");
  //   }

  //   const cleanCadreId = formData.cadreId.trim();
  //   const cleanName = formData.name.trim();

  //   try {
  //     const { data: existingProfile } = await supabase
  //       .from('profiles')
  //       .select('assigned_villages')
  //       .ilike('name', cleanName)
  //       .eq('role', 'cadre')
  //       .maybeSingle();

  //     let updatedVillages = [formData.village];

  //     if (existingProfile && existingProfile.assigned_villages) {
  //       if (!existingProfile.assigned_villages.includes(formData.village)) {
  //         updatedVillages = [...existingProfile.assigned_villages, formData.village];
  //       } else {
  //         updatedVillages = existingProfile.assigned_villages;
  //       }
  //     }

  //     // Complete data UPSERT into Supabase Cloud
  //     const { error: profileError } = await supabase
  //       .from('profiles')
  //       .upsert({
  //         name: cleanName,
  //         password: formData.password.trim(),
  //         phone: formData.phone.trim(),
  //         cadre_id: cleanCadreId,
  //         role: 'cadre',
  //         assigned_villages: updatedVillages
  //       }, { onConflict: 'name' });

  //     if (profileError) throw profileError;

  //     alert(`💪 Supabase Cloud Sync Complete! Cadre "${cleanName}" assigned successfully.`);
  //     setFormData({ name: '', husbandName: '', phone: '', village: '', password: '', cadreId: '' });
  //     fetchCloudData(); // Refresh list live from database
  //     setActiveTab('passwords'); 

  //   } catch (err) {
  //     console.error("Supabase Sync Error:", err.message);
  //     alert("Database sync failed: " + err.message);
  //   }
  // };



  // const handleCreateId = async (e) => {
  //   e.preventDefault();
    
  //   // 1. Basic Validation
  //   if (!formData.cadreId) return alert("Cadre ID is required!");

  //   try {
  //     const { error } = await supabase
  //       .from('profiles')
  //       .upsert({
  //         name: formData.name.trim(),
  //         password: formData.password.trim(),
  //         phone: formData.phone.trim() || null, // Nullable handle
  //         cadre_id: formData.cadreId.trim(),    // Unique constraint handle
  //         role: 'cadre',
  //         assigned_villages: [formData.village]
  //       }, { onConflict: 'cadre_id' }); // Conflict ab 'cadre_id' par detect hoga

  //     if (error) {
  //       if (error.code === '23505') { // Postgres Unique Violation Error Code
  //         alert("⚠️ Error: Yeh Cadre ID ya Phone Number pehle se kisi aur account mein registered hai.");
  //       } else {
  //         throw error;
  //       }
  //       return;
  //     }

  //     alert("✅ Success! Record saved to Cloud.");
  //     setFormData({ name: '', husbandName: '', phone: '', village: '', password: '', cadreId: '' });
  //     fetchCloudData(); 
  //   } catch (err) {
  //     console.error("Database Error:", err.message);
  //     alert("System Error: " + err.message);
  //   }
  // };
  const handleCreateId = async (e) => {
    e.preventDefault();
    if (!formData.cadreId) return alert("Cadre ID is required!");

    try {
      // 1. Pehle check karo kya ye cadre pehle se hai?
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('assigned_villages')
        .eq('cadre_id', formData.cadreId.trim())
        .maybeSingle();

      // 2. Agar hai, toh purane villages uthao, warna naya array
      let updatedVillages = [formData.village];
      if (existingProfile && existingProfile.assigned_villages) {
        // Sirf tab add karo agar wo village pehle se list mein nahi hai
        if (!existingProfile.assigned_villages.includes(formData.village)) {
          updatedVillages = [...existingProfile.assigned_villages, formData.village];
        } else {
          updatedVillages = existingProfile.assigned_villages;
        }
      }

      // 3. Ab upsert karo updated list ke saath
      const { error } = await supabase
        .from('profiles')
        .upsert({
          name: formData.name.trim(),
          password: formData.password.trim(),
          phone: formData.phone.trim() || null,
          cadre_id: formData.cadreId.trim(),
          role: 'cadre',
          assigned_villages: updatedVillages // Yahan humne updated list dali
        }, { onConflict: 'cadre_id' });

      if (error) throw error;

      alert("✅ Success! Village added to Cadre.");
      setFormData({ name: '', husbandName: '', phone: '', village: '', password: '', cadreId: '' });
      fetchCloudData(); 
    } catch (err) {
      console.error("Database Error:", err.message);
      alert("System Error: " + err.message);
    }
  };





  const triggerOtpRequest = (e) => {
    e.preventDefault();
    if (!securityForm.newUsername || !securityForm.newPassword) {
      return alert("Fill target fields.");
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    alert(`[Verification Code Alert]\nSent to +91-${adminProfile.recoveryPhone}\n\nCode: ${code}`);
  };

  const togglePasswordVisibility = (id) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-black tracking-tight text-amber-500">Valtoha CadreSync</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">BPM Workspace</p>
            <div className="mt-3 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Admin</p>
              <p className="text-xs font-mono font-bold text-emerald-400 truncate">{adminProfile.username}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('villages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'villages' ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><LayoutGrid size={18} /> Village Directory</button>
            <button onClick={() => setActiveTab('generate-id')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'generate-id' ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><UserPlus size={18} /> Generate Cadre ID</button>
            <button onClick={() => setActiveTab('passwords')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'passwords' ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><KeyRound size={18} /> Credentials Vault</button>
            <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${activeTab === 'security' ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}><ShieldCheck size={18} /> Admin Security</button>
          </nav>
        </div>
        <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-950/30 rounded-xl transition-colors mt-6"><LogOut size={18} /> Sign Out</button>
      </div>

      {/* BODY WORKSPACE */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
            Syncing live with Supabase Cloud Matrix...
          </div>
        ) : (
          <>
            {activeTab === 'villages' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800">Villages Directory</h1>
                    <p className="text-sm text-slate-500 mt-1">Total {villages.length} Official Locations</p>
                  </div>
                  <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input type="text" placeholder="Search villages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none text-sm shadow-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVillages.map((v) => (
                    <div key={v.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{v.status}</span>
                          {v.status === 'Active' && <span className="text-[11px] font-mono font-bold text-slate-400">ID: {v.cadreId}</span>}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mt-3 group-hover:text-emerald-600 truncate">{v.name}</h3>
                        <div className="mt-4 pt-4 border-t border-slate-50 space-y-1.5 text-sm">
                          <p className="text-slate-500"><span className="font-semibold text-slate-700">Handler:</span> {v.cadreName}</p>
                          <p className="text-slate-500"><span className="font-semibold text-slate-700">Phone:</span> {v.phone}</p>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/admin/village/${encodeURIComponent(v.name)}`)} className="mt-6 w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 uppercase cursor-pointer transition-all">Open Ledger <ArrowRight size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'generate-id' && (
              <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Create Cadre Profile</h2>
                <p className="text-xs text-slate-400 mb-4">Entering an existing Cadre ID will automatically parse and use their profile info.</p>
                <form onSubmit={handleCreateId} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Assign Target Location</label>
                    <select required value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm">
                      <option value="">-- Choose Target Location --</option>
                      {villages.map(v => <option key={v.id} value={v.name} disabled={v.status === 'Active'}>{v.name} {v.status === 'Active' ? '(Assigned)' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Cadre ID</label>
                    <input type="text" required placeholder="Type registration number..." value={formData.cadreId} onChange={(e) => setFormData({...formData, cadreId: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 font-mono text-sm rounded-xl"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Employee Name</label>
                      <input type="text" required placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Husband's Name</label>
                      <input type="text" placeholder="Husband Name" value={formData.husbandName} onChange={(e) => setFormData({...formData, husbandName: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Contact Phone Line</label>
                    <input type="text" required placeholder="10-digit line" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Assign Master Password</label>
                    <input type="text" required placeholder="Allot password token..." value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"/>
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-500 text-white font-bold text-sm rounded-xl uppercase tracking-wider cursor-pointer">Save & Register</button>
                </form>
              </div>
            )}

            {activeTab === 'passwords' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-800">Credentials Vault</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage credentials, modify information nodes, or delete assigned cadres</p>
                  </div>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="Search accounts..." value={passwordSearch} onChange={(e) => setPasswordSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs shadow-sm"/>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-wider">
                        <th className="py-4 px-6">Assigned ID</th>
                        <th className="py-4 px-6">Worker Name</th>
                        <th className="py-4 px-6">Assigned Location</th>
                        <th className="py-4 px-6">Phone Line</th>
                        <th className="py-4 px-6">Password</th>
                        <th className="py-4 px-6 text-center">Actions Matrix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredVault.map((account) => {
                        const isCurrentlyEditing = editingId === account.id;
                        return (
                          <tr key={account.id} className="bg-white hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-mono font-bold text-slate-900 bg-slate-50/40">{account.cadreId}</td>
                            <td className="py-4 px-6 font-bold">{account.name}</td>
                            <td className="py-4 px-6">
  {account.village && account.village !== "N/A" ? (
    <div className="flex flex-wrap gap-1">
      {account.village.split(', ').map((v, i) => (
        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded px-1.5 py-0.5">
          {v}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-[10px] text-slate-400 italic">No Location</span>
  )}
</td>
                            <td className="py-4 px-6 text-slate-500">
                              {isCurrentlyEditing ? (
                                <input 
                                  type="text" 
                                  value={editFormData.phone} 
                                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                  className="px-2 py-1 border border-slate-200 rounded font-semibold text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                              ) : (
                                account.phone
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                {isCurrentlyEditing ? (
                                  <input 
                                    type="text" 
                                    value={editFormData.password} 
                                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                    className="px-2 py-1 border border-slate-200 rounded font-mono text-amber-600 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                ) : (
                                  <>
                                    <input type={revealedPasswords[account.id] ? "text" : "password"} readOnly value={account.password} className="bg-transparent font-mono text-amber-600 w-24 text-sm focus:outline-none"/>
                                    <button onClick={() => togglePasswordVisibility(account.id)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                                      {revealedPasswords[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                            
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                {isCurrentlyEditing ? (
                                  <button 
                                    onClick={() => handleSaveEdit(account.id, account.village, account.name)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    <Check size={11} /> Save
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => startEditing(account)}
                                    className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                                    title="Edit Cadre Details"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteCadre(account.id, account.village, account.name)}
                                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Delete Cadre Node"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredVault.length === 0 && <div className="p-12 text-center text-slate-400 font-medium">No system records registered yet.</div>}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md border border-slate-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black">System Profile Authentication</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Control operational credentials running active sessions</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl font-mono text-xs">
                    <p><span className="text-slate-500 font-sans font-bold">User:</span> {adminProfile.username}</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm">
                  <form onSubmit={triggerOtpRequest} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">New Username</label>
                        <input type="text" required placeholder="e.g. PARMEET SINGH" value={securityForm.newUsername} onChange={(e) => setSecurityForm({...securityForm, newUsername: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">New Password</label>
                        <input type="text" required placeholder="e.g. 8791" value={securityForm.newPassword} onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold"/>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer">Request Secure Confirmation Code</button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;