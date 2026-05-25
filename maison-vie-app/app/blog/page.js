"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const I18N = {
  vi: {
    blogTitle: "Thư Viện Kiến Thức Ẩm Thực",
    blogSubtitle: "Khám phá câu chuyện rượu vang, ẩm thực Pháp và triết lý Michelin",
    btnRead: "Đọc bài viết",
    btnBack: "Quay lại trang chủ",
    loading: "Đang tải bài viết...",
    empty: "Hiện chưa có bài viết nào được đăng tải."
  },
  en: {
    blogTitle: "Culinary Journal",
    blogSubtitle: "Explore the stories behind fine wines, French cuisine, and Michelin philosophies",
    btnRead: "Read Article",
    btnBack: "Back to Home",
    loading: "Loading articles...",
    empty: "No articles published yet."
  },
  fr: {
    blogTitle: "Le Journal Gastronomique",
    blogSubtitle: "Découvrez l'histoire des grands vins, de la cuisine française et de la philosophie Michelin",
    btnRead: "Lire l'Article",
    btnBack: "Retour à l'accueil",
    loading: "Chargement des articles...",
    empty: "Aucun article publié pour le moment."
  },
  ja: {
    blogTitle: "美食ジャーナル",
    blogSubtitle: "ワインの知識、フランス料理の歴史、ミシュランの哲学を探求する",
    btnRead: "記事を読む",
    btnBack: "ホームに戻る",
    loading: "記事を読み込み中...",
    empty: "現在、公開されている記事はございません。"
  },
  ko: {
    blogTitle: "미식 저널",
    blogSubtitle: "고급 와인, 프랑스 요리, 미쉐린 요리 철학에 담긴 이야기 탐구",
    btnRead: "기사 읽기",
    btnBack: "홈으로 돌아가기",
    loading: "기사를 불러오는 중...",
    empty: "아직 게시된 기사가 없습니다."
  }
};

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "vi";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = I18N[lang] || I18N.vi;

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const getTranslatedValue = (jsonbField, fallback = "") => {
    if (!jsonbField) return fallback;
    return jsonbField[lang] || jsonbField["vi"] || jsonbField["en"] || fallback;
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-500 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-white/5 h-24 flex items-center justify-between px-6">
        <div className="flex flex-col cursor-pointer" onClick={() => router.push(`/?lang=${lang}`)}>
          <span className="text-xl font-semibold tracking-wider text-gold-500 font-luxury uppercase">Maison Vie</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-sans -mt-1">Haute Cuisine</span>
        </div>

        <div className="flex items-space-x-4">
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
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-semibold mb-4 block">Journal de la Cuisine</span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gold-500 gold-text-gradient font-luxury mb-6">
            {t.blogTitle}
          </h1>
          <p className="text-stone-300 font-light text-lg max-w-xl mx-auto leading-relaxed">
            {t.blogSubtitle}
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-20 flex-1">
        <div className="max-w-6xl mx-auto px-6">
          
          {loading ? (
            <div className="text-center py-20 text-gold-500 text-sm tracking-widest font-semibold uppercase animate-pulse">
              {t.loading}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-sm italic">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="glassmorphism border border-white/5 hover:border-gold-500/20 transition-premium shadow-2xl flex flex-col h-full rounded overflow-hidden gold-border-glow"
                >
                  
                  {/* Featured Image Mockup / Visual */}
                  <div className="relative w-full aspect-[16/9] bg-dark-300 flex items-center justify-center border-b border-white/5 overflow-hidden">
                    {post.featured_image ? (
                      <div className="absolute inset-0 bg-dark-200 flex flex-col items-center justify-center p-8 text-center bg-cover bg-center" style={{ backgroundImage: `url(${post.featured_image})` }}>
                        <div className="absolute inset-0 bg-black/60 z-0" />
                        <span className="relative z-10 text-gold-400 font-luxury text-3xl italic">Maison Vie Journal</span>
                      </div>
                    ) : (
                      <span className="text-gold-500 font-luxury text-4xl italic">Maison Vie</span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-8 flex flex-col flex-1 text-left">
                    <span className="text-[9px] uppercase tracking-widest text-gold-500 font-bold mb-3">
                      {new Date(post.created_at).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    
                    <h3 className="text-2xl font-light text-stone-100 font-luxury tracking-wide mb-4 line-clamp-2 hover:text-gold-400 transition-premium">
                      {getTranslatedValue(post.title)}
                    </h3>
                    
                    <p className="text-stone-400 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                      {getTranslatedValue(post.content)}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <button 
                        onClick={() => router.push(`/blog/${post.slug}?lang=${lang}`)}
                        className="text-[11px] uppercase tracking-widest font-bold text-gold-400 hover:text-gold-300 flex items-center gap-2 group transition-premium"
                      >
                        {t.btnRead} <span className="group-hover:translate-x-1 transition-premium">➔</span>
                      </button>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-8 text-center text-xs text-stone-600 border-t border-white/5">
        <p>© 2026 Maison Vie. All rights reserved. Michelin Culinary Standard.</p>
      </footer>

    </div>
  );
}

export default function Blog() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-dark-500 text-gold-500 tracking-widest text-sm uppercase">
        Loading...
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
