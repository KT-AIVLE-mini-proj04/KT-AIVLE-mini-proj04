function BookCover({ title, coverImageUrl }) {
  const hasCoverImage = coverImageUrl && coverImageUrl.trim() !== "";

  return (
    <div className="book-cover">
      {hasCoverImage ? (
        <img src={coverImageUrl} alt={`${title} 표지`} />
      ) : (
        <div className="book-cover-placeholder">
          <span className="placeholder-icon">📖</span>
          <span className="placeholder-text">{title}</span>
        </div>
      )}
    </div>
  );
}

export default BookCover;
