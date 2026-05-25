"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

const MOCK_BILLABLE_TABLES = [
  { id: "T1-01", name: "Bàn Tầng 1 - 01", guests: 4, items: [{ name: "Bò Wellington Thượng Hạng", qty: 2, price: 1250000 }, { name: "Bánh mì tỏi", qty: 1, price: 80000 }] },
  { id: "T1-03", name: "Bàn Tầng 1 - 03", guests: 2, items: [{ name: "Gan Ngỗng Áp Chảo", qty: 2, price: 650000 }, { name: "Bánh Crème Brûlée", qty: 2, price: 180000 }] },
  { id: "VIP-1", name: "Phòng VIP 1 (Thượng khách)", guests: 8, items: [{ name: "Château Margaux 2015 (Rót ly)", qty: 4, price: 1500000 }, { name: "Bò Wellington Thượng Hạng", qty: 8, price: 1250000 }, { name: "Gan Ngỗng Áp Chảo", qty: 8, price: 650000 }] }
];

export default function CrmPos() {
  const [tables, setTables] = useState(MOCK_BILLABLE_TABLES);
  const [activeTableId, setActiveTableId] = useState("T1-01");
  
  // Billing details
  const [vatRate, setVatRate] = useState(0.10); // 10% standard VAT
  const [serviceChargeRate, setServiceChargeRate] = useState(0.05); // 5% Service charge
  
  // Bill split settings
  const [splitMode, setSplitMode] = useState("single"); // single, equal, item
  const [splitCount, setSplitCount] = useState(2);
  
  // VNPT e-Invoice Sandbox State
  const [needVatInvoice, setNeedVatInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [invoiceResult, setInvoiceResult] = useState(null);

  // Cash / FX Block State
  const [paymentCurrency, setPaymentCurrency] = useState("VND");
  const [fxAlertVisible, setFxAlertVisible] = useState(false);

  // Printer Failover State
  const [printerStatus, setPrinterStatus] = useState("fine"); // fine, failed (Failover)
  const [printAlert, setPrintAlert] = useState("");

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];

  // Calculate bill totals
  const subtotal = activeTable.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const serviceCharge = Math.round(subtotal * serviceChargeRate);
  const vat = Math.round((subtotal + serviceCharge) * vatRate);
  const grandTotal = subtotal + serviceCharge + vat;

  // Split results
  const equalSplitAmount = Math.round(grandTotal / splitCount);

  const handleTogglePrinterStatus = () => {
    if (printerStatus === "fine") {
      setPrinterStatus("failed");
      alert("⚠️ CẢNH BÁO MÁY IN: Đã giả lập máy in nhiệt Lễ Tân bị KẸT GIẤY / NGOẠI TUYẾN. Hệ thống sẽ tự động kích hoạt cụm máy in dự phòng (Printer Failover Cluster) sang Quầy Bar!");
    } else {
      setPrinterStatus("fine");
      alert("✓ Đã khôi phục trạng thái hoạt động bình thường của máy in Lễ Tân chính.");
    }
  };

  const handlePrintBill = () => {
    if (printerStatus === "failed") {
      setPrintAlert(`🖨️ FAILOVER IN BILL THÀNH CÔNG: Máy in chính Lễ Tân lỗi. Lệnh in tạm tính đã tự động định tuyến sang Máy In Nhiệt Quầy Bar. Hóa đơn được in ra kèm nhãn: "*IN DỰ PHÒNG TẠI QUẦY BAR*".`);
    } else {
      setPrintAlert("🖨️ IN BILL THÀNH CÔNG: Hóa đơn tạm tính đã được xuất thành công tại Máy In Nhiệt quầy Lễ Tân chính.");
    }

    setTimeout(() => {
      setPrintAlert("");
    }, 6000);
  };

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    if (value === "USD" || value === "EUR") {
      setFxAlertVisible(true);
      setPaymentCurrency("VND"); // Force lock back to VND
      setTimeout(() => {
        setFxAlertVisible(false);
      }, 7000);
    } else {
      setPaymentCurrency(value);
    }
  };

  const handleIssueVnptInvoice = async () => {
    if (!companyName || !taxCode) {
      alert("Vui lòng điền đầy đủ Tên doanh nghiệp và Mã số thuế!");
      return;
    }

    try {
      // Simulating VNPT Cloud HSM electronic signature and sandbox callback
      const invoiceNo = `MV-${Date.now().toString().slice(-6)}`;
      const signCode = `VNPT-HSM-${Math.floor(Math.random() * 1000000)}`;
      
      setInvoiceResult({
        status: "success",
        invoiceNo: invoiceNo,
        signCode: signCode,
        dateTime: new Date().toLocaleString("vi-VN"),
        msg: "✓ Đã thực hiện Ký Số Cloud HSM và gửi thành công dữ liệu sang Tổng Cục Thuế. Hóa đơn điện tử VNPT e-Invoice đã hợp lệ pháp lý 100%!"
      });
    } catch (err) {
      alert("Lỗi xuất hóa đơn VNPT: " + err.message);
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in relative">
      
      {/* 🚨 STRICT FOREIGN EXCHANGE BLOCK POPUP */}
      {fxAlertVisible && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-55 w-full max-w-lg p-6 bg-red-950/95 border border-red-500 rounded-lg shadow-2xl flex items-start space-x-4 animate-bounce text-red-200">
          <span className="text-3xl">⚠️</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-400">Nghiêm Cấm Thu Ngoại Tệ Mặt!</h4>
            <p className="text-xs font-light mt-1 leading-relaxed">
              Theo **Nghị định 80/2011/NĐ-CP** và Pháp lệnh Quản lý Ngoại hối Việt Nam, nhà hàng cấm hoàn toàn chức năng thu ngoại tệ mặt (USD/EUR) tại quầy. Mọi hóa đơn bắt buộc thanh toán bằng **VND**. Khách nước ngoài dùng thẻ quốc tế sẽ được ngân hàng tự động quy đổi tỷ giá sang VND khi quẹt thẻ POS.
            </p>
          </div>
          <button 
            onClick={() => setFxAlertVisible(false)}
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
            POS & Thanh Toán Hóa Đơn Điện Tử
          </h1>
          <p className="text-stone-400 text-sm font-light mt-1">
            Module tính tiền sảnh, chia hóa đơn đa chiều, kết nối VNPT e-Invoice và dự phòng máy in nhiệt
          </p>
        </div>

        {/* Printer Disaster Toggle */}
        <button
          onClick={handleTogglePrinterStatus}
          className={`text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded border transition-premium ${
            printerStatus === "failed" 
              ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold" 
              : "bg-black/20 border-white/5 text-stone-400 hover:border-amber-500/30"
          }`}
        >
          {printerStatus === "failed" ? "Khôi phục máy in Lễ tân" : "Báo kẹt giấy Máy in Lễ tân 🖨️"}
        </button>
      </div>

      {/* Print Success Alert Banner */}
      {printAlert && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs rounded animate-fade-in font-semibold">
          {printAlert}
        </div>
      )}

      {/* THREE-COLUMN INTERACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: SELECT TABLE & BILL PREVIEW (1/3 width) */}
        <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-6">
              Chọn Bàn Ăn Thanh Toán
            </h3>

            {/* Select Table buttons */}
            <div className="space-y-3">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTableId(t.id);
                    setInvoiceResult(null);
                  }}
                  className={`w-full flex items-center justify-between p-4 border rounded transition-premium text-xs ${
                    activeTableId === t.id 
                      ? "bg-gold-500/10 border-gold-500 text-gold-400 font-bold" 
                      : "bg-black/20 border-white/5 text-stone-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-left">
                    <span className="font-semibold text-stone-200 block">{t.name}</span>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">{t.guests} Khách · {t.items.length} Món</span>
                  </div>
                  <span className="text-stone-400 font-bold font-mono">
                    {new Intl.NumberFormat("vi-VN").format(t.items.reduce((s, i) => s + (i.price * i.qty), 0))} đ
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6">
            <button
              onClick={handlePrintBill}
              className="w-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-3.5 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] transition-premium"
            >
              In Hóa Đơn Tạm Tính (Print Bill)
            </button>
          </div>
        </div>

        {/* COLUMN 2: BILL DETAILS & SPLITTING ENGINE (1/3 width) */}
        <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl flex flex-col justify-between text-left">
          <div>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-6">
              Chi Tiết Thanh Toán & Tách Bill
            </h3>

            {/* Split Mode Selector */}
            <div className="flex border-b border-white/5 pb-3 mb-6 gap-2">
              {["single", "equal"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSplitMode(mode)}
                  className={`text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold transition-premium border rounded ${
                    splitMode === mode 
                      ? "bg-gold-500/10 border-gold-500 text-gold-400" 
                      : "border-white/5 text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {mode === "single" ? "Một Hóa Đơn" : "Chia Đều Đầu Người"}
                </button>
              ))}
            </div>

            {/* Active Table Items details */}
            <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-1">
              {activeTable.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">{item.name} <strong className="text-stone-500 font-mono">x{item.qty}</strong></span>
                  <span className="text-stone-400 font-mono">
                    {new Intl.NumberFormat("vi-VN").format(item.price * item.qty)} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Taxes and Totals Breakdown */}
            <div className="space-y-2 text-xs border-t border-white/5 pt-4">
              <div className="flex justify-between text-stone-500">
                <span>Cộng tiền món ăn (Subtotal):</span>
                <span className="font-mono">{new Intl.NumberFormat("vi-VN").format(subtotal)} đ</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Phí dịch vụ (Service Charge 5%):</span>
                <span className="font-mono">{new Intl.NumberFormat("vi-VN").format(serviceCharge)} đ</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Thuế GTGT (VAT 10%):</span>
                <span className="font-mono">{new Intl.NumberFormat("vi-VN").format(vat)} đ</span>
              </div>
              
              {/* Grand Total */}
              <div className="flex justify-between text-sm font-bold text-gold-500 font-luxury pt-2 border-t border-dashed border-white/10">
                <span>TỔNG THANH TOÁN (VND):</span>
                <span className="text-lg">{new Intl.NumberFormat("vi-VN").format(grandTotal)} đ</span>
              </div>
            </div>

            {/* Equal Split Output */}
            {splitMode === "equal" && (
              <div className="p-4 bg-gold-500/5 border border-gold-500/20 rounded mt-5 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 font-semibold uppercase">Số người chia:</span>
                  <input 
                    type="number" 
                    min="2" 
                    max="20"
                    value={splitCount}
                    onChange={(e) => setSplitCount(parseInt(e.target.value) || 2)}
                    className="w-16 bg-black/40 border border-white/10 text-gold-400 font-bold text-center py-1 px-2 rounded"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-stone-400 font-semibold uppercase">Mỗi phần trả (VND):</span>
                  <span className="text-sm font-bold text-gold-400 font-luxury">
                    {new Intl.NumberFormat("vi-VN").format(equalSplitAmount)} đ
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Strict FX payment selector */}
          <div className="flex items-center justify-between text-xs pt-6 border-t border-white/5 mt-6">
            <span className="text-stone-500 font-semibold uppercase">Đơn vị tiền mặt:</span>
            <select
              value={paymentCurrency}
              onChange={handleCurrencyChange}
              className="bg-black/40 border border-white/10 text-gold-400 px-3 py-1.5 focus:outline-none focus:border-gold-500 font-semibold rounded uppercase tracking-wider"
            >
              <option value="VND">VND (Bắt buộc mặt)</option>
              <option value="USD">USD (Cấm mặt) ⚠️</option>
              <option value="EUR">EUR (Cấm mặt) ⚠️</option>
            </select>
          </div>
        </div>

        {/* COLUMN 3: VNPT E-INVOICE CLOUD HSM INTEGRATION (1/3 width) */}
        <div className="glassmorphism p-6 border border-white/5 rounded shadow-xl flex flex-col justify-between text-left">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold bg-blue-950/20 border border-blue-500/20 px-2.5 py-1 rounded inline-block mb-4">
              VNPT e-Invoice Integration
            </span>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-4">
              Ký Số Hóa Đơn Thuế Cloud HSM
            </h3>
            
            {/* Toggle request invoice */}
            <div className="flex items-center justify-between text-xs mb-6 p-3 bg-black/20 rounded">
              <span className="text-stone-400 font-semibold uppercase">Yêu cầu Hóa đơn đỏ VAT:</span>
              <input 
                type="checkbox"
                checked={needVatInvoice}
                onChange={(e) => {
                  setNeedVatInvoice(e.target.checked);
                  setInvoiceResult(null);
                }}
                className="w-4 h-4 accent-gold-500 cursor-pointer"
              />
            </div>

            {needVatInvoice && !invoiceResult && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="flex flex-col">
                  <label className="text-stone-500 mb-1.5 uppercase tracking-wider font-semibold">Tên Doanh Nghiệp *</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Công ty TNHH Giải Pháp Công Nghệ..."
                    className="bg-black/40 border border-white/10 text-stone-200 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-500 mb-1.5 uppercase tracking-wider font-semibold">Mã Số Thuế *</label>
                  <input 
                    type="text" 
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    required
                    placeholder="0109999999"
                    className="bg-black/40 border border-white/10 text-stone-200 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-500 mb-1.5 uppercase tracking-wider font-semibold">Địa Chỉ Đăng Ký Thuế</label>
                  <input 
                    type="text" 
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Số 10 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội"
                    className="bg-black/40 border border-white/10 text-stone-200 px-3 py-2 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                <button
                  onClick={handleIssueVnptInvoice}
                  className="w-full text-xs uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 py-3.5 hover:bg-gold-500/10 transition-premium rounded"
                >
                  Ký Số & Phát Hành VNPT e-Invoice
                </button>
              </div>
            )}

            {/* Issued Invoice details */}
            {invoiceResult && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs rounded space-y-3.5 animate-fade-in">
                <div className="font-bold uppercase tracking-wider">Hóa Đơn Thuế Đã Phát Hành</div>
                <p className="text-[10px] text-stone-400 leading-relaxed italic">{invoiceResult.msg}</p>
                <div className="space-y-1 text-[10px] font-mono border-t border-white/5 pt-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mã hóa đơn VNPT:</span>
                    <span className="text-stone-200 font-bold">{invoiceResult.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Mã chữ ký số HSM:</span>
                    <span className="text-stone-200 font-bold truncate max-w-xs">{invoiceResult.signCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Thời gian phát hành:</span>
                    <span className="text-stone-200">{invoiceResult.dateTime}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
