import {
  CreateCommentPayload,
  CreateReviewPayload,
  ReviewDetailResponse,
  ReviewPreview,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
};

export const api = {
  listReviews: () => request<ReviewPreview[]>("/reviews"),
  getReview: (slug: string) =>
    request<ReviewDetailResponse>(`/reviews/${slug}`),
  createReview: (payload: CreateReviewPayload) =>
    request<{ slug: string }>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createComment: (slug: string, payload: CreateCommentPayload) =>
    request<{ ok: true }>(`/reviews/${slug}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createReply: (commentId: string, payload: CreateCommentPayload) =>
    request<{ ok: true }>(`/comments/${commentId}/replies`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  },
};
