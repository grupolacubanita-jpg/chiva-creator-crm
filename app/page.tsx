'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, Target, Wallet, Folder, CheckSquare,
  BarChart3, Clock, Calendar, Monitor, UserCircle, RotateCcw,
  Menu, Search, Sun, Moon, LogOut, Plus, Pencil, Trash2, Download,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { createClient } from '@supabase/supabase-js';

const BRAND = '#CC0000';
const NAVY = '#10182c';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type FieldType = 'text' | 'number' | 'date' | 'select';
interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
}

function useLocalState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setValue(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [value, loaded, key]);
  return [value, setValue];
}

const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet },
  { id: 'projetos', label: 'Projetos', icon: Folder },
  { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
  { id: 'produtividade', label: 'Produtividade', icon: BarChart3 },
  { id: 'presenca', label: 'Presença', icon: Clock },
  { id: 'calendario', label: 'Calendário', icon: Calendar },
  { id: 'equipamentos', label: 'Equipamentos', icon: Monitor },
  { id: 'utilizadores', label: 'Utilizadores', icon: UserCircle },
  { id: 'backup', label: 'Backup', icon: RotateCcw },
] as const;

function LoginScreen({ onLogin, dark }: { onLogin: () => void; dark: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (email.trim().toLowerCase() === 'admin@chivacreator.pt' && password === 'chiva2024') { setError(''); onLogin(); }
    else setError('Credenciais inválidas.');
  };
  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200 placeholder-slate-500' : 'bg-gray-50 border-gray-200'}`;
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${dark ? 'bg-[#0b0f1e]' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-sm rounded-2xl p-8 shadow-lg ${dark ? 'bg-[#161d33] text-slate-200' : 'bg-white'}`}>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: BRAND }}>Chiva Creator CRM</h1>
        <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Acesso reservado a colaboradores</p>
        <div className="space-y-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className={inputCls} placeholder="admin@chivacreator.pt" />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Palavra-passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className={inputCls} placeholder="••••••••" />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        <button onClick={submit} style={{ background: BRAND }} className="w-full text-white rounded-lg py-2.5 font-semibold mt-5 hover:opacity-90 transition">Entrar</button>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, open, setOpen, onLogout }: { active: string; setActive: (id: string) => void; open: boolean; setOpen: (v: boolean) => void; onLogout: () => void; }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 flex flex-col z-40 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ background: NAVY }}>
        <div className="px-6 py-6">
          <h1 className="text-xl font-extrabold leading-tight" style={{ color: BRAND }}>Chiva Creator</h1>
          <p className="text-xs text-slate-400 -mt-0.5">CRM</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            return (
              <button key={m.id} onClick={() => { setActive(m.id); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:bg-white/5'}`} style={isActive ? { background: BRAND } : undefined}>
                <Icon size={18} />{m.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu, search, setSearch, dark, toggleDark, title }: { onMenu: () => void; search: string; setSearch: (v: string) => void; dark: boolean; toggleDark: () => void; title: string; }) {
  return (
    <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 md:px-6 py-3 border-b ${dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100'}`}>
      <button onClick={onMenu} className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}><Menu size={20} /></button>
      <h2 className="hidden md:block font-bold text-lg mr-2 whitespace-nowrap">{title}</h2>
      <div className="relative flex-1 max-w-xl">
        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisa global..." className={`w-full pl-9 pr-4 py-2 rounded-full text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200 placeholder-slate-500' : 'bg-gray-50 border-gray-200'}`} />
      </div>
      <button onClick={toggleDark} className={`p-2 rounded-full transition ${dark ? 'bg-[#0f1525] text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ background: BRAND }}>A</div>
    </header>
  );
}

/* ---- Login ---- */
function LoginScreen({ onLogin, dark }: { onLogin: () => void; dark: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (email.trim().toLowerCase() === 'admin@chivacreator.pt' && password === 'chiva2024') { onLogin(); }
    else setError('Credenciais inválidas.');
  };
  const inp = `w-full px-3 py-2.5 rounded-lg text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200 placeholder-slate-500' : 'bg-gray-50 border-gray-200'}`;
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${dark ? 'bg-[#0b0f1e]' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-sm rounded-2xl p-8 shadow-lg ${dark ? 'bg-[#161d33] text-slate-200' : 'bg-white'}`}>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: BRAND }}>Chiva Creator CRM</h1>
        <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Acesso reservado a colaboradores</p>
        <div className="space-y-3">
          <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className={inp} placeholder="admin@chivacreator.pt" /></div>
          <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Palavra-passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className={inp} placeholder="••••••••" /></div>
        </div>
        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        <button onClick={submit} style={{ background: BRAND }} className="w-full text-white rounded-lg py-2.5 font-semibold mt-5 hover:opacity-90 transition">Entrar</button>
      </div>
    </div>
  );
}

/* ---- Sidebar ---- */
function Sidebar({ active, setActive, open, setOpen, onLogout }: { active: string; setActive: (id: string) => void; open: boolean; setOpen: (v: boolean) => void; onLogout: () => void; }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 flex flex-col z-40 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ background: NAVY }}>
        <div className="px-6 py-6"><h1 className="text-xl font-extrabold leading-tight" style={{ color: BRAND }}>Chiva Creator</h1><p className="text-xs text-slate-400 -mt-0.5">CRM</p></div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {MODULES.map((m) => { const Icon = m.icon; const isActive = active === m.id; return (
            <button key={m.id} onClick={() => { setActive(m.id); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-300 hover:bg-white/5'}`} style={isActive ? { background: BRAND } : undefined}>
              <Icon size={18} />{m.label}
            </button>
          ); })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 transition"><LogOut size={18} /> Sair</button>
        </div>
      </aside>
    </>
  );
}

/* ---- TopBar ---- */
function TopBar({ onMenu, search, setSearch, dark, toggleDark, title }: { onMenu: () => void; search: string; setSearch: (v: string) => void; dark: boolean; toggleDark: () => void; title: string; }) {
  return (
    <header className={`sticky top-0 z-20 flex items-center gap-3 px-4 md:px-6 py-3 border-b ${dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100'}`}>
      <button onClick={onMenu} className={`md:hidden p-2 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}><Menu size={20} /></button>
      <h2 className="hidden md:block font-bold text-lg mr-2 whitespace-nowrap">{title}</h2>
      <div className="relative flex-1 max-w-xl">
        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisa global..." className={`w-full pl-9 pr-4 py-2 rounded-full text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200 placeholder-slate-500' : 'bg-gray-50 border-gray-200'}`} />
      </div>
      <button onClick={toggleDark} className={`p-2 rounded-full transition ${dark ? 'bg-[#0f1525] text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ background: BRAND }}>A</div>
    </header>
  );
}

/* ---- EntityManager genérico com Supabase ---- */
function EntityManager({ title, table, fields, dark, search, badgeFn }: { title: string; table: string; fields: FieldConfig[]; dark: boolean; search: string; badgeFn?: (item: any) => { label: string; color: string } | null; }) {
  const { items, add, update, remove } = useSupabaseTable<any>(table);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200' : 'bg-gray-50 border-gray-200'}`;

  const openNew = () => { setForm({}); setEditing(null); setShowForm(true); };
  const openEdit = (item: any) => { setForm(item); setEditing(item); setShowForm(true); };

  const save = async () => {
    if (!form[fields[0].key]) return;
    if (editing) { await update(editing.id, form); }
    else { await add(form); }
    setShowForm(false); setForm({}); setEditing(null);
  };

  const filtered = items.filter((i) => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div><h2 className="text-2xl font-bold">{title}</h2><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{items.length} {items.length === 1 ? 'item registado' : 'itens registados'}</p></div>
        <button onClick={openNew} style={{ background: BRAND }} className="text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition"><Plus size={16} /> Novo</button>
      </div>
      {filtered.length === 0 && <div className={`rounded-2xl border ${cardCls} p-10 text-center text-sm ${dark ? 'text-slate-400' : 'text-gray-400'}`}>Sem registos. Clique em &quot;+ Novo&quot; para adicionar.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => { const badge = badgeFn?.(item); return (
          <div key={item.id} className={`rounded-2xl border ${cardCls} p-5`}>
            <div className="flex justify-between items-start mb-3">
              {badge ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: badge.color + '22', color: badge.color }}>{badge.label}</span> : <span />}
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className={`p-1.5 rounded-lg ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            {fields.map((f, idx) => <p key={f.key} className={idx === 0 ? 'font-bold text-lg mb-1' : `text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{idx > 0 && <span className="font-medium">{f.label}: </span>}{item[f.key] || '-'}</p>)}
          </div>
        ); })}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${dark ? 'bg-[#161d33] text-slate-200' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'Editar' : 'Novo'} — {title}</h3>
            <div className="space-y-3">
              {fields.map((f) => (<div key={f.key}>
                <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{f.label}</label>
                {f.type === 'select' ? (
                  <select value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputCls}>
                    <option value="">Selecione</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} />
                )}
              </div>))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setShowForm(false); setForm({}); setEditing(null); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancelar</button>
              <button onClick={save} style={{ background: BRAND }} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Financeiro ---- */
interface MovFinanceira { id: string; tipo: 'Receita' | 'Despesa'; descricao: string; categoria: string; valor: string; data: string; }

function FinanceiroModule({ dark, search }: { dark: boolean; search: string }) {
  const { items, add, update, remove } = useSupabaseTable<MovFinanceira>('financeiro');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MovFinanceira | null>(null);
  const [form, setForm] = useState<Partial<MovFinanceira>>({ tipo: 'Receita' });
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200' : 'bg-gray-50 border-gray-200'}`;
  const receitas = items.filter((i) => i.tipo === 'Receita').reduce((s, i) => s + (Number(i.valor) || 0), 0);
  const despesas = items.filter((i) => i.tipo === 'Despesa').reduce((s, i) => s + (Number(i.valor) || 0), 0);
  const saldo = receitas - despesas;
  const save = async () => {
    if (!form.descricao || !form.valor) return;
    if (editing) { await update(editing.id, form as MovFinanceira); }
    else { await add(form as Omit<MovFinanceira, 'id'>); }
    setShowForm(false); setForm({ tipo: 'Receita' }); setEditing(null);
  };
  const filtered = items.filter((i) => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div><h2 className="text-2xl font-bold">Financeiro</h2><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{items.length} movimentos</p></div>
        <button onClick={() => { setForm({ tipo: 'Receita' }); setEditing(null); setShowForm(true); }} style={{ background: BRAND }} className="text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition"><Plus size={16} /> Novo</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-2xl border ${cardCls} p-5`}><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Receitas</p><p className="text-2xl font-bold text-green-500 mt-1">€ {receitas.toFixed(2)}</p></div>
        <div className={`rounded-2xl border ${cardCls} p-5`}><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Despesas</p><p className="text-2xl font-bold text-red-500 mt-1">€ {despesas.toFixed(2)}</p></div>
        <div className={`rounded-2xl border ${cardCls} p-5`}><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Saldo</p><p className="text-2xl font-bold mt-1" style={{ color: saldo >= 0 ? '#16a34a' : '#dc2626' }}>€ {saldo.toFixed(2)}</p></div>
      </div>
      {filtered.length === 0 ? <div className={`rounded-2xl border ${cardCls} p-10 text-center text-sm ${dark ? 'text-slate-400' : 'text-gray-400'}`}>Sem registos.</div> : (
        <div className={`rounded-2xl border ${cardCls} overflow-hidden overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead><tr className={dark ? 'bg-white/5 text-slate-400' : 'bg-gray-50 text-gray-500'}>
              <th className="text-left font-semibold px-4 py-3">Tipo</th><th className="text-left font-semibold px-4 py-3">Descrição</th><th className="text-left font-semibold px-4 py-3">Categoria</th><th className="text-right font-semibold px-4 py-3">Valor</th><th className="text-left font-semibold px-4 py-3">Data</th><th className="text-right font-semibold px-4 py-3">Ações</th>
            </tr></thead>
            <tbody>{filtered.map((i) => (<tr key={i.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}>
              <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${i.tipo === 'Receita' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>{i.tipo}</span></td>
              <td className="px-4 py-3">{i.descricao}</td><td className="px-4 py-3">{i.categoria || '-'}</td>
              <td className="px-4 py-3 text-right">{Number(i.valor || 0).toFixed(2)}</td><td className="px-4 py-3">{i.data || '-'}</td>
              <td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end">
                <button onClick={() => { setForm(i); setEditing(i); setShowForm(true); }} className={`p-1.5 rounded-lg ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}><Pencil size={14} /></button>
                <button onClick={() => remove(i.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"><Trash2 size={14} /></button>
              </div></td>
            </tr>))}</tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${dark ? 'bg-[#161d33] text-slate-200' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'Editar' : 'Novo'} Movimento</h3>
            <div className="space-y-3">
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Tipo</label><select value={form.tipo || 'Receita'} onChange={(e) => setForm({ ...form, tipo: e.target.value as 'Receita' | 'Despesa' })} className={inputCls}><option value="Receita">Receita</option><option value="Despesa">Despesa</option></select></div>
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Descrição</label><input value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Categoria</label><input value={form.categoria || ''} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Valor (€)</label><input type="number" value={form.valor || ''} onChange={(e) => setForm({ ...form, valor: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Data</label><input type="date" value={form.data || ''} onChange={(e) => setForm({ ...form, data: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setShowForm(false); setForm({ tipo: 'Receita' }); setEditing(null); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancelar</button>
              <button onClick={save} style={{ background: BRAND }} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Produtividade ---- */
function ProdutividadeModule({ dark }: { dark: boolean }) {
  const { items: utilizadores } = useSupabaseTable<any>('utilizadores');
  const { items: tarefas } = useSupabaseTable<any>('tarefas');
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const trackCls = dark ? 'bg-white/10' : 'bg-gray-100';
  if (utilizadores.length === 0) return <div><h2 className="text-2xl font-bold mb-6">Produtividade</h2><div className={`rounded-2xl border ${cardCls} p-10 text-center text-sm ${dark ? 'text-slate-400' : 'text-gray-400'}`}>Adiciona colaboradores em &quot;Utilizadores&quot;.</div></div>;
  return (
    <div><h2 className="text-2xl font-bold mb-6">Produtividade</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {utilizadores.map((u) => {
          const minhas = tarefas.filter((t) => t.responsavel === u.nome);
          const total = minhas.length; const concluidas = minhas.filter((t) => t.status === 'Concluída').length;
          const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
          return (
            <div key={u.id} className={`rounded-2xl border ${cardCls} p-5`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: BRAND }}>{(u.nome || '?').charAt(0).toUpperCase()}</div>
                <div><p className="font-bold">{u.nome}</p><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{u.cargo || '-'}</p></div>
                <span className="ml-auto font-bold text-lg" style={{ color: BRAND }}>{pct}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${trackCls} mb-4`}><div className="h-2 rounded-full" style={{ width: `${pct}%`, background: BRAND }} /></div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-bold">{total}</p><p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Atribuídas</p></div>
                <div><p className="text-2xl font-bold text-green-500">{concluidas}</p><p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Concluídas</p></div>
                <div><p className="text-2xl font-bold text-orange-500">{total - concluidas}</p><p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Pendentes</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Presença ---- */
function PresencaModule({ dark }: { dark: boolean }) {
  const { items: utilizadores } = useSupabaseTable<any>('utilizadores');
  const { items: registos, add, update: updReg } = useSupabaseTable<any>('presencas');
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const today = new Date().toISOString().slice(0, 10);
  const hora = () => new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  const registoHoje = (nome: string) => registos.find((r) => r.colaborador === nome && r.data === today);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Presença</h2>
      <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Controlo de ponto — {today}</p>
      {utilizadores.length === 0 ? <div className={`rounded-2xl border ${cardCls} p-10 text-center text-sm ${dark ? 'text-slate-400' : 'text-gray-400'}`}>Adiciona colaboradores em &quot;Utilizadores&quot;.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {utilizadores.map((u) => {
            const reg = registoHoje(u.nome);
            return (
              <div key={u.id} className={`rounded-2xl border ${cardCls} p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: BRAND + '22', color: BRAND }}>{(u.nome || '?').charAt(0).toUpperCase()}</div>
                  <div><p className="font-bold">{u.nome}</p><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{u.cargo || '-'}</p></div>
                  {reg && <span className={`ml-auto text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{reg.checkin}{reg.checkout && ` — ${reg.checkout}`}</span>}
                </div>
                {!reg ? <button onClick={() => add({ colaborador: u.nome, data: today, checkin: hora(), checkout: '' })} className="w-full text-white rounded-xl py-3 font-bold" style={{ background: '#16a34a' }}>Fazer Check-in</button>
                  : !reg.checkout ? <button onClick={() => updReg(reg.id, { checkout: hora() })} className="w-full text-white rounded-xl py-3 font-bold bg-orange-500 hover:opacity-90 transition">Fazer Check-out</button>
                  : <div className={`w-full text-center rounded-xl py-3 font-semibold text-sm ${dark ? 'bg-white/5 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Concluído hoje</div>}
              </div>
            );
          })}
        </div>
      )}
      <h3 className="text-lg font-bold mb-3">Histórico</h3>
      {registos.length === 0 ? <div className={`rounded-2xl border ${cardCls} p-10 text-center text-sm ${dark ? 'text-slate-400' : 'text-gray-400'}`}>Ainda sem registos.</div> : (
        <div className={`rounded-2xl border ${cardCls} overflow-hidden overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead><tr className={dark ? 'bg-white/5 text-slate-400' : 'bg-gray-50 text-gray-500'}><th className="text-left font-semibold px-4 py-3">Funcionário</th><th className="text-left font-semibold px-4 py-3">Data</th><th className="text-left font-semibold px-4 py-3">Check-in</th><th className="text-left font-semibold px-4 py-3">Check-out</th></tr></thead>
            <tbody>{registos.map((r) => (<tr key={r.id} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'}`}><td className="px-4 py-3">{r.colaborador}</td><td className="px-4 py-3">{r.data}</td><td className="px-4 py-3">{r.checkin}</td><td className="px-4 py-3">{r.checkout || '-'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---- Calendário ---- */
function CalendarioModule({ dark }: { dark: boolean }) {
  const { items: eventos, add, remove } = useSupabaseTable<any>('eventos');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ titulo?: string; data?: string }>({});
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm border outline-none ${dark ? 'bg-[#0f1525] border-white/10 text-slate-200' : 'bg-gray-50 border-gray-200'}`;
  const now = new Date(); const year = now.getFullYear(); const month = now.getMonth();
  const monthName = now.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = now.toISOString().slice(0, 10);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const evNoDia = (day: number) => { const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; return eventos.filter((e) => e.data === ds); };
  const save = async () => { if (!form.titulo || !form.data) return; await add(form); setForm({}); setShowForm(false); };
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  return (
    <div>
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <h2 className="text-2xl font-bold">Calendário</h2>
        <button onClick={() => setShowForm(true)} style={{ background: BRAND }} className="text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition"><Plus size={16} /> Novo Evento</button>
      </div>
      <p className={`text-sm mb-6 capitalize ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{monthName}</p>
      <div className={`rounded-2xl border ${cardCls} overflow-hidden`}>
        <div className={`grid grid-cols-7 text-center text-xs font-bold py-3 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{weekDays.map((d) => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => { if (day === null) return <div key={idx} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'} min-h-[80px]`} />;
            const dayEvs = evNoDia(day); const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const isToday = ds === todayStr;
            return (<div key={idx} className={`border-t ${dark ? 'border-white/5' : 'border-gray-100'} min-h-[80px] p-2`}>
              <span className={`text-sm font-semibold ${isToday ? 'w-6 h-6 inline-flex items-center justify-center rounded-full text-white' : ''}`} style={isToday ? { background: BRAND } : undefined}>{day}</span>
              <div className="mt-1 space-y-1">{dayEvs.map((e) => <div key={e.id} onClick={() => remove(e.id)} className="text-xs px-2 py-0.5 rounded-md truncate cursor-pointer" style={{ background: BRAND + '22', color: BRAND }}>{e.titulo}</div>)}</div>
            </div>);
          })}
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${dark ? 'bg-[#161d33] text-slate-200' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Novo Evento</h3>
            <div className="space-y-3">
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Título</label><input value={form.titulo || ''} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={inputCls} /></div>
              <div><label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Data</label><input type="date" value={form.data || ''} onChange={(e) => setForm({ ...form, data: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setShowForm(false); setForm({}); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancelar</button>
              <button onClick={save} style={{ background: BRAND }} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Backup ---- */
function BackupModule({ dark }: { dark: boolean }) {
  const [lastBackup, setLastBackup] = useLocalState<string>('chiva_last_backup', '');
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const fazerBackup = async () => {
    const tables = ['clientes', 'leads', 'financeiro', 'projetos', 'tarefas', 'utilizadores', 'equipamentos', 'presencas', 'eventos'];
    const data: Record<string, unknown> = {};
    for (const t of tables) { const { data: d } = await supabase.from(t).select('*'); data[t] = d; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `chiva-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url); setLastBackup(new Date().toLocaleString('pt-PT'));
  };
  return (
    <div><h2 className="text-2xl font-bold mb-6">Backup</h2>
      <div className={`rounded-2xl border ${cardCls} p-6 max-w-lg`}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: BRAND + '22', color: BRAND }}><RotateCcw size={22} /></div>
        <h3 className="font-bold text-lg mb-2">Backup Manual</h3>
        <p className={`text-sm mb-4 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Exporta todos os dados do Supabase em formato JSON.</p>
        {lastBackup && <p className={`text-sm mb-4 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Último backup: {lastBackup}</p>}
        <button onClick={fazerBackup} style={{ background: BRAND }} className="text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition"><Download size={16} /> Fazer Backup Agora</button>
      </div>
    </div>
  );
}

/* ---- Dashboard ---- */
function DashboardModule({ dark }: { dark: boolean }) {
  const { items: clientes } = useSupabaseTable<any>('clientes');
  const { items: leads } = useSupabaseTable<any>('leads');
  const { items: projetos } = useSupabaseTable<any>('projetos');
  const { items: tarefas } = useSupabaseTable<any>('tarefas');
  const { items: financeiro } = useSupabaseTable<any>('financeiro');
  const cardCls = dark ? 'bg-[#161d33] border-white/5' : 'bg-white border-gray-100';
  const leadsAtivos = leads.filter((l) => l.status !== 'Fechado').length;
  const tarefasPendentes = tarefas.filter((t) => t.status !== 'Concluída').length;
  const receitas = financeiro.filter((i) => i.tipo === 'Receita').reduce((s, i) => s + (Number(i.valor) || 0), 0);
  const despesas = financeiro.filter((i) => i.tipo === 'Despesa').reduce((s, i) => s + (Number(i.valor) || 0), 0);
  const saldo = receitas - despesas;
  const stats = [
    { label: 'Clientes', value: clientes.length, color: '#2563eb' },
    { label: 'Leads ativos', value: leadsAtivos, color: '#7c3aed' },
    { label: 'Projetos', value: projetos.length, color: '#ea580c' },
    { label: 'Tarefas pendentes', value: tarefasPendentes, color: '#0891b2' },
    { label: 'Receitas (€)', value: receitas.toFixed(2), color: '#16a34a' },
    { label: 'Despesas (€)', value: despesas.toFixed(2), color: '#dc2626' },
  ];
  const chartData = [{ nome: 'Receitas', valor: receitas, fill: '#16a34a' }, { nome: 'Despesas', valor: despesas, fill: '#dc2626' }];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (<div key={s.label} className={`rounded-2xl border ${cardCls} p-5`}><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{s.label}</p><p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p></div>))}
      </div>
      <div className={`rounded-2xl border ${cardCls} p-5 mb-6`}>
        <div className="flex items-center justify-between mb-4"><h3 className="font-bold">Receitas vs Despesas</h3><p className="text-sm font-semibold" style={{ color: saldo >= 0 ? '#16a34a' : '#dc2626' }}>Saldo: € {saldo.toFixed(2)}</p></div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#ffffff10' : '#e5e7eb'} />
              <XAxis dataKey="nome" stroke={dark ? '#94a3b8' : '#6b7280'} fontSize={12} />
              <YAxis stroke={dark ? '#94a3b8' : '#6b7280'} fontSize={12} />
              <Tooltip contentStyle={{ background: dark ? '#161d33' : '#fff', border: 'none', borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`€ ${Number(v).toFixed(2)}`, 'Valor']} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>{chartData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={`rounded-2xl border ${cardCls} p-5`}><p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Saldo atual</p><p className="text-3xl font-bold mt-1" style={{ color: saldo >= 0 ? '#16a34a' : '#dc2626' }}>€ {saldo.toFixed(2)}</p></div>
    </div>
  );
}

/* ---- Home ---- */
export default function Home() {
  const [authed, setAuthed] = useLocalState<boolean>('chiva_auth', false);
  const [dark, setDark] = useLocalState<boolean>('chiva_dark', false);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  if (!authed) return <LoginScreen dark={dark} onLogin={() => setAuthed(true)} />;

  const currentLabel = MODULES.find((m) => m.id === active)?.label || '';
  const badgeMap = (map: Record<string, string>) => (item: any) => {
    const key = Object.keys(map)[0] === 'status' ? item.status : item.estado;
    return key ? { label: key, color: map[key] || '#6b7280' } : null;
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <DashboardModule dark={dark} />;
      case 'clientes': return <EntityManager title="Clientes" table="clientes" dark={dark} search={search} fields={[{ key: 'nome', label: 'Nome' }, { key: 'email', label: 'Email' }, { key: 'telefone', label: 'Telefone' }, { key: 'empresa', label: 'Empresa' }]} />;
      case 'leads': return <EntityManager title="Leads" table="leads" dark={dark} search={search} fields={[{ key: 'nome', label: 'Nome' }, { key: 'contacto', label: 'Contacto' }, { key: 'valor', label: 'Valor (€)', type: 'number' }, { key: 'status', label: 'Estado', type: 'select', options: ['Novo', 'Contactado', 'Proposta', 'Fechado'] }]} badgeFn={(i) => i.status ? { label: i.status, color: ({ Novo: '#2563eb', Contactado: '#ea580c', Proposta: '#7c3aed', Fechado: '#16a34a' } as any)[i.status] || '#6b7280' } : null} />;
      case 'financeiro': return <FinanceiroModule dark={dark} search={search} />;
      case 'projetos': return <EntityManager title="Projetos" table="projetos" dark={dark} search={search} fields={[{ key: 'nome', label: 'Nome' }, { key: 'cliente', label: 'Cliente' }, { key: 'status', label: 'Estado', type: 'select', options: ['Planeado', 'Em curso', 'Concluído'] }, { key: 'deadline', label: 'Prazo', type: 'date' }]} badgeFn={(i) => i.status ? { label: i.status, color: ({ Planeado: '#2563eb', 'Em curso': '#ea580c', Concluído: '#16a34a' } as any)[i.status] || '#6b7280' } : null} />;
      case 'tarefas': return <EntityManager title="Tarefas" table="tarefas" dark={dark} search={search} fields={[{ key: 'titulo', label: 'Título' }, { key: 'responsavel', label: 'Responsável' }, { key: 'prazo', label: 'Prazo', type: 'date' }, { key: 'status', label: 'Estado', type: 'select', options: ['Pendente', 'Em progresso', 'Concluída'] }]} badgeFn={(i) => i.status ? { label: i.status, color: ({ Pendente: '#dc2626', 'Em progresso': '#ea580c', Concluída: '#16a34a' } as any)[i.status] || '#6b7280' } : null} />;
      case 'produtividade': return <ProdutividadeModule dark={dark} />;
      case 'presenca': return <PresencaModule dark={dark} />;
      case 'calendario': return <CalendarioModule dark={dark} />;
      case 'equipamentos': return <EntityManager title="Equipamentos" table="equipamentos" dark={dark} search={search} fields={[{ key: 'nome', label: 'Nome' }, { key: 'categoria', label: 'Categoria' }, { key: 'responsavel', label: 'Responsável' }, { key: 'estado', label: 'Estado', type: 'select', options: ['Disponível', 'Em uso', 'Manutenção'] }]} badgeFn={(i) => i.estado ? { label: i.estado, color: ({ Disponível: '#16a34a', 'Em uso': '#2563eb', Manutenção: '#ea580c' } as any)[i.estado] || '#6b7280' } : null} />;
      case 'utilizadores': return <EntityManager title="Utilizadores" table="utilizadores" dark={dark} search={search} fields={[{ key: 'nome', label: 'Nome' }, { key: 'email', label: 'Email' }, { key: 'cargo', label: 'Cargo' }, { key: 'role', label: 'Permissão', type: 'select', options: ['Admin', 'Funcionário'] }]} badgeFn={(i) => i.role ? { label: i.role, color: ({ Admin: '#7c3aed', Funcionário: '#2563eb' } as any)[i.role] || '#6b7280' } : null} />;
      case 'backup': return <BackupModule dark={dark} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${dark ? 'bg-[#0b0f1e] text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} onLogout={() => setAuthed(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenu={() => setSidebarOpen(true)} search={search} setSearch={setSearch} dark={dark} toggleDark={() => setDark(!dark)} title={currentLabel} />
        <main className="p-4 md:p-6 flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
