'use client';

import { useState, useEffect } from 'react';

const BRAND = '#CC0000';

type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea';

interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
}

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}

function GenericCRUD({
  storageKey,
  title,
  fields,
}: {
  storageKey: string;
  title: string;
  fields: FieldConfig[];
}) {
  const [items, setItems] = useLocalState<any[]>(storageKey, []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [search, setSearch] = useState('');

  const openNew = () => {
    setForm({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const save = () => {
    if (editingId) {
      setItems(items.map((i) => (i.id === editingId ? { ...form, id: editingId } : i)));
    } else {
      setItems([...items, { ...form, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setForm({});
    setEditingId(null);
  };

  const remove = (id: string) => {
    if (confirm('Tem a certeza que quer eliminar este registo?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const filtered = items.filter((item) =>
    fields.some((f) => String(item[f.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={openNew}
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: BRAND }}
          >
            + Novo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {fields.map((f) => (
                <th key={f.key} className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={fields.length + 1} className="px-4 py-8 text-center text-gray-400">
                  Sem registos. Clique em &quot;+ Novo&quot; para adicionar.
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                {fields.map((f) => (
                  <td key={f.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {f.type === 'textarea'
                      ? String(item[f.key] ?? '').slice(0, 40)
                      : item[f.key] || '-'}
                  </td>
                ))}
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => remove(item.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Editar' : 'Novo'} - {title}
            </h3>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Selecionar...</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border">
                Cancelar
              </button>
              <button
                onClick={save}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ background: BRAND }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadsKanban() {
  const [leads, setLeads] = useLocalState<any[]>('chiva_leads', []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});
  const stages = ['Novo', 'Contactado', 'Proposta', 'Negociação', 'Ganho', 'Perdido'];

  const addLead = () => {
    if (!form.nome) return;
    setLeads([...leads, { ...form, id: Date.now().toString(), status: 'Novo' }]);
    setForm({});
    setShowForm(false);
  };

  const move = (id: string, status: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const remove = (id: string) => setLeads(leads.filter((l) => l.id !== id));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        <button
          onClick={() => setShowForm(true)}
          className="text-white px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: BRAND }}
        >
          + Novo Lead
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => (
          <div key={stage} className="bg-gray-100 rounded-xl p-3 min-h-[180px]">
            <h3 className="font-semibold text-gray-600 text-sm mb-2">
              {stage} ({leads.filter((l) => l.status === stage).length})
            </h3>
            <div className="space-y-2">
              {leads
                .filter((l) => l.status === stage)
                .map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg shadow p-3 text-sm">
                    <p className="font-semibold">{lead.nome}</p>
                    <p className="text-gray-500 text-xs">{lead.contacto}</p>
                    {lead.valor && <p className="text-gray-500 text-xs">€{lead.valor}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <select
                        value={lead.status}
                        onChange={(e) => move(lead.id, e.target.value)}
                        className="text-xs border rounded px-1 py-0.5"
                      >
                        {stages.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => remove(lead.id)} className="text-red-500 text-xs hover:underline">
                        eliminar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Novo Lead</h3>
            <div className="space-y-3">
              <input
                placeholder="Nome"
                value={form.nome ?? ''}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Contacto (email/telefone)"
                value={form.contacto ?? ''}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Valor estimado (€)"
                type="number"
                value={form.valor ?? ''}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Notas"
                value={form.notas ?? ''}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border">
                Cancelar
              </button>
              <button
                onClick={addLead}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ background: BRAND }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [clientes] = useLocalState<any[]>('chiva_clientes', []);
  const [leads] = useLocalState<any[]>('chiva_leads', []);
  const [projetos] = useLocalState<any[]>('chiva_projetos', []);
  const [tarefas] = useLocalState<any[]>('chiva_tarefas', []);
  const [financeiro] = useLocalState<any[]>('chiva_financeiro', []);

  const receitas = financeiro
    .filter((f) => f.tipo === 'Receita')
    .reduce((s, f) => s + Number(f.valor || 0), 0);
  const despesas = financeiro
    .filter((f) => f.tipo === 'Despesa')
    .reduce((s, f) => s + Number(f.valor || 0), 0);
  const tarefasPendentes = tarefas.filter((t) => t.estado !== 'Concluída').length;
  const leadsAtivos = leads.filter((l) => l.status !== 'Ganho' && l.status !== 'Perdido').length;

  const cards = [
    { label: 'Clientes', value: clientes.length, color: '#CC0000' },
    { label: 'Leads ativos', value: leadsAtivos, color: '#0284C7' },
    { label: 'Projetos', value: projetos.length, color: '#16A34A' },
    { label: 'Tarefas pendentes', value: tarefasPendentes, color: '#D97706' },
    { label: 'Receitas (€)', value: receitas.toFixed(2), color: '#16A34A' },
    { label: 'Despesas (€)', value: despesas.toFixed(2), color: '#DC2626' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-4 mt-4">
        <p className="text-gray-600 text-sm">
          Saldo atual:{' '}
          <span className="font-bold" style={{ color: receitas - despesas >= 0 ? '#16A34A' : '#DC2626' }}>
            €{(receitas - despesas).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}

function Backup() {
  const keys = [
    'chiva_clientes',
    'chiva_leads',
    'chiva_financeiro',
    'chiva_projetos',
    'chiva_tarefas',
    'chiva_produtividade',
    'chiva_presenca',
    'chiva_calendario',
    'chiva_equipamentos',
    'chiva_utilizadores',
  ];

  const exportData = () => {
    const data: any = {};
    keys.forEach((k) => {
      try {
        data[k] = JSON.parse(localStorage.getItem(k) || '[]');
      } catch {
        data[k] = [];
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chiva-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        keys.forEach((k) => {
          if (data[k]) localStorage.setItem(k, JSON.stringify(data[k]));
        });
        alert('Backup importado com sucesso! A página vai recarregar.');
        window.location.reload();
      } catch {
        alert('Ficheiro inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Backup</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-5 max-w-md">
        <div>
          <p className="font-semibold mb-2">Exportar dados</p>
          <button
            onClick={exportData}
            className="text-white px-4 py-2 rounded-lg font-semibold"
            style={{ background: BRAND }}
          >
            Descarregar Backup (.json)
          </button>
        </div>
        <div>
          <p className="font-semibold mb-2">Importar dados</p>
          <input type="file" accept=".json" onChange={importData} className="text-sm" />
          <p className="text-xs text-gray-400 mt-1">⚠️ Isto vai substituir os dados atuais.</p>
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (email === 'admin@chivacreator.pt' && pass === 'chiva2024') {
      localStorage.setItem('chiva_session', 'true');
      onLogin();
    } else {
      setError('Email ou password incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: BRAND }}>
          Chiva Creator CRM
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">Inicie sessão para continuar</p>
        <div className="space-y-3">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="w-full border rounded-lg px-3 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={submit}
            className="w-full text-white rounded-lg px-3 py-2 font-semibold"
            style={{ background: BRAND }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'clientes', label: 'Clientes', icon: '👥' },
  { key: 'leads', label: 'Leads', icon: '🎯' },
  { key: 'financeiro', label: 'Financeiro', icon: '💰' },
  { key: 'projetos', label: 'Projetos', icon: '📁' },
  { key: 'tarefas', label: 'Tarefas', icon: '✅' },
  { key: 'produtividade', label: 'Produtividade', icon: '⏱️' },
  { key: 'presenca', label: 'Presença', icon: '🕐' },
  { key: 'calendario', label: 'Calendário', icon: '📅' },
  { key: 'equipamentos', label: 'Equipamentos', icon: '🛠️' },
  { key: 'utilizadores', label: 'Utilizadores', icon: '👤' },
  { key: 'backup', label: 'Backup', icon: '💾' },
];

export default function Home() {
  const [logged, setLogged] = useState<boolean | null>(null);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLogged(localStorage.getItem('chiva_session') === 'true');
  }, []);

  if (logged === null) return null;
  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  const logout = () => {
    localStorage.removeItem('chiva_session');
    setLogged(false);
  };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return (
          <GenericCRUD
            storageKey="chiva_clientes"
            title="Clientes"
            fields={[
              { key: 'nome', label: 'Nome' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'email', label: 'Email' },
              { key: 'telefone', label: 'Telefone' },
              { key: 'nif', label: 'NIF' },
              { key: 'notas', label: 'Notas', type: 'textarea' },
            ]}
          />
        );
      case 'leads':
        return <LeadsKanban />;
      case 'financeiro':
        return (
          <GenericCRUD
            storageKey="chiva_financeiro"
            title="Financeiro"
            fields={[
              { key: 'tipo', label: 'Tipo', type: 'select', options: ['Receita', 'Despesa'] },
              { key: 'descricao', label: 'Descrição' },
              { key: 'categoria', label: 'Categoria' },
              { key: 'valor', label: 'Valor (€)', type: 'number' },
              { key: 'data', label: 'Data', type: 'date' },
            ]}
          />
        );
      case 'projetos':
        return (
          <GenericCRUD
            storageKey="chiva_projetos"
            title="Projetos"
            fields={[
              { key: 'nome', label: 'Nome' },
              { key: 'cliente', label: 'Cliente' },
              {
                key: 'estado',
                label: 'Estado',
                type: 'select',
                options: ['Planeado', 'Em curso', 'Concluído', 'Cancelado'],
              },
              { key: 'inicio', label: 'Início', type: 'date' },
              { key: 'fim', label: 'Fim', type: 'date' },
              { key: 'orcamento', label: 'Orçamento (€)', type: 'number' },
            ]}
          />
        );
      case 'tarefas':
        return (
          <GenericCRUD
            storageKey="chiva_tarefas"
            title="Tarefas"
            fields={[
              { key: 'titulo', label: 'Título' },
              { key: 'projeto', label: 'Projeto' },
              { key: 'responsavel', label: 'Responsável' },
              { key: 'prioridade', label: 'Prioridade', type: 'select', options: ['Baixa', 'Média', 'Alta'] },
              { key: 'estado', label: 'Estado', type: 'select', options: ['Pendente', 'Em curso', 'Concluída'] },
              { key: 'prazo', label: 'Prazo', type: 'date' },
            ]}
          />
        );
      case 'produtividade':
        return (
          <GenericCRUD
            storageKey="chiva_produtividade"
            title="Produtividade"
            fields={[
              { key: 'colaborador', label: 'Colaborador' },
              { key: 'data', label: 'Data', type: 'date' },
              { key: 'tarefa', label: 'Tarefa / Atividade' },
              { key: 'horas', label: 'Horas', type: 'number' },
              { key: 'notas', label: 'Notas', type: 'textarea' },
            ]}
          />
        );
      case 'presenca':
        return (
          <GenericCRUD
            storageKey="chiva_presenca"
            title="Presença"
            fields={[
              { key: 'colaborador', label: 'Colaborador' },
              { key: 'data', label: 'Data', type: 'date' },
              { key: 'entrada', label: 'Hora de Entrada' },
              { key: 'saida', label: 'Hora de Saída' },
              { key: 'notas', label: 'Notas' },
            ]}
          />
        );
      case 'calendario':
        return (
          <GenericCRUD
            storageKey="chiva_calendario"
            title="Calendário"
            fields={[
              { key: 'data', label: 'Data', type: 'date' },
              { key: 'titulo', label: 'Título' },
              { key: 'descricao', label: 'Descrição', type: 'textarea' },
            ]}
          />
        );
      case 'equipamentos':
        return (
          <GenericCRUD
            storageKey="chiva_equipamentos"
            title="Equipamentos"
            fields={[
              { key: 'nome', label: 'Nome' },
              { key: 'tipo', label: 'Tipo' },
              {
                key: 'estado',
                label: 'Estado',
                type: 'select',
                options: ['Disponível', 'Em uso', 'Manutenção', 'Avariado'],
              },
              { key: 'responsavel', label: 'Responsável' },
              { key: 'notas', label: 'Notas', type: 'textarea' },
            ]}
          />
        );
      case 'utilizadores':
        return (
          <GenericCRUD
            storageKey="chiva_utilizadores"
            title="Utilizadores"
            fields={[
              { key: 'nome', label: 'Nome' },
              { key: 'email', label: 'Email' },
              { key: 'funcao', label: 'Função', type: 'select', options: ['Admin', 'Gestor', 'Colaborador'] },
              { key: 'telefone', label: 'Telefone' },
            ]}
          />
        );
      case 'backup':
        return <Backup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-white border-r flex flex-col transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b">
          <h1 className="font-bold text-lg" style={{ color: BRAND }}>
            Chiva Creator CRM
          </h1>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left ${
                active === item.key ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={active === item.key ? { background: BRAND } : {}}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={logout} className="w-full text-sm text-gray-500 hover:text-red-600 px-3 py-2 text-left">
            🚪 Sair
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-bold" style={{ color: BRAND }}>
            Chiva Creator CRM
          </h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl leading-none">
            ☰
          </button>
        </header>
        <main className="p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
