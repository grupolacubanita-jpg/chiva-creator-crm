"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "??" },
  { id: "clientes", label: "Clientes", icon: "??" },
  { id: "leads", label: "Leads", icon: "??" },
  { id: "projetos", label: "Projetos", icon: "??" },
  { id: "tarefas", label: "Tarefas", icon: "?" },
  { id: "financeiro", label: "Financeiro", icon: "??" },
  { id: "equipa", label: "Equipa", icon: "??" },
  { id: "equipamentos", label: "Equipamentos", icon: "??" },
  { id: "eventos", label: "Eventos", icon: "??" },
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
        {!collapsed && <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>?? Chiva CRM</span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          marginLeft: "auto", background: "none", border: "none",
          color: "#94a3b8", cursor: "pointer", fontSize: 18
        }}>?</button>
      </div>
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <div key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", cursor: "pointer",
            background: active === item.id ? "#1e40af" : "transparent",
            color: active === item.id ? "#fff" : "#94a3b8",
            borderRadius: 8, margin: "2px 8px",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
          </div>
        ))}
      </nav>
      <div style={{ padding: 16, color: "#475569", fontSize: 12 }}>
        {!collapsed && "v1.0.0"}
      </div>
    </div>
  );
}

function Topbar({ search, setSearch, darkMode, setDarkMode, page }: any) {
  return (
    <div style={{
      height: 60, background: darkMode ? "#1e293b" : "#fff",
      borderBottom: "1px solid " + (darkMode ? "#334155" : "#e2e8f0"),
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
          border: "1px solid " + (darkMode ? "#334155" : "#e2e8f0"),
          background: darkMode ? "#0f172a" : "#f8fafc",
          color: darkMode ? "#f1f5f9" : "#0f172a", width: 220, fontSize: 14
        }}
      />
      <button onClick={() => setDarkMode(!darkMode)} style={{
        background: "none", border: "none", cursor: "pointer", fontSize: 20
      }}>{darkMode ? "??" : "??"}</button>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#1e40af", display: "flex", alignItems: "center",
        justifyContent: "center", color: "#fff", fontWeight: 700
      }}>A</div>
    </div>
  );
}

function Card({ title, value, icon, color }: any) {
  return (
    <div style={{
      background: color || "#1e40af", borderRadius: 12, padding: "20px 24px",
      color: "#fff", display: "flex", flexDirection: "column", gap: 8, minWidth: 160, flex: 1
    }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ fontSize: 28, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 13, opacity: 0.85 }}>{title}</span>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 22, fontWeight: 700 }}>Bem-vindo ao Chiva Creator CRM</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <Card title="Clientes Ativos" value="24" icon="??" color="#1e40af" />
        <Card title="Leads" value="12" icon="??" color="#0891b2" />
        <Card title="Projetos" value="8" icon="??" color="#7c3aed" />
        <Card title="Receita Mensal" value="€4.200" icon="??" color="#059669" />
      </div>
      <div style={{
        background: "#1e293b", borderRadius: 12, padding: 24,
        color: "#94a3b8", textAlign: "center"
      }}>
        <p style={{ fontSize: 16 }}>?? Gráficos e estatísticas em breve...</p>
      </div>
    </div>
  );
}

function TablePage({ title, columns, rows }: any) {
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
                <th key={c} style={{ padding: "12px 16px", textAlign: "left", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: "#475569" }}>Sem dados ainda</td></tr>
            ) : rows.map((row: any, i: number) => (
              <tr key={i} style={{ borderTop: "1px solid #334155" }}>
                {Object.values(row).map((v: any, j: number) => (
                  <td key={j} style={{ padding: "12px 16px", color: "#e2e8f0", fontSize: 14 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const sidebarWidth = collapsed ? 64 : 220;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "clientes": return <TablePage title="Clientes" columns={["Nome","Email","Telefone","Estado"]} rows={[]} />;
      case "leads": return <TablePage title="Leads" columns={["Nome","Fonte","Estado","Data"]} rows={[]} />;
      case "projetos": return <TablePage title="Projetos" columns={["Projeto","Cliente","Estado","Prazo"]} rows={[]} />;
      case "tarefas": return <TablePage title="Tarefas" columns={["Tarefa","Responsável","Prioridade","Estado"]} rows={[]} />;
      case "financeiro": return <TablePage title="Financeiro" columns={["Descrição","Tipo","Valor","Data"]} rows={[]} />;
      case "equipa": return <TablePage title="Equipa" columns={["Nome","Função","Email","Estado"]} rows={[]} />;
      case "equipamentos": return <TablePage title="Equipamentos" columns={["Item","Categoria","Estado","Local"]} rows={[]} />;
      case "eventos": return <TablePage title="Eventos" columns={["Evento","Data","Local","Estado"]} rows={[]} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f8fafc",
      color: darkMode ? "#f1f5f9" : "#0f172a",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: "margin-left 0.2s" }}>
        <Topbar search={search} setSearch={setSearch} darkMode={darkMode} setDarkMode={setDarkMode} page={page} />
        <main style={{ padding: 32 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
