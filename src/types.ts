export type ReviewPreview = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  author_name: string;
  rating: number;
  content_html: string;
  created_at: string;
  category?: string;
  like_count?: number;
  comment_count?: number;
};

export type ReviewCommentReply = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type ReviewComment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  replies: ReviewCommentReply[];
};

export type ReviewDetailResponse = {
  review: ReviewPreview;
  comments: ReviewComment[];
};

export type CreateReviewPayload = {
  title: string;
  summary?: string;
  authorName: string;
  rating: number;
  contentHtml: string;
  category?: string;
};

export type CreateCommentPayload = {
  authorName: string;
  content: string;
};
