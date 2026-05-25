"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function CrmDashboard() {
  const [role, setRole] = useState("Manager");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // VIP Decryption State
  const [isVipDecrypted, setIsVipDecrypted] = useState(false);
  const [decryptedVipName, setDecryptedVipName] = useState("Mr. V - Confidential Room VIP 1");
  const [decryptedVipPhone, setDecryptedVipPhone] = useState("********999");
  
  // Analytics
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeTables: 4,
    allergenAlerts: 0,
    coldChainStatus: "Ổn định (4.2°C)"
  });

  // Load active role from localStorage
  const loadAuthDetails = () => {
    const activeRole = localStorage.getItem("crm_role") || "Manager";
    setRole(activeRole);
  };

  useEffect(() => {
    loadAuthDetails();
    fetchTodayBookings();

    // Listen for custom auth change events from layout
    window.addEventListener("crm_auth_change", loadAuthDetails);
    return () => {
      window.removeEventListener("crm_auth_change", loadAuthDetails);
    };
  }, []);

  const fetchTodayBookings = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("booking_time", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
      
      // Calculate Stats
      const allergenCount = data ? data.filter((r) => r.allergen_warnings && r.allergen_warnings.length > 0).length : 0;
      setStats((prev) => ({
        ...prev,
        totalBookings: data ? data.length : 0,
        allergenAlerts: allergenCount
      }));
    } catch (err) {
      console.error("Error loading today bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      // Refresh list
      fetchTodayBookings();
    } catch (err) {
      alert(`Lỗi cập nhật: ${err.message}`);
    }
  };

  const handleDecryptVip = async () => {
    // Audit Log writing to vip_access_logs
    try {
      const { error } = await supabase
        .from("vip_access_logs")
        .insert({
          actor_id: "00000000-0000-0000-0000-000000000000", // System mock UUID or active auth id
          actor_name: `${role} Coi Thi / Van Hanh`,
          device_info: typeof window !== "undefined" ? window.navigator.userAgent : "Unknown Device",
          ip_address: "127.0.0.1" // Local preview testing
        });

      if (error) throw error;

      setIsVipDecrypted(true);
      setDecryptedVipName("Mr. Vũ Vương Tuấn (Chủ tịch Tập đoàn V-Group)");
      setDecryptedVipPhone("0989 091 383 (VIP Level 3)");
    } catch (err) {
      console.error("Error logging VIP decryption audit log:", err);
      alert("Lỗi bảo mật: Không thể giải mã và lưu vết nhật ký an ninh!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* 🛡️ VIP WATERMARK OVERLAY WHEN DECRYPTED */}
      {isVipDecrypted && (
        <div className="absolute inset-0 z-55 pointer-events-none overflow-hidden select-none grid grid-cols-2 md:grid-cols-4 gap-8 opacity-[0.06] text-gold-500 font-bold uppercase tracking-widest text-[12px] rotate-[-25deg] py-20">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div key={idx} className="whitespace-nowrap">
              {role} / IP: 127.0.0.1 / DECRYPTED-VIP
            </div>
          ))}
        </div>
      )}

      {/* Title Header */}
      <div className="text-left">
        <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
          Bảng Điều Khiển Vận Hành Nhà Hàng
        </h1>
        <p className="text-stone-400 text-sm font-light mt-1">
          Hệ thống Restaurant Operating System theo thời gian thực (Real-time OS)
        </p>
      </div>

      {/* 📊 ANALYTICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {[
          { title: "Đơn Đặt Bàn Hôm Nay", value: stats.totalBookings, sub: "Đang chờ phục vụ", color: "text-gold-500", icon: "📅" },
          { title: "Bàn Ăn Hoạt Động", value: `${stats.activeTables} / 28`, sub: "Ca trực đang ngồi", color: "text-emerald-400", icon: "🍽️" },
          { title: "Cảnh Báo Dị Ứng Hôm Nay", value: stats.allergenAlerts, sub: "Cần Bếp trưởng duyệt", color: "text-amber-500", icon: "⚠️" },
          { title: "Chuỗi Lạnh Tủ Đông", value: stats.coldChainStatus, sub: "Cập nhật IoT 1p trước", color: "text-blue-400", icon: "❄️" }
        ].map((stat, idx) => (
          <div key={idx} className="glassmorphism p-6 border border-white/5 rounded flex items-center justify-between shadow-xl">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">{stat.title}</span>
              <span className={`text-2xl font-bold font-luxury ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-stone-500 block mt-1">{stat.sub}</span>
            </div>
            <span className="text-3xl opacity-80">{stat.icon}</span>
          </div>
        ))}

      </div>

      {/* MAIN TWO-COLUMN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER: TODAY BOOKINGS LIST */}
        <div className="lg:col-span-2 glassmorphism border border-white/5 p-6 rounded shadow-2xl flex flex-col text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide">
              Lịch Đặt Bàn Ca Trực Đang Hoạt Động
            </h3>
            <button 
              onClick={fetchTodayBookings}
              className="text-xs uppercase tracking-widest text-gold-500 hover:text-gold-400 font-bold"
            >
              Làm mới ↻
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-stone-500 text-sm tracking-wider uppercase">
              Đang tải danh sách đặt bàn...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              Hôm nay chưa có lượt đặt bàn nào trên hệ thống.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light text-stone-300">
                <thead>
                  <tr className="border-b border-white/5 uppercase tracking-wider text-stone-500 font-semibold text-[10px]">
                    <th className="pb-3">Thời gian</th>
                    <th className="pb-3">Thực khách</th>
                    <th className="pb-3">Cỡ bàn</th>
                    <th className="pb-3 text-center">Trạng thái</th>
                    <th className="pb-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-premium">
                      <td className="py-4.5 font-bold font-luxury text-sm text-gold-400">{b.booking_time.slice(0, 5)}</td>
                      <td className="py-4.5">
                        <div className="font-semibold text-stone-200">{b.guest_name}</div>
                        <div className="text-[10px] text-stone-500">{b.guest_phone}</div>
                      </td>
                      <td className="py-4.5 text-stone-200 font-semibold">{b.guest_count} Khách</td>
                      <td className="py-4.5 text-center">
                        <span className={`px-2 py-0.5 rounded-[3px] text-[10px] uppercase font-bold tracking-wider ${
                          b.status === "confirmed" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" :
                          b.status === "cancelled" ? "bg-red-950/40 text-red-400 border border-red-500/20" :
                          "bg-amber-950/40 text-amber-400 border border-amber-500/20"
                        }`}>
                          {b.status === "confirmed" ? "Đã xác nhận" : 
                           b.status === "cancelled" ? "Đã hủy" : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="py-4.5 text-right space-x-2">
                        {b.status === "pending" && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, "confirmed")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-stone-900 px-3 py-1 font-bold rounded text-[10px] uppercase tracking-wider transition-premium"
                            >
                              Duyệt
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, "cancelled")}
                              className="border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-1 font-bold rounded text-[10px] uppercase tracking-wider transition-premium"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button 
                            onClick={() => handleUpdateStatus(b.id, "cancelled")}
                            className="text-stone-500 hover:text-red-400 px-2 py-1 transition-premium"
                          >
                            Hủy bàn
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* RIGHT: VIP PRIVACY & SECURITY CONTROLS */}
        <div className="glassmorphism border border-white/5 p-6 rounded shadow-2xl flex flex-col text-left justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded inline-block mb-4">
              Bảo Mật Quyền Riêng Tư (VIP Privacy)
            </span>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-4">
              Giao Thức Giải Mã Thông Tin Khách VIP
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed mb-6">
              Theo quy chế bảo mật **Nghị định 13/2023/NĐ-CP**, toàn bộ thông tin liên lạc và chi tiết đặt chỗ của **Khách VIP Level 3** (Thượng khách tuyệt mật) bị ẩn danh mặc định trên CRM và KDS sảnh bếp.
            </p>

            {/* VIP Confidential Panel */}
            <div className="p-5 bg-black/40 border border-gold-500/20 rounded space-y-4 mb-6 relative overflow-hidden">
              <div className="flex items-center space-x-3 text-gold-500 font-bold text-xs uppercase tracking-widest">
                <span>🔒 VIP LEVEL 3 SECURE CORE</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Mã bàn ăn:</span>
                  <span className="text-stone-300 font-semibold">Bàn VIP 1 (Trực diện cửa sổ)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Danh tính VIP:</span>
                  <span className={`font-semibold tracking-wider transition-premium ${isVipDecrypted ? "text-emerald-400" : "text-amber-500 italic"}`}>
                    {decryptedVipName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Số điện thoại:</span>
                  <span className="text-stone-300 font-mono">{decryptedVipPhone}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Decrypt Actions */}
            {!isVipDecrypted ? (
              <button
                onClick={handleDecryptVip}
                className="w-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-3.5 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] transition-premium"
              >
                Giải Mã Thông Tin VIP (Lưu Vết Log)
              </button>
            ) : (
              <div className="text-center p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs rounded font-semibold animate-fade-in">
                ✓ Đã ghi nhận vết truy cập VIP vào bảng `vip_access_logs`! Watermark răn đe chống rò rỉ đang hoạt động trên RAM.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
