
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ArrowLeft } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [cadreIdInput, setCadreIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === 'admin') {
        // Admin authentication using environment variables
        const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
          alert("❌ Admin credentials not configured. Contact administrator.");
          setIsLoading(false);
          return;
        }

        if (cadreIdInput.trim() === adminUsername && passwordInput === adminPassword) {
          sessionStorage.setItem('active_role', 'admin');
          sessionStorage.removeItem('active_cadre');
          navigate('/admin');
        } else {
          alert("❌ Invalid Admin Credentials!");
        }
      } else {
        // Cadre authentication from Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('cadre_id', cadreIdInput.trim())
          .eq('role', 'cadre')
          .maybeSingle();

        console.log('Supabase Response:', { profile, error }); // Debug: check query result and error

        if (error) {
          alert(`❌ Database Error: ${error.message}`);
          setIsLoading(false);
          return;
        }

        if (!profile) {
          alert("❌ Cadre ID not found. Please check your ID.");
          setIsLoading(false);
          return;
        }

        // Secure password verification using bcrypt
        const isPasswordValid = await bcrypt.compare(passwordInput, profile.password);

        if (!isPasswordValid) {
          alert("❌ Invalid Password.");
          setIsLoading(false);
          return;
        }

        const sessionPayload = {
          cadreId: profile.cadre_id,
          name: profile.name,
          villages: profile.assigned_villages || []
        };

        sessionStorage.setItem('active_role', 'cadre');
        sessionStorage.setItem('active_cadre', JSON.stringify(sessionPayload));
        navigate('/cadre-dashboard');
      }
    } catch (err) {
      alert("❌ Authentication Error: " + err.message);
    } finally {
      setIsLoading(false);
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
                {role === 'admin' ? 'Admin Username' : 'Cadre ID'}
              </label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required
                disabled={isLoading}
                placeholder={role === 'admin' ? "Enter admin username" : "Enter Cadre ID"} 
                value={cadreIdInput} 
                onChange={(e) => setCadreIdInput(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm font-semibold disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                disabled={isLoading}
                placeholder="••••••••" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm disabled:bg-slate-100"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${role === 'admin' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {isLoading ? 'Authenticating...' : 'Secure Cloud Login'}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setRole(null)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors pt-2 cursor-pointer disabled:opacity-50"
            >
              Go Back to Role Selection
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;