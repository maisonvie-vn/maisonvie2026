"use client";

import React, { useState, useEffect } from "react";

// Mock Question Pool for Dynamic Shuffling (FOH SOP 03 Quiz)
const MOCK_QUESTIONS = [
  {
    id: 1,
    q: "Nhóm dị ứng nào sau đây thuộc danh mục 14 nhóm chất bắt buộc khai báo theo tiêu chuẩn EU?",
    options: [
      "A. Bơ thực vật, dầu cọ, mật ong",
      "B. Cần tây (Celery), Gluten, Trứng, Giáp xác (Crustaceans)",
      "C. Thịt bò Black Angus, khoai tây, nấm cục đen Truffle",
      "D. Tỏi ta, ớt hiểm, hành lá bản địa"
    ],
    answer: 1 // Option B
  },
  {
    id: 2,
    q: "Thời gian sử dụng bàn ăn mặc định được khóa tự động trên Sơ đồ 2D FOH để tránh Overbooking là bao lâu?",
    options: [
      "A. 60 phút (1 giờ)",
      "B. 90 phút (1.5 giờ)",
      "C. 120 phút (2 giờ liên tục từ khi khách order)",
      "D. Không giới hạn thời gian"
    ],
    answer: 2 // Option C
  },
  {
    id: 3,
    q: "Khi phát hiện một bàn VIP gọi món chính chứa Gluten nhưng trong hồ sơ khách hàng có nhãn cảnh báo dị ứng Gluten, hành động nào đúng quy chuẩn SOP?",
    options: [
      "A. Cho ra món bình thường và bảo khách tự chú ý khi ăn",
      "B. Hệ thống KDS tự động Khóa Món (Strobe Alert), FOH lập tức kiểm tra lại bếp trưởng và khách hàng để điều chỉnh Set Menu phút chót",
      "C. Tự ý thay đổi bột mì thành bột gạo trong bếp không cần báo bếp trưởng",
      "D. Đợi khách ăn xong mới hỏi thăm tình hình sức khỏe"
    ],
    answer: 1 // Option B
  },
  {
    id: 4,
    q: "Quy định đối với việc thu nhận ngoại tệ mặt (USD, EUR, JPY) tại quầy thu ngân POS Maison Vie là gì?",
    options: [
      "A. Thu trực tiếp và thối lại bằng VND theo tỷ giá tự do",
      "B. Nghiêm cấm thu ngoại tệ mặt trực tiếp theo Pháp lệnh ngoại hối. Chỉ xuất bill VND và quy đổi tự động qua thẻ thanh toán quốc tế Visa/Mastercard",
      "C. Thu ngoại tệ mặt nhưng tính thêm 5% phí chuyển đổi",
      "D. Chỉ nhận ngoại tệ mặt vào giờ cao điểm ca tối"
    ],
    answer: 1 // Option B
  }
];

export default function CrmTraining() {
  const [role, setRole] = useState("Runner");
  
  // LMS State
  const [activeTab, setActiveTab] = useState("Runner");
  const [secureToken, setSecureToken] = useState("");
  
  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadAuthDetails = () => {
    const activeRole = localStorage.getItem("crm_role") || "Runner";
    setRole(activeRole);
  };

  useEffect(() => {
    loadAuthDetails();
    generateSecureToken();

    window.addEventListener("crm_auth_change", loadAuthDetails);
    return () => {
      window.removeEventListener("crm_auth_change", loadAuthDetails);
    };
  }, []);

  const generateSecureToken = () => {
    // Simulates Cloudflare Stream Signed URL token generation (valid for 10 minutes)
    const timestamp = Math.floor(Date.now() / 1000) + 600;
    const token = `exp=${timestamp}~hmac=6b8e39268f7f52077e68c9f0c29f64bf50106260`;
    setSecureToken(token);
  };

  const startQuiz = () => {
    // Dynamic question shuffling to prevent cheating
    const shuffled = [...MOCK_QUESTIONS]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizStarted(true);
  };

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    shuffledQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / shuffledQuestions.length) * 100);
    setScore(finalScore);
    setQuizSubmitted(true);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-light text-stone-100 font-luxury tracking-wide">
          Học Viện Đào Tạo & Thăng Tiến Nhân Sự
        </h1>
        <p className="text-stone-400 text-sm font-light mt-1">
          Hệ thống đào tạo SOP Haute Gastronomie Française và Khảo thí chống gian lận
        </p>
      </div>

      {/* 📺 LMS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Video and Material */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glassmorphism p-6 border border-white/5 rounded shadow-2xl space-y-6">
            
            {/* Category tabs */}
            <div className="flex border-b border-white/5 pb-3 gap-2">
              {["Runner", "Waitstaff", "Sommelier"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs uppercase tracking-widest px-4 py-2.5 font-semibold transition-premium border-b-2 ${
                    activeTab === tab 
                      ? "border-gold-500 text-gold-400 font-bold" 
                      : "border-transparent text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {tab === "Runner" ? "Runner (Bậc 1)" : 
                   tab === "Waitstaff" ? "Waitstaff (Bậc 2)" : "Sommelier (Bậc 5)"}
                </button>
              ))}
            </div>

            {/* Cloudflare Stream Secure Mockup Player */}
            <div className="relative w-full aspect-[16/9] bg-black border border-white/5 rounded overflow-hidden flex flex-col items-center justify-center p-8 text-center">
              {/* Security Banner */}
              <div className="absolute top-4 left-4 bg-red-950/40 border border-red-500/20 text-red-400 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 z-10 rounded">
                🔒 CLOUDFLARE STREAM SIGNED URL ACTIVE
              </div>

              {/* Secure Token Overlay */}
              <div className="absolute bottom-4 left-4 text-[8px] text-stone-600 font-mono z-10 select-none">
                TOKEN: {secureToken} | DOMAIN-LOCKED: *.maisonvie.vn
              </div>

              {/* Mock video content */}
              <div className="z-10 flex flex-col items-center">
                <span className="text-4xl mb-4">🎥</span>
                <h4 className="text-lg font-light text-stone-200 font-luxury tracking-wide">
                  {activeTab === "Runner" ? "SOP 01: Quy trình KDS và Gọi runners sảnh tiệc" :
                   activeTab === "Waitstaff" ? "SOP 05: Chào đón Thượng khách & Lễ tân Haute Gastronomie" :
                   "SOP 09: Decanting rượu vang cổ & Sử dụng Coravin khí Argon"}
                </h4>
                <p className="text-stone-500 text-xs mt-1 max-w-sm font-light">
                  Chỉ cho phép phát trên thiết bị sảnh nội bộ. Nghiêm cấm mọi hành vi quay màn hình hoặc chia sẻ đường dẫn.
                </p>
                <button className="mt-6 text-xs uppercase tracking-widest font-bold bg-gold-500 text-dark-500 px-6 py-2.5 hover:bg-gold-400 transition-premium">
                  Phát bài giảng (Play)
                </button>
              </div>
            </div>

            {/* SOP Static PDF Materials */}
            <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded">
              <div className="flex items-center space-x-3 text-left">
                <span className="text-2xl">📄</span>
                <div>
                  <h5 className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Tài liệu SOP Bản in Tĩnh (.PDF)
                  </h5>
                  <p className="text-[10px] text-stone-500 font-light mt-0.5">
                    Được tăng tốc độ tải qua CDN Vercel cục bộ dưới 0.3s
                  </p>
                </div>
              </div>
              <button className="text-[10px] uppercase tracking-widest text-gold-500 font-bold border border-gold-500/20 px-3 py-1.5 hover:bg-gold-500/10 transition-premium">
                Tải xuống tài liệu
              </button>
            </div>

          </div>
        </div>

        {/* 📝 RIGHT COLUMN: ANTI-CHEATING QUIZ */}
        <div className="glassmorphism p-6 border border-white/5 rounded shadow-2xl flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-500 font-bold bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 rounded inline-block mb-4">
              Khảo Thí Thăng Tiến Nhân Sự
            </span>
            <h3 className="text-xl font-light text-stone-100 font-luxury tracking-wide mb-4">
              Bài Thi Trắc Nghiệm SOP 03
            </h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed mb-6">
              Ngân hàng câu hỏi động xáo trộn ngẫu nhiên câu hỏi và đáp án từ hệ thống CSDL để phòng ngừa gian lận. Yêu cầu đạt **tối thiểu 80% điểm** để đủ điều kiện xét nâng bậc lương.
            </p>

            {/* Interactive Quiz Area */}
            {quizStarted ? (
              <div className="p-4 bg-black/40 border border-white/5 rounded space-y-4 text-left">
                
                {/* Progress */}
                <div className="flex justify-between items-center text-[10px] text-stone-500">
                  <span>Câu hỏi {currentQuestionIndex + 1} / {shuffledQuestions.length}</span>
                  <span className="text-gold-400 font-bold font-mono">PROCTORED SECURE</span>
                </div>

                {quizSubmitted ? (
                  /* Result Screen */
                  <div className="text-center py-6 space-y-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto ${
                      score >= 80 ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30" : "bg-red-950/40 text-red-400 border border-red-500/30"
                    }`}>
                      {score >= 80 ? "✓" : "✗"}
                    </div>
                    <div>
                      <span className="text-stone-400 text-xs uppercase block">Điểm số đạt được:</span>
                      <span className={`text-3xl font-bold font-luxury ${score >= 80 ? "text-emerald-400" : "text-red-400"}`}>{score}%</span>
                    </div>
                    <p className="text-stone-400 text-xs font-light px-4">
                      {score >= 80 
                        ? "Chúc mừng! Bạn đã vượt qua bài trắc nghiệm SOP 03. Kết quả đã được tự động lưu vết và nâng bậc chứng chỉ của bạn." 
                        : "Tiếc quá! Bạn chưa đạt đủ điểm chuẩn 80%. Hãy học lại tài liệu SOP và thử sức lại."}
                    </p>
                    <button 
                      onClick={() => setQuizStarted(false)}
                      className="text-xs uppercase tracking-widest font-semibold border border-gold-500/30 text-gold-300 px-6 py-2 hover:bg-gold-500/10 transition-premium"
                    >
                      Kết thúc thi
                    </button>
                  </div>
                ) : (
                  /* Active Quiz Questions */
                  <div className="space-y-4">
                    <p className="text-stone-200 text-xs font-semibold leading-relaxed">
                      {shuffledQuestions[currentQuestionIndex].q}
                    </p>

                    <div className="space-y-2">
                      {shuffledQuestions[currentQuestionIndex].options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(optIdx)}
                          className={`w-full text-left p-3 text-xs border rounded transition-premium ${
                            selectedAnswers[currentQuestionIndex] === optIdx
                              ? "bg-gold-500/10 border-gold-500 text-gold-400 font-semibold"
                              : "bg-black/20 border-white/5 text-stone-400 hover:border-white/20"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Navigation Buttons inside quiz */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="text-xs text-stone-500 hover:text-stone-300 disabled:opacity-30 transition-premium"
                      >
                        Trước
                      </button>
                      {currentQuestionIndex === shuffledQuestions.length - 1 ? (
                        <button
                          onClick={submitQuiz}
                          disabled={selectedAnswers[currentQuestionIndex] === undefined}
                          className="bg-gold-500 text-dark-500 font-bold px-4 py-2 text-xs uppercase tracking-wider hover:bg-gold-400 rounded transition-premium"
                        >
                          Nộp Bài
                        </button>
                      ) : (
                        <button
                          onClick={nextQuestion}
                          disabled={selectedAnswers[currentQuestionIndex] === undefined}
                          className="text-xs text-gold-500 hover:text-gold-400 disabled:opacity-30 transition-premium"
                        >
                          Kế Tiếp
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* Idle Quiz Start Screen */
              <div className="p-8 bg-black/40 border border-white/5 rounded text-center space-y-6">
                <span className="text-4xl block">📝</span>
                <div>
                  <h4 className="text-stone-200 text-sm font-semibold uppercase tracking-wider">
                    SOP 03: Sơ Đồ Bàn 2D & 14 Dị Ứng
                  </h4>
                  <p className="text-[10px] text-stone-500 font-light mt-1">
                    Thời gian làm bài: Không giới hạn · 4 Câu hỏi xáo trộn
                  </p>
                </div>
                <button
                  onClick={startQuiz}
                  className="w-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-dark-500 py-3 hover:bg-gold-400 transition-premium rounded"
                >
                  Bắt Đầu Làm Bài Thi
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
