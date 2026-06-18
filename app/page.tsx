"use client";
import { useState, useRef } from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "clientes", label: "Clientes", icon: "👥" },
  { id: "leads", label: "Leads", icon: "🎯" },
  { id: "projetos", label: "Projetos", icon: "📁" },
  { id: "tarefas", label: "Tarefas", icon: "✅" },
  { id: "financeiro", label: "Financeiro", icon: "💰" },
  { id: "equipa", label: "Equipa", icon: "👤" },
  { id: "equipamentos", label: "Equipamentos", icon: "🎥" },
  { id: "eventos", label: "Eventos", icon: "📅" },
];

function Sidebar({ active, setActive, collapsed, setCollapsed }: any) {
  return (
    <div style={{
      width: collapsed ? 64 : 220,
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s",
      position: "fixed",
      left: 0, top: 0, bottom: 0,
      zIndex: 100,
    }}>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        {!collapsed && <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Chiva CRM</span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          marginLeft: "auto", background: "none", border: "none",
          color: "#94a3b8", cursor: "pointer", fontSize: 18
        }}>=</button>
      </div>
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <div key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", cursor: "pointer",
            background: active === item.id ? "#1e40af" : "transparent",
            color: active === item.id ? "#fff" : "#94a3b8",
            borderRadius: 8, margin: "2px 8px",
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
}

function Topbar({ search, setSearch, darkMode, setDarkMode, page, avatar, onAvatarChange }: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{
      height: 60,
      background: darkMode ? "#1e293b" : "#fff",
      borderBottom: "1px solid #334155",
      display: "flex", alignItems: "center", padding: "0 24px", gap: 16,
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <span style={{ fontWeight: 700, fontSize: 18, color: darkMode ? "#f1f5f9" : "#0f172a", flex: 1 }}>
        {NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}
      </span>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Pesquisar..."
        style={{
          padding: "8px 14px", borderRadius: 8,
          border: "1px solid #334155",
          background: darkMode ? "#0f172a" : "#f8fafc",
          color: darkMode ? "#f1f5f9" : "#0f172a", width: 220, fontSize: 14
        }}
      />
      <button onClick={() => setDarkMode(!darkMode)} style={{
        background: "none", border: "none", cursor: "pointer", fontSize: 20
      }}>{darkMode ? "☀️" : "🌙"}</button>

      <div
        onClick={() => fileRef.current?.click()}
        title="Clica para mudar foto de perfil"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1e40af",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, cursor: "pointer",
          overflow: "hidden", border: "2px solid #3b82f6",
          flexShrink: 0,
        }}>
        {avatar
          ? <img src={avatar} alt="perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 16 }}>A</span>
        }
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => onAvatarChange(ev.target?.result as string);
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
}

function TablePage({ title, columns }: any) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
        <button style={{
          background: "#1e40af", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600
        }}>+ Adicionar</button>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f172a" }}>
              {columns.map((c: string) => (
                <th key={c} style={{ padding: "12px 16px", textAlign: "left", color: "#94a3b8", fontSize: 13 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: "#475569" }}>
                Sem dados ainda
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 22, fontWeight: 700 }}>Bem-vindo ao Chiva Creator CRM</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        {[
          { title: "Clientes", value: "24", icon: "👥", color: "#1e40af" },
          { title: "Leads", value: "12", icon: "🎯", color: "#0891b2" },
          { title: "Projetos", value: "8", icon: "📁", color: "#7c3aed" },
          { title: "Receita", value: "4200", icon: "💰", color: "#059669" },
        ].map(card => (
          <div key={card.title} style={{
            background: card.color, borderRadius: 12, padding: "20px 24px",
            color: "#fff", flex: 1, minWidth: 160
          }}>
            <div style={{ fontSize: 28 }}>{card.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  const sidebarWidth = collapsed ? 64 : 220;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "clientes": return <TablePage title="Clientes" columns={["Nome", "Email", "Telefone", "Estado"]} />;
      case "leads": return <TablePage title="Leads" columns={["Nome", "Fonte", "Estado", "Data"]} />;
      case "projetos": return <TablePage title="Projetos" columns={["Projeto", "Cliente", "Estado", "Prazo"]} />;
      case "tarefas": return <TablePage title="Tarefas" columns={["Tarefa", "Responsavel", "Prioridade", "Estado"]} />;
      case "financeiro": return <TablePage title="Financeiro" columns={["Descricao", "Tipo", "Valor", "Data"]} />;
      case "equipa": return <TablePage title="Equipa" columns={["Nome", "Funcao", "Email", "Estado"]} />;
      case "equipamentos": return <TablePage title="Equipamentos" columns={["Item", "Categoria", "Estado", "Local"]} />;
      case "eventos": return <TablePage title="Eventos" columns={["Evento", "Data", "Local", "Estado"]} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f8fafc",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      fontFamily: "system-ui, sans-serif"
    }}>
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: "margin-left 0.2s" }}>
        <Topbar
          search={search} setSearch={setSearch}
          darkMode={darkMode} setDarkMode={setDarkMode}
          page={page} avatar={avatar} onAvatarChange={setAvatar}
        />
        <main style={{ padding: 32 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}