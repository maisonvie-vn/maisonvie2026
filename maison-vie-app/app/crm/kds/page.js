"use client";

import React, { useState, useEffect } from "react";

const INITIAL_TICKETS = [
  { id: "TK-402", table: "Bàn T1-01", elapsed: "12p", category: "Main Course", items: [{ name: "Bò Wellington Thượng Hạng", qty: 2, status: "cooking" }, { name: "Bánh mì tỏi", qty: 1, status: "pending" }], allergens: ["GLUTEN", "MILK"] },
  { id: "TK-403", table: "Phòng VIP 1", elapsed: "4p", category: "Appetizer & Main", items: [{ name: "Gan Ngỗng Áp Chảo", qty: 4, status: "cooking" }, { name: "Bò Wellington Thượng Hạng", qty: 4, status: "pending" }], allergens: ["GLUTEN", "EGGS", "MILK"] },
  { id: "TK-404", table: "Bàn T1-03", elapsed: "18p", category: "Dessert", items: [{ name: "Bánh Crème Brûlée", qty: 2, status: "served" }], allergens: ["EGGS", "MILK"] }
];

export default function CrmKds() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  
  // Kitchen Equipment Disaster Mode (KED Mode)
  const [kedModeActive, setKedModeActive] = useState(false);

  const handleUpdateItemStatus = (ticketId, itemName, nextStatus) => {
    setTickets((prev) => 
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = t.items.map((item) => {
            if (item.name === itemName) {
              return { ...item, status: nextStatus };
            }
            return item;
          });
          return { ...t, items: updatedItems };
        }
        return t;
      })
    );

    if (nextStatus === "served") {
      alert(`🔔 KDS RUNNER ALERT: Đã phát tín hiệu gọi nhân viên FOH chạy bàn đến bê món nóng sốt cho "${tickets.find(t => t.id === ticketId)?.table}"!`);
    }
  };

  const handleToggleKedMode = () => {
    setKedModeActive(!kedModeActive);
    alert(
      kedModeActive 
        ? "✓ KED MODE DEACTIVATED: Đã khôi phục hoạt động thiết bị và mở khóa thực đơn toàn bộ."
        : "⚠️ KED MODE ACTIVATED: Đã kích hoạt chế độ Sự cố Thiết bị Bếp! Lò nướng combi báo hỏng, POS sảnh và Web công khai đã tự động khóa các món liên quan trong 1 giây để tránh nhận nhầm order!"
    );
  };

  return (
    <div className="space-y-8 text-left animate-fade-in relative">
      
      {/* KED Mode Alert Bar */}
      {kedModeActive && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-400 text-xs rounded flex items-center justify-between animate-pulse">
          <span className="font-semibold">🚨 KITCHEN EQUIPMENT DISASTER MODE ACTIVE: LÒ NƯỚNG COMBI ĐANG BÁO HỎNG!</span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-red-500/20 px-2 py-0.5 rounded text-red-300">Khóa món nướng</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
            KDS · Màn Hình Điều Phối Bếp BOH
          </h1>
          <p className="text-stone-400 text-sm font-light mt-1">
            Điều phối chế biến chuẩn Michelin, Runner Alert gọi phục vụ và Gala Mode gộp lô sản xuất
          </p>
        </div>

        {/* Chef Disaster button */}
        <button
          onClick={handleToggleKedMode}
          className={`text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded border transition-premium ${
            kedModeActive 
              ? "bg-red-500/20 border-red-500 text-red-400 font-bold" 
              : "bg-black/20 border-white/5 text-stone-400 hover:border-red-500/30"
          }`}
        >
          {kedModeActive ? "Khôi phục thiết bị" : "Báo hỏng thiết bị Bếp 🚨"}
        </button>
      </div>

      {/* 🎫 ACTIVE KITCHEN TICKETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {tickets.map((t) => {
          const isDone = t.items.every(i => i.status === "served");
          return (
            <div 
              key={t.id}
              className={`glassmorphism border p-6 rounded shadow-xl flex flex-col justify-between h-80 text-left relative overflow-hidden transition-premium ${
                isDone ? "border-stone-800 opacity-60" : "border-white/5"
              }`}
            >
              
              {/* Ticket header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold font-mono">{t.id}</span>
                    <span className="text-[9px] uppercase tracking-widest text-gold-500 font-semibold">{t.category}</span>
                  </div>
                  <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mt-1">
                    {t.table}
                  </h3>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-stone-400 font-bold font-mono animate-pulse">{t.elapsed}</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">Giờ đón tiếp</span>
                </div>
              </div>

              {/* Items List */}
              <div className="my-4 flex-1 space-y-3.5 overflow-y-auto pr-1">
                {t.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3 text-left">
                      <span className="text-gold-400 font-bold font-mono">x{item.qty}</span>
                      <span className={`font-semibold ${item.status === "served" ? "line-through text-stone-500" : "text-stone-200"}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex space-x-1.5">
                      {item.status === "pending" && (
                        <button 
                          onClick={() => handleUpdateItemStatus(t.id, item.name, "cooking")}
                          className="bg-gold-500 text-dark-500 px-2 py-0.5 rounded-[3px] text-[10px] uppercase font-bold tracking-wider"
                        >
                          Nấu
                        </button>
                      )}
                      {item.status === "cooking" && (
                        <button 
                          onClick={() => handleUpdateItemStatus(t.id, item.name, "served")}
                          className="bg-emerald-600 text-stone-900 px-2 py-0.5 rounded-[3px] text-[10px] uppercase font-bold tracking-wider"
                        >
                          Xong (Call FOH)
                        </button>
                      )}
                      {item.status === "served" && (
                        <span className="text-emerald-400 font-semibold text-[10px] uppercase tracking-wider">
                          ✓ Đã bê món
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Allergens Warn */}
              {t.allergens.length > 0 && !isDone && (
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold">⚠️ DỊ ỨNG KHÁCH:</span>
                  {t.allergens.map((a) => (
                    <span key={a} className="bg-red-950/20 border border-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}
