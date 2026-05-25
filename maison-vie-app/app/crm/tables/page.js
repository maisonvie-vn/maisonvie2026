"use client";

import React, { useState, useEffect } from "react";

// Mock 2D Tables list with statuses, allergen warnings, assigned staff, and order contents
const INITIAL_TABLES = [
  { id: "T1-01", name: "Bàn Tầng 1 - 01", count: 4, status: "active", staff: "Nguyễn Văn Nam", timeRemaining: "112p", allergens: ["GLUTEN"], orderItems: ["Bò Wellington", "Bánh mì tỏi"] },
  { id: "T1-02", name: "Bàn Tầng 1 - 02", count: 2, status: "idle", staff: "Chưa gán", timeRemaining: "", allergens: [], orderItems: [] },
  { id: "T1-03", name: "Bàn Tầng 1 - 03", count: 2, status: "active", staff: "Trần Thị Mai", timeRemaining: "85p", allergens: ["MILK"], orderItems: ["Gan Ngỗng Áp Chảo", "Bánh Crème Brûlée"] },
  { id: "T2-01", name: "Bàn Tầng 2 - 01", count: 6, status: "idle", staff: "Chưa gán", timeRemaining: "", allergens: [], orderItems: [] },
  { id: "VIP-1", name: "Phòng VIP 1 (Confidential)", count: 8, status: "active", staff: "Chuyên gia Sommelier Hoàng", timeRemaining: "120p (Khóa tự động)", allergens: ["EGGS", "GLUTEN"], orderItems: ["Bò Wellington", "Bánh Crème Brûlée"] },
  { id: "VIP-2", name: "Phòng VIP 2 (Le Jardin)", count: 12, status: "idle", staff: "Chưa gán", timeRemaining: "", allergens: [], orderItems: [] }
];

export default function CrmTables() {
  const [tables, setTables] = useState(INITIAL_TABLES);
  
  // Selection for Swapping/Merging
  const [selectedTableA, setSelectedTableA] = useState("");
  const [selectedTableB, setSelectedTableB] = useState("");

  // Allergen Lock Strobe Alert Demonstration State
  const [strobeAlertVisible, setStrobeAlertVisible] = useState(false);
  const [strobeMessage, setStrobeMessage] = useState("");

  const handleSwapTables = () => {
    if (!selectedTableA || !selectedTableB) {
      alert("Vui lòng chọn 2 bàn để chuyển đổi vị trí phục vụ!");
      return;
    }

    if (selectedTableA === selectedTableB) {
      alert("Vui lòng chọn 2 bàn khác nhau!");
      return;
    }

    setTables((prev) => {
      const idxA = prev.findIndex((t) => t.id === selectedTableA);
      const idxB = prev.findIndex((t) => t.id === selectedTableB);
      if (idxA === -1 || idxB === -1) return prev;

      const newTables = [...prev];
      // Swapping all orders, staff assignments, status, allergens, and lock times
      const temp = {
        status: newTables[idxA].status,
        staff: newTables[idxA].staff,
        timeRemaining: newTables[idxA].timeRemaining,
        allergens: newTables[idxA].allergens,
        orderItems: newTables[idxA].orderItems
      };

      newTables[idxA] = {
        ...newTables[idxA],
        status: newTables[idxB].status,
        staff: newTables[idxB].staff,
        timeRemaining: newTables[idxB].timeRemaining,
        allergens: newTables[idxB].allergens,
        orderItems: newTables[idxB].orderItems
      };

      newTables[idxB] = {
        ...newTables[idxB],
        status: temp.status,
        staff: temp.staff,
        timeRemaining: temp.timeRemaining,
        allergens: temp.allergens,
        orderItems: temp.orderItems
      };

      return newTables;
    });

    setSelectedTableA("");
    setSelectedTableB("");
    
    // Simulate real-time notification
    alert("✓ Đồng bộ WebSocket hoàn tất: Đã thực hiện Swapping đơn hàng và gán lại thời gian khóa 120 phút liên tục!");
  };

  const handleOrderDish = (tableId, dishName, dishAllergens) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    // Check Allergen Lock Interceptor
    const conflictAllergen = dishAllergens.find((a) => table.allergens.includes(a));
    
    if (conflictAllergen) {
      // Flashes the red strobe alert warning in real time
      setStrobeMessage(`CẢNH BÁO BẢO VỆ DỊ ỨNG: Không thể order món "${dishName}" cho "${table.name}"! Món này chứa chất dị ứng "${conflictAllergen}" đang bị CẤM đối với thực khách của bàn này theo Tiêu Chuẩn Vệ Sinh An Toàn Thực Phẩm EU.`);
      setStrobeAlertVisible(true);
      
      // Auto-hide strobe alert after 6 seconds
      setTimeout(() => {
        setStrobeAlertVisible(false);
      }, 6000);
      return;
    }

    // Otherwise, add dish to order
    setTables((prev) => 
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            status: "active",
            timeRemaining: t.timeRemaining || "120p",
            orderItems: [...t.orderItems, dishName]
          };
        }
        return t;
      })
    );
    alert(`✓ Đã order thành công món "${dishName}" cho ${table.name}!`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in relative">
      
      {/* 🚨 STROBE ALLERGEN ALERT POPUP */}
      {strobeAlertVisible && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-55 w-full max-w-xl p-6 bg-red-950/90 border border-red-500 rounded-lg shadow-2xl flex items-start space-x-4 animate-bounce text-red-200">
          <span className="text-3xl">🚨</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-400">Allergen Safety Blocked!</h4>
            <p className="text-xs font-light mt-1 leading-relaxed">{strobeMessage}</p>
          </div>
          <button 
            onClick={() => setStrobeAlertVisible(false)}
            className="text-red-400 hover:text-red-300 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
            Sơ Đồ Bàn 2D & Điều Phối Ca Làm Việc
          </h1>
          <p className="text-stone-400 text-sm font-light mt-1">
            Manager phân công FOH gán bàn trực động và chuyển bàn (Table Swapping) thời gian thực
          </p>
        </div>

        {/* Swap Control Bar */}
        <div className="glassmorphism p-3 border border-white/5 rounded flex items-center space-x-3 text-xs">
          <span className="text-stone-500 font-semibold uppercase">Chuyển Bàn:</span>
          <select 
            value={selectedTableA}
            onChange={(e) => setSelectedTableA(e.target.value)}
            className="bg-black/40 border border-white/10 text-stone-300 px-2 py-1 rounded"
          >
            <option value="">Chọn bàn A</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <span className="text-stone-500">⇄</span>
          <select 
            value={selectedTableB}
            onChange={(e) => setSelectedTableB(e.target.value)}
            className="bg-black/40 border border-white/10 text-stone-300 px-2 py-1 rounded"
          >
            <option value="">Chọn bàn B</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button 
            onClick={handleSwapTables}
            className="bg-gold-500 text-dark-500 px-3 py-1 rounded font-bold uppercase tracking-wider"
          >
            Swap Bàn
          </button>
        </div>
      </div>

      {/* 📊 2D TABLE LAYOUT MAP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {tables.map((table) => {
          const isActive = table.status === "active";
          return (
            <div 
              key={table.id}
              className={`glassmorphism border p-6 rounded shadow-xl relative overflow-hidden transition-premium flex flex-col justify-between h-72 text-left ${
                isActive 
                  ? "border-gold-500/30 bg-gold-500/5 shadow-[0_0_20px_rgba(197,165,90,0.05)]" 
                  : "border-white/5"
              }`}
            >
              
              {/* Table header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-0.5">{table.id}</span>
                  <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide">
                    {table.name}
                  </h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-[3px] text-[9px] uppercase font-bold tracking-wider ${
                  isActive ? "bg-gold-500/20 text-gold-400 border border-gold-500/30" : "bg-stone-900 text-stone-500 border border-white/5"
                }`}>
                  {isActive ? "Đang Ngồi" : "Bàn Trống"}
                </span>
              </div>

              {/* Table Body: FOH staff, orders, and allergens */}
              <div className="my-4 space-y-2.5 text-xs">
                
                {/* Time remaining indicator */}
                {isActive && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Khóa tự động:</span>
                    <span className="text-gold-400 font-bold font-mono">{table.timeRemaining}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-stone-500">Nhân viên gán ca:</span>
                  <span className="text-stone-300 font-medium">{table.staff}</span>
                </div>

                {/* Allergen Warning Flag on Table */}
                {table.allergens.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Cấm chất dị ứng:</span>
                    <div className="flex space-x-1">
                      {table.allergens.map((a) => (
                        <span key={a} className="bg-red-950/20 border border-red-500/30 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-bold">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Orders */}
                {isActive && (
                  <div>
                    <span className="text-stone-500 block mb-1">Món đã phục vụ:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {table.orderItems.map((item, index) => (
                        <span key={index} className="bg-white/5 text-stone-300 text-[10px] px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action: Place Order and test Allergen lock */}
              <div className="pt-4 border-t border-white/5 flex gap-2">
                
                {/* Button Order Wellington (Contains Gluten) */}
                <button
                  onClick={() => handleOrderDish(table.id, "Bò Wellington Thượng Hạng", ["GLUTEN", "EGGS", "MILK"])}
                  className="flex-1 bg-black/40 border border-white/10 hover:border-gold-500/30 text-stone-300 text-[10px] uppercase tracking-wider py-2 font-semibold transition-premium rounded"
                >
                  + Wellington (Gluten)
                </button>

                {/* Button Order Foie Gras (Contains Milk) */}
                <button
                  onClick={() => handleOrderDish(table.id, "Gan Ngỗng Áp Chảo", ["MILK"])}
                  className="flex-1 bg-black/40 border border-white/10 hover:border-gold-500/30 text-stone-300 text-[10px] uppercase tracking-wider py-2 font-semibold transition-premium rounded"
                >
                  + Foie Gras (Milk)
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
