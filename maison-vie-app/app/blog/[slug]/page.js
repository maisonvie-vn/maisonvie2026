"use client";

// Prevent static prerendering — content is fetched live from Supabase.
export const dynamic = "force-dynamic";

import React, { useState, useEffect, use, Suspense } from "react";
import Footer from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const I18N = {
  vi: {
    btnBack: "Quay lại thư viện",
    loading: "Đang tải bài viết...",
    empty: "Bài viết không tồn tại hoặc đã bị gỡ bỏ."
  },
  en: {
    btnBack: "Back to Journal",
    loading: "Loading article...",
    empty: "Article does not exist or has been removed."
  },
  fr: {
    btnBack: "Retour au Journal",
    loading: "Chargement de l'article...",
    empty: "L'article n'existe pas ou a été supprimé."
  },
  ja: {
    btnBack: "記事一覧に戻る",
    loading: "記事を読み込み中...",
    empty: "該当する記事が見つかりません。"
  },
  ko: {
    btnBack: "목록으로 돌아가기",
    loading: "기사를 불러오는 중...",
    empty: "기사가 존재하지 않거나 삭제되었습니다."
  }
};

function BlogPostDetailContent({ params }) {
  // Unwrap the params promise using React's use() hook
  const { slug } = use(params);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = I18N[lang] || I18N.vi;

  useEffect(() => {
    async function fetchPostDetail() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error("Error loading article detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPostDetail();
  }, [slug]);

  const getTranslatedValue = (jsonbField, fallback = "") => {
    if (!jsonbField) return fallback;
    return jsonbField[lang] || jsonbField["vi"] || jsonbField["en"] || fallback;
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex items-center cursor-pointer" onClick={() => router.push(`/blog?lang=${lang}`)}>
          <img 
            src="https://www.maisonvie.vn/wp-content/uploads/2020/04/logo2-1-e1588240588705.png" 
            alt="Maison Vie Logo" 
            className="h-14 w-auto object-contain hover:scale-[1.03] transition-premium" 
          />
        </div>

        <div>
          <button 
            onClick={() => router.push(`/blog?lang=${lang}`)}
            className="text-[12px] uppercase tracking-widest font-semibold border border-white/10 text-stone-300 px-4 py-2.5 hover:border-gold-500/30 transition-premium"
          >
            {t.btnBack}
          </button>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="flex-1 py-20">
        <div className="max-w-3xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 text-gold-500 text-sm tracking-widest font-semibold uppercase animate-pulse">
              {t.loading}
            </div>
          ) : !post ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <article className="animate-fade-in text-left">
              
              {/* Meta information */}
              <div className="flex items-center space-x-4 mb-6 text-xs text-stone-500">
                <span className="text-gold-500 uppercase tracking-widest font-bold">
                  {new Date(post.created_at).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span>•</span>
                <span className="uppercase tracking-widest font-medium">Bếp Trưởng Joel</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-100 font-luxury mb-8 leading-tight">
                {getTranslatedValue(post.title)}
              </h1>

              <div className="w-16 h-[2px] bg-gold-500 mb-12" />

              {/* Featured image mockup */}
              {post.featured_image && (
                <div 
                  className="w-full aspect-[16/9] bg-dark-300 gold-border-glow rounded overflow-hidden mb-12 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${post.featured_image})` }}
                />
              )}

              {/* Article content */}
              <div className="text-stone-300 text-base md:text-lg font-light leading-relaxed space-y-6">
                {getTranslatedValue(post.content).split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

            </article>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <Footer lang={lang} />

    </div>
  );
}

export default function BlogPostDetail({ params }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase font-semibold">
        Loading...
      </div>
    }>
      <BlogPostDetailContent params={params} />
    </Suspense>
  );
}
