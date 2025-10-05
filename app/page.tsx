"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Placeholder from "./components/Placeholder";
import { LayoutDashboard, MessageCircle } from "lucide-react";

export default function Home() {
  const [active, setActive] = useState<string>("labi");

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="chat-area">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-title">
              <div className="app-title-main">Orbital Oddysey</div>
              <div className="app-title-sub">Marketing Campaign for a new TV series Launch</div>
            
              {/* use the same visual separator as the sidebar between title and items */}
              <div className="sidebar-separator" />
            </div>

            <nav className="app-tabs">
              {/* LABI AI (default selected) */}
              <button className={`tab ${active === "labi" ? "active" : ""}`} onClick={() => setActive("labi")}>
                <MessageCircle size={16} />
                <span>LABI AI</span>
              </button>

              {/* Dashboard */}
              <button className={`tab ${active === "dashboard" ? "active" : ""}`} onClick={() => setActive("dashboard")}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              {/* Library */}
              <button className={`tab ${active === "library" ? "active" : ""}`} onClick={() => setActive("library")}>
                <MessageCircle size={16} />
                <span>Library</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Content switches depending on the active tab */}
        {active === "labi" && <Chat />}

        {active === "dashboard" && (
          <Placeholder title="Próximamente" description="Gráficas asociadas a temas generales y subcategorías." />
        )}

        {active === "library" && (
          <Placeholder title="Próximamente" description="Publicaciones y autores — vista en desarrollo." />
        )}
      </main>
    </div>
  );
}
