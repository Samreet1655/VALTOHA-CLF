

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Download, Save, Edit2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient'; 

const VillageLedger = () => {
  const { villageName } = useParams(); 
  const navigate = useNavigate();
  const decodedVillageName = villageName ? decodeURIComponent(villageName) : "Unknown Village";

  const [selectedYear, setSelectedYear] = useState(2026); 
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [authorized, setAuthorized] = useState(false);
  const [currentMonthEntries, setCurrentMonthEntries] = useState([]); 
  const [fetching, setFetching] = useState(true);
  const [cadreInfo, setCadreInfo] = useState({ name: 'Loading...', phone: '...' });

  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const [newRow, setNewRow] = useState({
    name: '', groupName: '', phone: '', loanLent: '', principal: '', interestPercent: '', balance: '', date: new Date().toISOString().split('T')[0]
  });

  const MONTHS_ARRAY = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DYNAMIC_YEARS = Array.from({ length: 16 }, (_, i) => 2020 + i);

  useEffect(() => {
    const userRole = sessionStorage.getItem('active_role');
    const activeCadre = JSON.parse(sessionStorage.getItem('active_cadre'));
    if (userRole === 'admin' || (activeCadre && activeCadre.villages?.some(v => v.trim().toLowerCase() === decodedVillageName.trim().toLowerCase()))) {
      setAuthorized(true);
    } else {
      alert("🚫 Access Denied!");
      navigate('/login');
      return;
    }
    const fetchCadre = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, phone, assigned_villages')
    .contains('assigned_villages', [decodedVillageName])
    .maybeSingle(); // .single() ki jagah .maybeSingle() use karein

  if (error) {
    console.error("Error fetching cadre:", error);
    setCadreInfo({ name: 'Error Loading', phone: 'N/A' });
  } else if (data) {
    setCadreInfo(data);
  } else {
    setCadreInfo({ name: 'Not Assigned', phone: 'N/A' });
  }
};
    fetchCadre();
  }, [decodedVillageName, navigate]);

  const fetchLedgerEntries = async () => {
    if (!authorized) return;
    setFetching(true);
    const { data, error } = await supabase
      .from('ledger_entries')
      .select('*')
      .eq('village_name', decodedVillageName)
      .eq('timeline', `${selectedYear}-${selectedMonth}`)
      .order('id', { ascending: false });
    if (!error) setCurrentMonthEntries(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchLedgerEntries(); }, [authorized, decodedVillageName, selectedYear, selectedMonth]);

 const handleDownloadExcel = () => {
  const ws = XLSX.utils.json_to_sheet(currentMonthEntries.map(item => ({
    "Name": item.citizen_name, 
    "Contact": item.phone, 
    "Loan": item.loan_lent, 
    "Date": item.created_at, 
    "Installment": item.installment, 
    "Interest": item.interest_percent,
    "Total Amount": Number(item.installment) + Number(item.interest_percent), // New
    "Balance": item.balance
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${decodedVillageName}_Report.xlsx`);
}; 




const handleAddRow = async (e) => {
  e.preventDefault();
  
  // 1. Is customer ka sabse recent balance fetch karein
  const { data: lastEntry } = await supabase
    .from('ledger_entries')
    .select('balance')
    .eq('citizen_name', newRow.name) // Citizen name se check (Unique ID suggest ki thi)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 2. Agar koi purani entry mili, toh uska balance use karein, nahi toh naya loan lent
  const previousBalance = lastEntry ? lastEntry.balance : Number(newRow.loanLent);
  const installment = Number(newRow.installment) || 0;
  
  // 3. Naya Balance = Pichla Balance - Installment
  const calculatedBalance = previousBalance - installment;

  const rowPayload = {
    village_name: decodedVillageName, 
    timeline: `${selectedYear}-${selectedMonth}`,
    citizen_name: newRow.name, 
    group_name: newRow.groupName || "Individual Ledger",
    phone: newRow.phone || "N/A", 
    loan_lent: Number(newRow.loanLent) || 0,
    principal: Number(newRow.principal) || 0, 
    interest_percent: Number(newRow.interestPercent) || 0,
    installment: installment,
    balance: calculatedBalance, // Ab ye "Running Balance" hai
    created_at: newRow.date
  };

  const { error } = await supabase.from('ledger_entries').insert([rowPayload]);
  
  if (!error) {
    setNewRow({ 
      name: '', groupName: '', phone: '', loanLent: '', principal: '', 
      interestPercent: '', installment: '', date: new Date().toISOString().split('T')[0] 
    });
    fetchLedgerEntries();
  }
};

  const saveEdit = async (id) => {
    await supabase.from('ledger_entries').update(editRow).eq('id', id);
    setEditingId(null);
    fetchLedgerEntries();
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#fcf9f2] p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <ArrowLeft size={12} /> Dashboard
        </button>
        <button onClick={handleDownloadExcel} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-700 cursor-pointer">
          <Download size={12} /> Export Excel
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-4 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
        <div><h3 className="text-[9px] uppercase font-bold text-slate-400">Assigned Cadre</h3><p className="text-sm font-black text-amber-400">{cadreInfo.name}</p></div>
        <div className="text-right"><h3 className="text-[9px] uppercase font-bold text-slate-400">Contact Number</h3><p className="text-sm font-mono font-bold">{cadreInfo.phone}</p></div>
      </div>

      <div className="max-w-7xl mx-auto mb-6 bg-white border border-slate-100 rounded-xl p-3 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-slate-50 border border-slate-200 text-xs font-black px-3 py-1.5 rounded-lg cursor-pointer">{DYNAMIC_YEARS.map(yr => <option key={yr} value={yr}>Year {yr}</option>)}</select>
        <div className="flex gap-1 overflow-x-auto w-full">{MONTHS_ARRAY.map(mth => <button key={mth} onClick={() => setSelectedMonth(mth)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${selectedMonth === mth ? 'bg-amber-500 text-white' : 'bg-white border-slate-100 text-slate-500'}`}>{mth}</button>)}</div>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-xl shadow-md overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          {/* <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
              <th className="py-3 px-4">Name</th><th className="py-3 px-4">Phone</th><th className="py-3 px-4">Loan</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Installment</th><th className="py-3 px-4">Interest</th><th className="py-3 px-4">Balance</th><th className="py-3 px-4">Actions</th>
            </tr>
          </thead> */}
          <thead>
  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
    <th className="py-3 px-4">Name</th>
    <th className="py-3 px-4">Phone</th>
    <th className="py-3 px-4">Loan</th>
    <th className="py-3 px-4">Date</th>
    <th className="py-3 px-4">Installment</th>
    <th className="py-3 px-4">Int. Amt</th>
    <th className="py-3 px-4">Total Amt</th> {/* Naya Header */}
    <th className="py-3 px-4">Balance</th>
    <th className="py-3 px-4">Actions</th>
  </tr>
</thead>
          <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-50">
            {currentMonthEntries.map((row) => (
              <tr key={row.id}>
                {editingId === row.id ? (
                  <>
                    <td className="p-2"><input className="border w-20" value={editRow.citizen_name} onChange={e => setEditRow({...editRow, citizen_name: e.target.value})}/></td>
                    <td className="p-2"><input className="border w-20" value={editRow.phone} onChange={e => setEditRow({...editRow, phone: e.target.value})}/></td>
                    <td className="p-2"><input className="border w-16" value={editRow.loan_lent} onChange={e => setEditRow({...editRow, loan_lent: e.target.value})}/></td>
                    <td className="p-2"><input type="date" className="border" onChange={e => setEditRow({...editRow, created_at: e.target.value})}/></td>
                    <td className="p-2"><input className="border w-16" value={editRow.installment} onChange={e => setEditRow({...editRow, installment: e.target.value})}/></td>
                    <td className="p-2"><input className="border w-12" value={editRow.interest_percent} onChange={e => setEditRow({...editRow, interest_percent: e.target.value})}/></td>
                    <td className="p-2"><input className="border w-16" value={editRow.balance} onChange={e => setEditRow({...editRow, balance: e.target.value})}/></td>
                    <td className="p-2"><button onClick={() => saveEdit(row.id)}><Save size={16} className="text-emerald-600"/></button></td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 font-black">{row.citizen_name}</td>
                    <td className="py-3 px-4">{row.phone}</td>
                    <td className="py-3 px-4">₹{row.loan_lent}</td>
                    <td className="py-3 px-4">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-black text-emerald-700">₹{row.installment}</td>
                    <td className="py-3 px-4">{row.interest_percent}</td>
                    <td className="py-3 px-4 font-black text-amber-600">
  ₹{Number(row.installment) + Number(row.interest_percent)}
</td>
                    <td className="py-3 px-4 font-black">₹{row.balance}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button onClick={() => {setEditingId(row.id); setEditRow(row)}}><Edit2 size={13}/></button>
                      <button onClick={() => supabase.from('ledger_entries').delete().eq('id', row.id).then(fetchLedgerEntries)}><Trash2 size={13}/></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
 
  <form onSubmit={handleAddRow} className="grid grid-cols-2 md:grid-cols-7 gap-3">
  <div className="col-span-2">
    <label className="text-[9px] font-black text-slate-400 uppercase">Name</label>
    <input required placeholder="Full Name" className="w-full border p-1.5 text-xs rounded" value={newRow.name} onChange={e => setNewRow({...newRow, name: e.target.value})} />
  </div>
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase">Contact</label>
    <input placeholder="Phone" className="w-full border p-1.5 text-xs rounded" value={newRow.phone} onChange={e => setNewRow({...newRow, phone: e.target.value})} />
  </div>
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase">Loan</label>
    <input type="number" placeholder="Amt" className="w-full border p-1.5 text-xs rounded" value={newRow.loanLent} onChange={e => setNewRow({...newRow, loanLent: e.target.value})} />
  </div>
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase">Date</label>
    <input type="date" className="w-full border p-1.5 text-xs rounded" value={newRow.date} onChange={e => setNewRow({...newRow, date: e.target.value})} />
  </div>
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase">Installment</label>
    <input type="number" placeholder="Inst." className="w-full border p-1.5 text-xs rounded" value={newRow.installment} onChange={e => setNewRow({...newRow, installment: e.target.value})} />
  </div>
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase">Interest Amt</label>
    <input type="number" placeholder="Amt" className="w-full border p-1.5 text-xs rounded" value={newRow.interestPercent} onChange={e => setNewRow({...newRow, interestPercent: e.target.value})} />
  </div>
  <div className="flex items-end">
    <button className="w-full bg-slate-900 text-white font-black uppercase rounded text-[10px] p-2">Add</button>
  </div>
</form>
</div>
      </div>
  );
};

export default VillageLedger;




























































































