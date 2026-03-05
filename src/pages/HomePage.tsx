import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { ReviewPreview } from "../types";
import { ReadOnlyRating } from "../components/RatingInput";

const SERVICES = [
  { id: "PonsLink", icon: "🔗", desc: "실시간 경험 공유", url: "https://ponslink.online" },
  { id: "PonsWarp", icon: "⚡", desc: "P2P 파일 전송", url: "https://warp.ponslink.online" },
  { id: "Navid", icon: "🧭", desc: "내 인생 가이드(사주)", url: "https://navid.ponslink.online" },
  { id: "Flucto", icon: "⬇️", desc: "미디어 다운로더", url: "https://github.com/DeclanJeon/flucto/releases" },
  { id: "DocuFlow", icon: "📄", desc: "PDF 도구 모음", url: "https://docuflow.ponslink.online" },
] as const;

const CATEGORIES = ["전체", ...SERVICES.map((s) => s.id)] as const;

const stripHtml = (html: string): string => {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent ?? "";
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const getServiceIcon = (id: string): string => {
  const service = SERVICES.find((s) => s.id === id);
  return service?.icon ?? "📁";
};

const CategoryGuide = () => (
  <section className="category-guide container">
    <h2 className="guide-title">이런 서비스들의 리뷰를 작성해보세요</h2>
    <div className="service-grid">
      {SERVICES.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="service-card">
          <span className="service-icon">{s.icon}</span>
          <h3 className="service-name">{s.id}</h3>
          <p className="service-desc">{s.desc}</p>
        </a>
      ))}
    </div>
  </section>
);

export const HomePage = () => {
  const [reviews, setReviews] = useState<ReviewPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listReviews();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    let list = reviews;

    if (activeCategory !== "전체") {
      list = list.filter((r) => (r.category ?? "기타") === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.summary ?? "").toLowerCase().includes(q) ||
          r.author_name.toLowerCase().includes(q),
      );
    }

    return list;
  }, [reviews, activeCategory, search]);

  return (
    <div className="fade-in">
      <section className="hero">
        <h1 className="hero-title">
          솔직한 리뷰,
          <br />
          <span className="accent">더 나은 선택</span>
        </h1>
        <p className="hero-subtitle">실사용자들의 생생한 리뷰를 확인하고 공유하세요</p>
      </section>

      <CategoryGuide />

      <section className="search-filter container">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <title>검색</title>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            placeholder="리뷰 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`pill${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat !== "전체" && <span className="pill-icon">{getServiceIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="reviews-section container">
        {loading ? (
          <p className="center-msg">리뷰를 불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="center-msg">
            {reviews.length === 0
              ? "아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!"
              : "검색 결과가 없습니다."}
          </p>
        ) : (
          <div className="reviews-grid">
            {filtered.map((review) => (
              <Link key={review.id} to={`/reviews/${review.slug}`} className="review-card">
                <div className="card-top">
                  <span className="badge">{review.category ?? "기타"}</span>
                  <span className="card-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <title>날짜</title>
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatDate(review.created_at)}
                  </span>
                </div>

                <h3 className="card-title">{review.title}</h3>

                <p className="card-excerpt">
                  {review.summary || stripHtml(review.content_html).slice(0, 120)}
                </p>

                <div className="card-footer">
                  <div className="card-author">
                    <ReadOnlyRating value={review.rating} />
                    <span className="author-name">by {review.author_name}</span>
                  </div>
                  <div className="card-stats">
                    <span className="stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <title>좋아요</title>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {review.like_count ?? 0}
                    </span>
                    <span className="stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <title>댓글</title>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {review.comment_count ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
