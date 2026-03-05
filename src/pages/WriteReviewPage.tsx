import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { RichTextEditor } from "../components/RichTextEditor";
import { RatingInput } from "../components/RatingInput";

const SERVICES = [
  { id: "PonsLink", icon: "🔗", desc: "실시간 경험 공유" },
  { id: "PonsWarp", icon: "⚡", desc: "P2P 파일 전송" },
  { id: "Navid", icon: "🧭", desc: "내비게이션 서비스" },
  { id: "Flucto", icon: "⬇️", desc: "미디어 다운로더" },
  { id: "DocuFlow", icon: "📄", desc: "PDF 도구 모음" },
] as const;

export const WriteReviewPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [contentHtml, setContentHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await api.createReview({
        title,
        summary: undefined,
        authorName,
        rating: rating || 5,
        contentHtml,
        category: category || undefined,
      });
      navigate(`/reviews/${result.slug}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "리뷰 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = SERVICES.find((s) => s.id === category);

  return (
    <div className="write-page container fade-in">
      <Link to="/" className="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <title>뒤로</title><polyline points="15 18 9 12 15 6" />
        </svg>
        뒤로 가기
      </Link>

      <div className="write-header">
        <h1 className="write-heading">리뷰 작성</h1>
        <p className="write-subheading">어떤 서비스를 경험하셨나요? 솔직한 리뷰를 남겨주세요.</p>
      </div>

      <div className="write-card">
        <form className="form-grid" onSubmit={onSubmit}>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="rv-category">
                어떤 서비스에 대한 리뷰인가요?
                <span className="form-label-required">*</span>
              </label>
              <select
                id="rv-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">서비스를 선택해주세요</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.id} — {s.desc}
                  </option>
                ))}
              </select>
              {selectedService && (
                <p className="form-hint">
                  {selectedService.icon} <strong>{selectedService.id}</strong> — {selectedService.desc}
                </p>
              )}
            </div>
            <div className="form-group">
              <span className="form-label">
                별점을 선택해주세요
                <span className="form-label-required">*</span>
              </span>
              <RatingInput value={rating} onChange={setRating} />
              {rating > 0 && (
                <p className="form-hint">
                  {["", "아쉬워요", "별로예요", "보통이에요", "좋아요", "최고예요"][rating]}
                </p>
              )}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="rv-title">
                제목
                <span className="form-label-required">*</span>
              </label>
              <input
                id="rv-title"
                className="form-input"
                placeholder="리뷰 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="rv-author">
                작성자 닉네임
                <span className="form-label-required">*</span>
              </label>
              <input
                id="rv-author"
                className="form-input"
                placeholder="표시될 이름을 입력하세요"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                maxLength={40}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">
              리뷰 내용
              <span className="form-label-required">*</span>
            </span>
            <p className="form-hint editor-hint">이미지나 YouTube 링크를 포함한 자세한 리뷰를 작성해주세요.</p>
            <RichTextEditor value={contentHtml} onChange={setContentHtml} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-submit-row">
            <button type="submit" className="btn-submit" disabled={submitting}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <title>등록</title><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              {submitting ? "등록 중..." : "리뷰 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
