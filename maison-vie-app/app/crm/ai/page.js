"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

const MOCK_EXPIRING_BATCHES = [
  { id: "LOT-204", name: "Trứng cá tầm đen Caviar", qty: "1.8 kg", expires: "32 giờ tới", status: "critical", cost: 42000000 },
  { id: "LOT-199", name: "Nấm Truffle đen Périgord", qty: "0.9 kg", expires: "45 giờ tới", status: "warning", cost: 28500000 },
  { id: "LOT-208", name: "Gan ngỗng áp chảo Pháp (Foie Gras)", qty: "4.2 kg", expires: "50 giờ tới", status: "fine", cost: 18900000 }
];

const MOCK_EVENTS = [
  { id: 1, name: "Đêm Tiệc Vang Pháp Bordeaux 2026", date: "2026-05-30", multiplier: 1.35, bookings: 120 },
  { id: 2, name: "Ngày Lễ Tình Nhân (Valentine's Day)", date: "2026-06-14", multiplier: 1.55, bookings: 240 },
  { id: 3, name: "Tiệc Gala B2B Lữ Hành Vietravel", date: "2026-06-02", multiplier: 1.25, bookings: 180 }
];

const INITIAL_FORECASTS = [
  { ingredient: "Bò Mỹ Thượng Hạng (Black Angus)", needed: "168.5 kg", source: "Recipe Master v3 x Bookings", type: "Thịt đỏ" },
  { ingredient: "Gan ngỗng Pháp (Foie Gras)", needed: "32.0 kg", source: "Recipe Master v3 x Bookings", type: "Gia cầm" },
  { ingredient: "Cá hồi Đại Dương", needed: "64.0 kg", source: "Recipe Master v3 x Bookings", type: "Hải sản" },
  { ingredient: "Măng tây xanh nhập khẩu", needed: "85.0 kg", source: "Recipe Master v3 x Bookings", type: "Rau củ" }
];

export default function CrmAiForecasting() {
  const [role, setRole] = useState("Manager");
  const [batches, setBatches] = useState(MOCK_EXPIRING_BATCHES);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [forecasts, setForecasts] = useState(INITIAL_FORECASTS);
  
  // Special Event Creator State
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventMultiplier, setNewEventMultiplier] = useState(1.20);
  const [newEventBookings, setNewEventBookings] = useState(80);

  // Proposal State
  const [proposalApproved, setProposalApproved] = useState(false);
  const [proposalStatus, setProposalStatus] = useState("draft"); // draft, pending_admin, approved
  const [activeAmuseBoucheAlert, setActiveAmuseBoucheAlert] = useState(false);

  useEffect(() => {
    const activeRole = localStorage.getItem("crm_role") || "Manager";
    setRole(activeRole);

    const handleAuth = () => {
      setRole(localStorage.getItem("crm_role") || "Manager");
    };

    window.addEventListener("crm_auth_change", handleAuth);
    return () => {
      window.removeEventListener("crm_auth_change", handleAuth);
    };
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) {
      alert("Vui lòng nhập tên sự kiện và ngày tổ chức!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: newEventName,
      date: newEventDate,
      multiplier: parseFloat(newEventMultiplier) || 1.15,
      bookings: parseInt(newEventBookings) || 50
    };

    setEvents((prev) => [...prev, newEvent]);
    
    // Dynamically recalculate yields based on new special event multiplier
    setForecasts((prev) => 
      prev.map((f) => {
        const valueNum = parseFloat(f.needed);
        const unit = f.needed.replace(/[0-9.]/g, "").trim();
        const calculated = (valueNum * newEvent.multiplier).toFixed(1);
        return {
          ...f,
          needed: `${calculated} ${unit}`,
          source: `Recipe Master v3 x Multiplier (${newEvent.multiplier}x)`
        };
      })
    );

    setNewEventName("");
    setNewEventDate("");
    alert(`✓ Đã thêm sự kiện "${newEvent.name}". AI đã tự động cập nhật hệ số trọng số ${newEvent.multiplier}x và tái phân rã định lượng nguyên liệu thô!`);
  };

  const handleCreateAmuseBouche = () => {
    setActiveAmuseBoucheAlert(true);
    // Chef PIN Lock notification trigger simulation
    alert("✓ Đã gửi đề xuất của Chef: Hệ thống đã tự động tạo đĩa khai vị 'Chef's Amuse-Bouche' làm từ Caviar và Nấm Périgord để FOH tặng miễn phí cho khách VIP ngày hôm nay nhằm tiêu thụ hết nguyên liệu cận date!");
  };

  const handlePublishOrder = () => {
    if (role !== "Admin") {
      alert("⚠️ CẢNH BÁO BẢO VẬT: Chỉ có tài khoản ADMIN (Chủ đầu tư) mới có đặc quyền ký duyệt phát hành đơn mua hàng thô lên Production!");
      return;
    }

    setProposalStatus("approved");
    setProposalApproved(true);
    alert("✓ KÝ SỐ THÀNH CÔNG: Đơn đề xuất mua hàng thô đã được phê duyệt chính thức và gửi tự động sang hệ thống ERP nhà cung cấp!");
  };

  const handleSendToAdmin = () => {
    setProposalStatus("pending_admin");
    alert("✓ Đã gửi đề xuất phê duyệt đến tài khoản ADMIN. Màn hình của Admin sẽ nhận được thông báo ký số.");
  };

  return (
    <div className="space-y-8 text-left animate-fade-in relative">
      
      {/* Dynamic Amuse Bouche Banner */}
      {activeAmuseBoucheAlert && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded flex items-center justify-between animate-fade-in font-semibold">
          <span>✓ CHIẾN DỊCH KHAI VỊ ACTIVE: Tự động tặng 'Chef's Amuse-Bouche' để triệt tiêu hao hụt nguyên liệu cận date.</span>
          <button onClick={() => setActiveAmuseBoucheAlert(false)} className="text-emerald-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
            AI Forecasting & Trợ Lý Vận Hành F&B
          </h1>
          <p className="text-stone-400 text-sm font-light mt-1">
            Dự báo nguyên liệu thô theo Recipe Master v3, quản lý cận date FIFO và cơ chế phê duyệt kép của Admin
          </p>
        </div>
      </div>

      {/* 4-COLUMN CONTENT INTERACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1 & 2: INVENTORY FORECASTS & EVENT MULTIPLIERS (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: AI Ingredients Yield Forecast */}
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide">
                Dự Báo Nguyên Liệu Sơ Chế Tuần Tới
              </h3>
              <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider bg-black/40 border border-white/5 px-2.5 py-1 rounded">
                Dự báo dựa trên 1,420 khách dự kiến
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-light text-stone-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase tracking-wider text-stone-500 font-semibold text-[10px] pb-3">
                    <th className="pb-3 text-left">Nguyên Liệu Thô</th>
                    <th className="pb-3 text-left">Nhóm Loại</th>
                    <th className="pb-3 text-center">Định Lượng AI Dự Báo</th>
                    <th className="pb-3 text-right">Thuật Toán Trọng Số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {forecasts.map((f, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-premium">
                      <td className="py-4 font-semibold text-stone-200">{f.ingredient}</td>
                      <td className="py-4 text-stone-400">{f.type}</td>
                      <td className="py-4 text-center font-bold text-gold-400 font-mono text-sm">{f.needed}</td>
                      <td className="py-4 text-right text-stone-500 italic font-mono text-[10px]">{f.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recipe Fragmentation Notice */}
            <div className="mt-5 p-4 bg-black/20 border border-white/5 rounded text-[11px] text-stone-500 leading-relaxed">
              <strong>🛡️ Quy tắc bảo vệ tài sản trí tuệ công thức (Recipe IP Protection):</strong> CRM tự động phân mảnh công thức chi tiết. Phụ bếp (Commis Chef) chỉ nhìn thấy định lượng bán thành phẩm Pre-mixes. Chỉ tài khoản Bếp trưởng (Chef) hoặc Admin mới được phép mở khóa xem tỷ lệ thành phần thô chi tiết.
            </div>
          </div>

          {/* Section 2: Special Events Calendar Weighting */}
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl text-left">
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-6">
              Lịch Sự Kiện Đặc Biệt & Hệ Số Trọng Số AI
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Event list */}
              <div className="space-y-3.5">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-2">Các Sự Kiện Sắp Diễn Ra</span>
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 bg-black/30 border border-white/5 rounded flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold text-stone-200">{ev.name}</h4>
                      <span className="text-[10px] text-stone-500 mt-1 block">Ngày: {ev.date} · Đặt trước: {ev.bookings} khách</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-1 rounded">
                        {ev.multiplier}x Trọng số
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add event form */}
              <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Thêm Sự Kiện / Lễ Hội</span>
                
                <div className="flex flex-col">
                  <label className="text-stone-500 mb-1.5 font-semibold">Tên Sự Kiện *</label>
                  <input 
                    type="text" 
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    required
                    placeholder="Ví dụ: Lễ hội Trứng cá tầm Caviar Đêm Đông..."
                    className="bg-black/40 border border-white/10 text-stone-200 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-stone-500 mb-1.5 font-semibold">Ngày Tổ Chức *</label>
                    <input 
                      type="date" 
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      required
                      className="bg-black/40 border border-white/10 text-stone-200 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-stone-500 mb-1.5 font-semibold">Hệ Số Trọng Số AI</label>
                    <select
                      value={newEventMultiplier}
                      onChange={(e) => setNewEventMultiplier(e.target.value)}
                      className="bg-black/40 border border-white/10 text-gold-400 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs font-bold"
                    >
                      <option value="1.15">1.15x (Tăng nhẹ)</option>
                      <option value="1.35">1.35x (Tăng vừa)</option>
                      <option value="1.55">1.55x (Đại tiệc/Lễ lớn)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-3 hover:bg-gold-400 transition-premium"
                >
                  Áp Dụng Sự Kiện & Tính Lại Yield
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* COLUMN 3: FIFO EXPIRY WARNINGS & ADMIN APPROVAL GATE (1/3 width) */}
        <div className="space-y-8 text-left">
          
          {/* Expiry alerts */}
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded">
                Cận Hạn Lô FIFO (BOH Expiry Alerts)
              </span>
            </div>
            
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide">
              Nguyên Liệu Đắt Tiền Cận Date
            </h3>
            
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              AI quét danh sách tồn kho thực tế và phát cảnh báo các lô hàng cao cấp cận date để Chef/Manager triển khai kế hoạch upselling kịp thời.
            </p>

            <div className="space-y-3.5">
              {batches.map((b) => (
                <div 
                  key={b.id}
                  className={`p-4 rounded border text-xs flex flex-col gap-2 ${
                    b.status === "critical" 
                      ? "bg-red-950/20 border-red-500/30 text-red-200" 
                      : b.status === "warning"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : "bg-black/30 border-white/5 text-stone-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-stone-200 text-xs">{b.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 block mt-0.5">Mã lô: {b.id} · Tồn: {b.qty}</span>
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded animate-pulse ${
                      b.status === "critical" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {b.expires}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2">
                    <span className="text-stone-500">Giá trị lô:</span>
                    <span className="font-bold text-stone-300 font-mono">
                      {new Intl.NumberFormat("vi-VN").format(b.cost)} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateAmuseBouche}
              className="w-full text-xs uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 py-3 hover:bg-gold-500/10 transition-premium"
            >
              Gợi Ý Món Khai Vị Chef's Amuse-Bouche
            </button>
          </div>

          {/* AI Suggests - Human Approves Gate */}
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold bg-blue-950/20 border border-blue-500/20 px-2.5 py-1 rounded">
              AI Proposes - Human Approves Gate
            </span>

            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide">
              Ký Duyệt Phát Hành Đơn Mua Hàng Thô
            </h3>

            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Quy tắc bảo mật bất biến: AI chỉ được viết nháp. Chỉ tài khoản **ADMIN (Chủ đầu tư)** mới được phép phê duyệt và phát hành đơn hàng lên hệ thống ERP nhà cung cấp.
            </p>

            <div className="p-4 bg-black/40 border border-white/5 rounded text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Trạng thái đơn:</span>
                <span className={`font-bold uppercase tracking-wider ${
                  proposalStatus === "approved" ? "text-emerald-400" :
                  proposalStatus === "pending_admin" ? "text-amber-500" : "text-stone-400"
                }`}>
                  {proposalStatus === "approved" ? "Đã phê duyệt & Ký số" :
                   proposalStatus === "pending_admin" ? "Đang chờ Admin ký số" : "Draft (Bản nháp)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Người ký duyệt:</span>
                <span className="text-stone-300 font-semibold">{proposalApproved ? "ADMIN (info@maisonvie.vn)" : "Chưa có"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {role === "Admin" ? (
                /* Admin has approve power */
                !proposalApproved ? (
                  <button
                    onClick={handlePublishOrder}
                    className="w-full text-xs uppercase tracking-widest font-bold bg-gold-500 text-dark-500 py-3.5 hover:bg-gold-400 transition-premium shadow-[0_0_15px_rgba(197,165,90,0.15)]"
                  >
                    Ký Số & Phê Duyệt Phát Hành ✍️
                  </button>
                ) : (
                  <div className="text-center p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs rounded font-semibold animate-fade-in">
                    ✓ Đã hoàn tất ký số và đẩy đơn mua hàng lên ERP!
                  </div>
                )
              ) : (
                /* Lower roles can only propose */
                proposalStatus === "draft" && (
                  <button
                    onClick={handleSendToAdmin}
                    className="w-full text-xs uppercase tracking-widest font-semibold border border-white/10 hover:border-gold-500/30 text-stone-300 py-3.5 hover:bg-white/5 transition-premium"
                  >
                    Gửi Đề Xuất Lên Admin Phê Duyệt 📤
                  </button>
                )
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
