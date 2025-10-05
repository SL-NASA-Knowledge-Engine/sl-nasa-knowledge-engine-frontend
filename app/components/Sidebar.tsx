"use client";

import React from "react";

const options = [
  { id: "p1", label: "Project 1" },
  { id: "p2", label: "Project 2" },
  { id: "p3", label: "Project 3" },
];

export default function Sidebar() {
  return (
    <nav className="sidebar-nav">
      <div className="sidebar-inner">
        <div className="sidebar-project">
          <div className="sidebar-project-title">Microgravedad</div>
          <div className="sidebar-project-count">(50) publicaciones relacionadas
            <button className="project-count-toggle" aria-label="toggle publications">
              {/* chevron down icon (lucide-style) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </div>
        <div className="sidebar-separator" />

        <ul>
          {options.map((o) => (
            <li key={o.id} className="sidebar-item" data-id={o.id}>
              <span className="item-icon" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path></svg>
              </span>
              <span className="item-label">{o.label}</span>
            </li>
          ))}

          <li className="sidebar-item add-project-item">
            <button className="add-project-btn" aria-label="Agregar nuevo proyecto">
              <span className="add-project-icon" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B5FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </span>
              <span className="add-project-text">Agregar un nuevo proyecto</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">Todos los derechos reservados a Space Labubus</div>
      </div>
    </nav>
  );
}
