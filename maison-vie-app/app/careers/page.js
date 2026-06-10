"use client";

import React, { useState, useEffect, Suspense } from "react";
import Footer from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const I18N = {
  vi: {
    careersTitle: "Cơ Hội Nghề Nghiệp Fine Dining",
    careersSubtitle: "Đồng hành cùng Maison Vie kiến tạo chuẩn mực phục vụ thượng lưu",
    btnApply: "Nộp Hồ Sơ Ngay",
    btnBack: "Quay lại trang chủ",
    labelName: "Họ và Tên",
    labelPhone: "Số Điện Thoại",
    labelEmail: "Địa Chỉ Email",
    labelPosition: "Vị Trí Ứng Tuyển",
    labelCv: "Tải lên CV (Hỗ trợ PDF/DOCX dưới 5MB)",
    btnSubmit: "Gửi Hồ Sơ Ứng Tuyển",
    submitting: "Đang tải hồ sơ...",
    successTitle: "Hồ Sơ Đã Nhận Thành Công",
    successMsg: "Cảm ơn bạn đã nộp hồ sơ vào Maison Vie. Bộ phận Nhân sự sẽ kiểm tra CV của bạn và liên hệ sắp xếp buổi phỏng vấn trực tiếp trong vòng 3-5 ngày làm việc.",
    errTitle: "Đã Có Lỗi Xảy Ra",
    errMsg: "Không thể nộp hồ sơ. Vui lòng kiểm tra lại kích thước/định dạng tệp (<5MB, PDF/DOCX) hoặc liên hệ hotline nhân sự: 0989 091 383.",
    loading: "Đang tải các vị trí tuyển dụng...",
    empty: "Hiện tại chúng tôi đang tuyển đủ nhân sự. Hãy quay lại sau nhé!"
  },
  en: {
    careersTitle: "Fine Dining Careers",
    careersSubtitle: "Join Maison Vie in crafting the highest standards of culinary service",
    btnApply: "Apply Now",
    btnBack: "Back to Home",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelPosition: "Position of Interest",
    labelCv: "Upload CV (Supports PDF/DOCX under 5MB)",
    btnSubmit: "Submit Application",
    submitting: "Submitting...",
    successTitle: "Application Received Successfully",
    successMsg: "Thank you for applying to Maison Vie. Our HR department will review your CV and contact you within 3-5 business days.",
    errTitle: "An Error Occurred",
    errMsg: "Failed to apply. Please verify file size/format (<5MB, PDF/DOCX) or contact our recruitment team: 0989 091 383.",
    loading: "Loading vacant positions...",
    empty: "All positions are currently filled. Please check back later!"
  },
  fr: {
    careersTitle: "Recrutement Haute Gastronomie",
    careersSubtitle: "Rejoignez la Maison Vie pour créer les standards suprêmes du service gastronomique",
    btnApply: "Postuler",
    btnBack: "Retour à l'accueil",
    labelName: "Nom Complet",
    labelPhone: "Numéro de Téléphone",
    labelEmail: "Adresse E-mail",
    labelPosition: "Poste Convoité",
    labelCv: "Déposer le CV (PDF/DOCX inférieur à 5Mo)",
    btnSubmit: "Envoyer ma Candidature",
    submitting: "Envoi en cours...",
    successTitle: "Candidature reçue avec succès",
    successMsg: "Merci pour votre intérêt. Notre service RH étudiera votre dossier et prendra contact sous 3 à 5 jours ouvrés.",
    errTitle: "Une erreur est survenue",
    errMsg: "Impossible de postuler. Vérifiez la taille/format du fichier (<5Mo, PDF/DOCX) hoặc appelez au 0989 091 383.",
    loading: "Chargement các vị trí...",
    empty: "Aucun poste vacant pour le moment. Veuillez repasser plus tard !"
  },
  ja: {
    careersTitle: "採用情報（キャリア）",
    careersSubtitle: "メゾン・ヴィでハイクラスな美食サービスのプロフェッショナルを目指しませんか",
    btnApply: "応募する",
    btnBack: "ホームに戻る",
    labelName: "お名前",
    labelPhone: "電話番号",
    labelEmail: "メールアドレス",
    labelPosition: "希望職種",
    labelCv: "履歴書・CVアップロード (5MB以下のPDFまたはDOCX形式)",
    btnSubmit: "応募書類を送信する",
    submitting: "送信中...",
    successTitle: "応募が完了いたしました",
    successMsg: "メゾン・ヴィの採用情報にご応募いただき誠にありがとうございます。書類選考の上、3〜5営業日以内に採用担当者よりご連絡いたします。",
    errTitle: "エラーが発生しました",
    errMsg: "応募できませんでした。ファイルサイズ（5MB以下）や形式（PDF/DOCX）をご確認いただくか、採用担当まで直接ご連絡ください。",
    loading: "求人情報を読み込み中...",
    empty: "現在、募集中の職種はございません。またのご確認をお願いいたします。"
  },
  ko: {
    careersTitle: "메종 비 인재 채용",
    careersSubtitle: "메종 비와 함께 미쉐린 다이닝 서비스의 표준을 세워갈 인재를 모십니다",
    btnApply: "지원하기",
    btnBack: "홈으로 돌아가기",
    labelName: "성함",
    labelPhone: "전화번호",
    labelEmail: "이메일 주소",
    labelPosition: "지원 직무",
    labelCv: "이력서/CV 제출 (5MB 이하 PDF/DOCX 지원)",
    btnSubmit: "지원 서류 제출",
    submitting: "제출 중...",
    successTitle: "지원 서류가 접수되었습니다",
    successMsg: "메종 비 채용에 지원해 주셔서 감사합니다. 인사과에서 검토 후 3~5일 내에 연락하여 면접 일정을 정해 드리겠습니다.",
    errTitle: "오류가 발생했습니다",
    errMsg: "제출에 실패했습니다. 파일 크기(5MB 이하) 및 형식(PDF/DOCX)을 확인하거나 채용 담당자에게 문의하십시오.",
    loading: "모집 부문을 불러오는 중...",
    empty: "현재 모집 중인 직무가 없습니다. 다음에 다시 확인해 주시기 바랍니다."
  }
};

function CareersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    jobId: "",
    file: null
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const t = I18N[lang] || I18N.vi;

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;
        setJobs(data || []);
        if (data && data.length > 0) {
          setFormData((prev) => ({ ...prev, jobId: data[0].id }));
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Strict validation
    const allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;
    if (!allowedExtensions.exec(selectedFile.name)) {
      alert("Chỉ chấp nhận tệp định dạng PDF hoặc DOCX!");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Tệp quá lớn! Vui lòng chọn tệp nhỏ hơn 5MB.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, file: selectedFile }));
  };

  const getTranslatedValue = (jsonbField, fallback = "") => {
    if (!jsonbField) return fallback;
    return jsonbField[lang] || jsonbField["vi"] || jsonbField["en"] || fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Vui lòng tải lên tệp CV!");
      return;
    }

    setStatus("loading");

    try {
      // 1. Create storage bucket dynamically in case it doesn't exist (fails silently or continues)
      try {
        await supabase.storage.createBucket("cv-uploads", { public: false });
      } catch (err) {
        // Ignored if bucket already exists
      }

      // 2. Upload file to private Supabase Storage Bucket
      const fileExt = formData.file.name.split(".").pop();
      const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `cvs/${uniqueFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cv-uploads")
        .upload(filePath, formData.file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Save application details to job_applications table
      const { error: appError } = await supabase
        .from("job_applications")
        .insert({
          job_id: formData.jobId,
          applicant_name: formData.name,
          applicant_phone: formData.phone,
          applicant_email: formData.email,
          cv_file_url: filePath, // Private reference
          status: "applied"
        });

      if (appError) throw appError;

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        jobId: jobs.length > 0 ? jobs[0].id : "",
        file: null
      });
    } catch (err) {
      console.error("Careers submission error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex items-center cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
          <img 
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png" 
            alt="Maison Vie Logo" 
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium" 
          />
        </div>

        <div>
          <button 
            onClick={() => router.push(`/?lang=${lang}`)}
            className="text-[12px] uppercase tracking-widest font-semibold border border-white/10 text-stone-300 px-4 py-2.5 hover:border-gold-500/30 transition-premium"
          >
            {t.btnBack}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-20 text-center bg-gradient-to-b from-dark-400 to-dark-500 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Recrutement Fine Dining</span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gold-500 gold-text-gradient font-luxury mb-6">
            {t.careersTitle}
          </h1>
          <p className="text-stone-300 font-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.careersSubtitle}
          </p>
        </div>
      </section>

      {/* JOBS LIST */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 text-gold-500 text-sm tracking-widest font-semibold uppercase animate-pulse">
              {t.loading}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="glassmorphism p-8 border border-white/5 hover:border-gold-500/20 transition-premium shadow-2xl rounded text-left relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <h3 className="text-2xl font-light text-stone-100 font-luxury tracking-wide">
                      {getTranslatedValue(job.title)}
                    </h3>
                    <span className="text-xs tracking-widest uppercase bg-gold-500/20 text-gold-400 border border-gold-500/30 px-3 py-1 font-bold rounded">
                      {job.salary_range || "Thỏa thuận"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-light text-stone-300 leading-relaxed">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-500 font-bold block mb-2">Mô tả công việc</span>
                      <p>{getTranslatedValue(job.description)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-500 font-bold block mb-2">Yêu cầu ứng viên</span>
                      <p>{getTranslatedValue(job.requirements)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECURE APPLICATION FORM */}
      {jobs.length > 0 && (
        <section id="apply-form" className="py-20 bg-dark-400 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            
            <div className="glassmorphism p-8 md:p-12 border border-gold-500/10 shadow-2xl relative rounded">
              
              {status === "success" ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-16 h-16 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    ✓
                  </div>
                  <h3 className="text-2xl font-light text-gold-500 font-luxury mb-4">{t.successTitle}</h3>
                  <p className="text-stone-300 leading-relaxed max-w-md mx-auto">{t.successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {status === "error" && (
                    <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 text-sm rounded text-center animate-fade-in">
                      <strong>{t.errTitle}:</strong> {t.errMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelName} *</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelPhone} *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelEmail} *</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelPosition} *</label>
                      <select 
                        name="jobId"
                        value={formData.jobId}
                        onChange={handleInputChange}
                        className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm"
                      >
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id} className="bg-dark-400 text-stone-200">
                            {getTranslatedValue(job.title)}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* CV Upload */}
                  <div className="flex flex-col text-left">
                    <label className="text-[11px] uppercase tracking-widest text-stone-400 mb-2 font-semibold">{t.labelCv} *</label>
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc"
                      required
                      onChange={handleFileChange}
                      className="bg-black/40 border border-white/10 text-stone-200 px-4 py-3 focus:outline-none focus:border-gold-500 transition-premium text-sm file:mr-4 file:py-1 file:px-3 file:border file:border-gold-500/30 file:text-gold-400 file:bg-transparent file:text-xs file:font-semibold hover:file:bg-gold-500/10 cursor-pointer"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full text-[13px] uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-4 hover:bg-gold-400 shadow-[0_0_15px_rgba(197,165,90,0.15)] disabled:opacity-50 transition-premium"
                  >
                    {status === "loading" ? t.submitting : t.btnSubmit}
                  </button>

                </form>
              )}

            </div>

          </div>
        </section>
      )}

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function Careers() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <CareersContent />
    </Suspense>
  );
}
