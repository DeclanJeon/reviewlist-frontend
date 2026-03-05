import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { api } from "../lib/api";
import { ReviewDetailResponse } from "../types";
import { ReadOnlyRating } from "../components/RatingInput";
import { CommentThread } from "../components/CommentThread";

const formatFullDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export const ReviewDetailPage = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState<ReviewDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!slug) {
      setError("잘못된 접근입니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getReview(slug);
      setDetail(data);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "리뷰를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  const onSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!slug) return;

    setSubmittingComment(true);
    try {
      await api.createComment(slug, { authorName: commentAuthor, content: commentContent });
      setCommentAuthor("");
      setCommentContent("");
      await fetchDetail();
    } finally {
      setSubmittingComment(false);
    }
  };

  const onSubmitReply = async (commentId: string, authorName: string, content: string) => {
    await api.createReply(commentId, { authorName, content });
    await fetchDetail();
  };

  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(detail?.review.content_html ?? "");
  }, [detail?.review.content_html]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="detail-page container">
        <p className="center-msg">리뷰를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="detail-page container">
        <p className="error-text">{error ?? "리뷰를 찾을 수 없습니다."}</p>
        <Link to="/" className="back-btn" style={{ marginTop: 12 }}>
          ← 목록으로
        </Link>
      </div>
    );
  }

  const review = detail.review;

  return (
    <div className="detail-page container fade-in">
      <Link to="/" className="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <title>뒤로</title><polyline points="15 18 9 12 15 6" />
        </svg>
        뒤로 가기
      </Link>

      <article className="detail-card">
        <span className="detail-badge">{review.category ?? "기타"}</span>
        <h1 className="detail-title">{review.title}</h1>

        <div className="detail-meta">
          <span className="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <title>작성자</title><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {review.author_name}
          </span>
          <span className="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <title>날짜</title><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {formatFullDate(review.created_at)}
          </span>
        </div>

        <div className="detail-rating">
          <ReadOnlyRating value={review.rating} />
          <span className="detail-score">{review.rating.toFixed(1)}</span>
        </div>

        <div
          className="review-body"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <div className="detail-actions">
          <button type="button" className="act-btn" onClick={() => {}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <title>좋아요</title><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            좋아요 {review.like_count ?? 0}
          </button>
          <button type="button" className="act-btn" onClick={handleShare}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <title>공유</title><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {copied ? "복사됨!" : "공유"}
          </button>
        </div>
      </article>

      <section className="comments-card">
        <h3 className="comments-heading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <title>댓글</title><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          댓글 {detail.comments.length}개
        </h3>

        <form onSubmit={onSubmitComment}>
          <input
            className="cmt-form-name"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="닉네임"
            required
          />
          <textarea
            className="cmt-form-body"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            required
          />
          <div className="cmt-submit-row">
            <button type="submit" className="btn-orange" disabled={submittingComment}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <title>등록</title><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              {submittingComment ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>

        <CommentThread comments={detail.comments} onSubmitReply={onSubmitReply} />
      </section>
    </div>
  );
};
