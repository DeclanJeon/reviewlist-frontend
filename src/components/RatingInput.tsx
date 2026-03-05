type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export const RatingInput = ({ value, onChange }: RatingInputProps) => {
  return (
    <div className="rating-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn${star <= value ? " on" : ""}`}
          onClick={() => onChange(star)}
          aria-label={`${star}점`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export const ReadOnlyRating = ({ value }: { value: number }) => {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`s${star <= value ? " on" : ""}`}>
          ★
        </span>
      ))}
    </span>
  );
};
