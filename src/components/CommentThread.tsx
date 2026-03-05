import { FormEvent, useState } from "react";
import { ReviewComment } from "../types";

type CommentThreadProps = {
  comments: ReviewComment[];
  onSubmitReply: (commentId: string, authorName: string, content: string) => Promise<void>;
};

const getInitial = (name: string): string => {
  return name.charAt(0);
};

export const CommentThread = ({ comments, onSubmitReply }: CommentThreadProps) => {
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!expandedReply) return;

    setIsSubmitting(true);
    try {
      await onSubmitReply(expandedReply, replyAuthor, replyContent);
      setReplyAuthor("");
      setReplyContent("");
      setExpandedReply(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 오전 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="cmt-list">
      {comments.map((comment) => (
        <div key={comment.id} className="cmt-item">
          <div className="cmt-avatar">{getInitial(comment.authorName)}</div>
          <div className="cmt-body">
            <div className="cmt-head">
              <span className="cmt-author">{comment.authorName}</span>
              <span className="cmt-time">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="cmt-text">{comment.content}</p>
            <button
              type="button"
              className="btn-reply-toggle"
              onClick={() => setExpandedReply(expandedReply === comment.id ? null : comment.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <title>답글</title><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
              </svg>
              답글
            </button>

            {expandedReply === comment.id && (
              <form className="reply-form-box" onSubmit={submitReply}>
                <input
                  className="reply-input"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="닉네임"
                  required
                />
                <textarea
                  className="reply-textarea"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 작성하세요..."
                  required
                />
                <div className="reply-submit-row">
                  <button type="submit" className="btn-orange" disabled={isSubmitting}>
                    {isSubmitting ? "등록 중..." : "답글 등록"}
                  </button>
                </div>
              </form>
            )}

            {comment.replies.length > 0 && (
              <div className="reply-thread">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="cmt-item">
                    <div className="reply-avatar">{getInitial(reply.authorName)}</div>
                    <div className="cmt-body">
                      <div className="cmt-head">
                        <span className="cmt-author">{reply.authorName}</span>
                        <span className="cmt-time">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="cmt-text">{reply.content}</p>
                      <button
                        type="button"
                        className="btn-reply-toggle"
                        onClick={() => setExpandedReply(expandedReply === reply.id ? null : reply.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <title>답글</title><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                        </svg>
                        답글
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
