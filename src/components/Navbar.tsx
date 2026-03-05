import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon" aria-hidden="true">
            <img
              src="/logo.webp"
              alt="ReviewLink 로고"
              width="22"
              height="22"
              loading="eager"
              decoding="async"
            />
          </span>
          <span>ReviewLink</span>
        </Link>

        <Link to="/write" className="btn-nav-write">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <title>작성</title><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          리뷰 작성
        </Link>
      </div>
    </nav>
  );
};
