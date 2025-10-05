"use client";

import React from "react";

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Placeholder({ title = "Próximamente", description = "Contenido en desarrollo.", children }: Props) {
  return (
    <div className="placeholder-panel">
      <div className="placeholder-inner">
        <h2>{title}</h2>
        <p>{description}</p>
        {children}

        {/* mini mock card */}
        <div className="mock-card">
          <div className="mock-chart" aria-hidden>
            {/* simple sparkline-like SVG */}
            <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 40 L20 30 L40 35 L60 20 L80 25 L100 15 L120 18 L140 12 L160 20 L180 10" stroke="#0B5FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div className="mock-stats">
            <div className="stat">
              <div className="stat-value">+12%</div>
              <div className="stat-label">Tendencia</div>
            </div>
            <div className="stat">
              <div className="stat-value">152</div>
              <div className="stat-label">Subcategorías</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
