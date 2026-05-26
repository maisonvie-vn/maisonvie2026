"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Role label mapping
const ROLE_LABELS = {
  admin:       { label: "Admin",      color: "text-gold-400",    bg: "bg-gold-500/10",    border: "border-gold-500/20" },
  manager:     { label: "Manager",    color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  accountant:  { label: "Kế Toán",   color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
  chef:        { label: "Chef",       color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  runner:      { label: "FOH Runner", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

// Auth-bypass pages (no sidebar/topbar)
const AUTH_PAGES = ["/crm/login", "/crm/verify", "/crm/setup-totp", "/crm/unauthorized"];

export default function CrmLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [shift, setShift] = useState("Ca Tối (17:30 - 22:00)");

  useEffect(() => {
    // Load user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setRole(user.app_metadata?.role || null);
      }
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.app_metadata?.role || null);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("crm_role", role || "");
    localStorage.setItem("crm_shift", shift);
    window.dispatchEvent(new Event("crm_auth_change"));
  }, [role, shift]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/crm/login");
  };

  // Auth pages render without sidebar
  if (AUTH_PAGES.some(p => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Tổng quan OS", path: "/crm", icon: "📊" },
    { name: "Sơ đồ bàn 2D", path: "/crm/tables", icon: "🍽️" },
    { name: "KDS Bếp", path: "/crm/kds", icon: "🔥" },
    { name: "BDS Quầy Bar", path: "/crm/bds", icon: "🍷" },
    { name: "POS Thanh toán", path: "/crm/pos", icon: "💳" },
    { name: "Dự báo AI", path: "/crm/ai", icon: "🤖" },
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
          <p className="mt-1">Fine Dining Operating Standard</p>
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

          {/* User Info + Logout */}
          <div className="flex items-center space-x-4">
            {role && (() => {
              const r = ROLE_LABELS[role] || ROLE_LABELS.manager;
              return (
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 border rounded ${r.color} ${r.bg} ${r.border}`}>
                  {r.label}
                </span>
              );
            })()}
            {user && (
              <span className="text-xs text-stone-500 hidden md:inline">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest text-stone-600 hover:text-red-400 border border-white/5 hover:border-red-500/20 px-3 py-1.5 transition-all"
              title="Đăng xuất"
            >
              ⏻ Logout
            </button>
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
