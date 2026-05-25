"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CrmLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Dynamic role selector for easy operational testing (Admin, Manager, Chef, FOH)
  const [role, setRole] = useState("Manager");
  const [shift, setShift] = useState("Ca Tối (17:30 - 22:00)");

  useEffect(() => {
    // Store active role and shift in local storage for deep CRM connectivity
    localStorage.setItem("crm_role", role);
    localStorage.setItem("crm_shift", shift);
    
    // Dispatch custom event to notify child components of role changes
    window.dispatchEvent(new Event("crm_auth_change"));
  }, [role, shift]);

  const navItems = [
    { name: "Tổng quan OS", path: "/crm", icon: "📊" },
    { name: "Sơ đồ bàn 2D", path: "/crm/tables", icon: "🍽️" },
    { name: "KDS Bếp", path: "/crm/kds", icon: "🔥" },
    { name: "BDS Quầy Bar", path: "/crm/bds", icon: "🍷" },
    { name: "Đào tạo SOP", path: "/crm/training", icon: "📖" }
  ];

  return (
    <div className="flex h-screen bg-dark-600 text-stone-200 font-sans overflow-hidden">
      
      {/* 🏛️ CRM SIDEBAR */}
      <aside className="w-64 bg-dark-400 border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-white/5 flex flex-col cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-lg font-semibold tracking-wider text-gold-500 font-luxury uppercase">Maison Vie OS</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-stone-500 font-sans mt-0.5">Restaurant Management</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded text-[13px] font-semibold tracking-wide transition-premium ${
                    isActive 
                      ? "bg-gold-500/10 text-gold-400 border-l-2 border-gold-500 font-bold" 
                      : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Brand identity footer */}
        <div className="p-6 border-t border-white/5 text-[10px] text-stone-600 font-light text-left">
          <p>Maison Vie OS v2.6.0</p>
          <p className="mt-1">Michelin Operating Standard</p>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-dark-400 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
          
          {/* Active Shift details */}
          <div className="flex items-center space-x-4 text-left">
            <span className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2.5 py-1 font-semibold rounded uppercase tracking-wider">
              {shift}
            </span>
            <span className="text-xs text-stone-500 font-light hidden sm:inline">
              Quy mô: 250 chỗ ngồi · Tầng 1 · Tầng 2 · VIP Salons
            </span>
          </div>

          {/* Active Testing Role Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-500 font-semibold uppercase tracking-wider">Quyền ca trực:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-black/40 border border-white/10 text-gold-400 px-3 py-1.5 focus:outline-none focus:border-gold-500 font-semibold rounded uppercase tracking-wider"
              >
                <option value="Admin" className="bg-dark-400 text-stone-200">Admin (Chủ đầu tư)</option>
                <option value="Manager" className="bg-dark-400 text-stone-200">Manager (Quản lý)</option>
                <option value="Chef" className="bg-dark-400 text-stone-200">Chef (Bếp Trưởng)</option>
                <option value="Runner" className="bg-dark-400 text-stone-200">FOH Runner (Phục vụ)</option>
              </select>
            </div>

            <div className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-xs text-gold-400 font-bold bg-gold-500/10">
              {role.charAt(0)}
            </div>
          </div>

        </header>

        {/* CRM PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-dark-500 relative">
          {children}
        </main>

      </div>

    </div>
  );
}
