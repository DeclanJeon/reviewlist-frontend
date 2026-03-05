import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { WriteReviewPage } from "./pages/WriteReviewPage";
import { ReviewDetailPage } from "./pages/ReviewDetailPage";

export const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WriteReviewPage />} />
          <Route path="/reviews/:slug" element={<ReviewDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};
