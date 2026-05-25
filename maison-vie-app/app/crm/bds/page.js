"use client";

import React, { useState } from "react";

const INITIAL_BAR_TICKETS = [
  { id: "TK-B801", table: "Bàn T1-01", elapsed: "2p", items: [{ name: "French Connection Cocktail", qty: 2, status: "pending" }, { name: "Nước ép cam sả bản địa", qty: 1, status: "completed" }] },
  { id: "TK-B802", table: "Phòng VIP 1", elapsed: "5p", items: [{ name: "Château Margaux 2015 (Rót ly)", qty: 2, status: "pending" }] }
];

const INITIAL_OPENED_BOTTLES = [
  { id: 1, name: "Château Margaux 2015", openedAt: "70 giờ trước", remaining: "150ml (Còn 5 ly)", limit: "72 giờ", status: "warning", wine: "Vang Đỏ" },
  { id: 2, name: "Pouilly-Fuissé Chardonnay 2020", openedAt: "18 giờ trước", remaining: "450ml (Còn 15 ly)", limit: "72 giờ", status: "fine", wine: "Vang Trắng" }
];

export default function CrmBds() {
  const [tickets, setTickets] = useState(INITIAL_BAR_TICKETS);
  const [bottles, setBottles] = useState(INITIAL_OPENED_BOTTLES);

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

    if (nextStatus === "completed") {
      alert(`🔔 BDS RUNNER ALERT: Bartender pha chế xong! Gọi phục vụ đến quầy Bar bưng đồ uống lên bàn ngay.`);
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
          BDS · Màn Hình Pha Chế Quầy Bar
        </h1>
        <p className="text-stone-400 text-sm font-light mt-1">
          Quản lý pha chế đồ uống siêu tốc, Runner Alert quầy Bar và Nhật kýOpened Bottles kiểm soát oxi hóa
        </p>
      </div>

      {/* TWO COLUMN BDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE BAR TICKETS (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-2xl space-y-6">
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-4">
              Đơn Đồ Uống Ca Trực Đang Chờ Pha Chế
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((t) => {
                const isDone = t.items.every(i => i.status === "completed");
                return (
                  <div 
                    key={t.id}
                    className={`p-5 bg-black/40 border rounded flex flex-col justify-between h-64 text-left relative overflow-hidden transition-premium ${
                      isDone ? "border-stone-800 opacity-60" : "border-white/10"
                    }`}
                  >
                    
                    {/* Ticket top */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-gold-500 font-bold font-mono">{t.id}</span>
                        <h4 className="text-lg font-light text-stone-100 font-luxury tracking-wide mt-0.5">
                          {t.table}
                        </h4>
                      </div>
                      <span className="text-xs text-stone-500 font-bold font-mono animate-pulse">{t.elapsed}</span>
                    </div>

                    {/* Drink items */}
                    <div className="my-4 flex-1 space-y-3 overflow-y-auto pr-1">
                      {t.items.map((item) => (
                        <div key={item.name} className="flex justify-between items-center text-xs">
                          <div className="flex items-center space-x-2 text-left">
                            <span className="text-gold-400 font-bold font-mono">x{item.qty}</span>
                            <span className={`${item.status === "completed" ? "line-through text-stone-500" : "text-stone-200 font-semibold"}`}>
                              {item.name}
                            </span>
                          </div>

                          <div>
                            {item.status === "pending" ? (
                              <button 
                                onClick={() => handleUpdateItemStatus(t.id, item.name, "completed")}
                                className="bg-gold-500 hover:bg-gold-400 text-dark-500 font-bold px-2 py-0.5 rounded-[3px] text-[10px] uppercase tracking-wider transition-premium"
                              >
                                Pha chế
                              </button>
                            ) : (
                              <span className="text-emerald-400 font-semibold text-[10px] uppercase tracking-wider">
                                ✓ Đã xong
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: OPENED BOTTLES LOG WARNINGS (1/3 width) */}
        <div className="glassmorphism p-6 border border-white/5 rounded shadow-2xl flex flex-col justify-between h-full text-left">
          
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-bold bg-amber-950/20 border border-amber-500/20 px-2.5 py-1 rounded inline-block mb-4">
              Opened Bottles Log
            </span>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-4">
              Giám Sát Hạn Rượu Vang Đã Khui
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed mb-6">
              Sommelier và Bartender bắt buộc phải ưu tiên upselling giới thiệu bán ly các chai rượu vang sắp hết hạn 72 giờ khui để ngăn chặn hoàn toàn rủi ro oxi hóa làm hỏng rượu vang đắt đỏ.
            </p>

            {/* List of bottles */}
            <div className="space-y-4">
              {bottles.map((b) => (
                <div 
                  key={b.id}
                  className={`p-4 rounded border text-xs flex flex-col justify-between gap-2.5 ${
                    b.status === "warning" 
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200" 
                      : "bg-black/30 border-white/5 text-stone-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-stone-200 text-xs">{b.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5 block">{b.wine}</span>
                    </div>
                    {b.status === "warning" && (
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-400 animate-pulse">
                        ⚠️ Sắp hết hạn
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 border-t border-white/5 pt-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Đã khui:</span>
                      <span className="font-medium">{b.openedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Hạn tối đa:</span>
                      <span className="font-medium">{b.limit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Dung tích còn lại:</span>
                      <span className="font-bold text-gold-400 font-luxury text-sm -mt-0.5">{b.remaining}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
