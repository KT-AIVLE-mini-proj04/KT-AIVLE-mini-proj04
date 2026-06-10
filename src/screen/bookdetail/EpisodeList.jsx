import { useNavigate } from "react-router";

function EpisodeList({ episodes }) {
  const navigate = useNavigate();

  return (
    <section className="episodes-section">
      <div className="episodes-header">
        <h3>에피소드</h3>
        <span>{episodes?.length ?? 0}화</span>
      </div>
      {!episodes?.length ? (
        <p className="no-episodes">회차가 등록되지 않았습니다.</p>
      ) : (
        <div className="episode-list">
          {episodes.map((episode, index) => (
            <div
              key={episode.episodeId ?? index}
              className="episode-item"
              onClick={() => navigate(`/episodes/${episode.episodeId}`)}>
              <span className="episode-number">{episode.episodeIndex ?? index + 1}화</span>
              <span className="episode-title">{episode.episodeTitle ?? "제목 없음"}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EpisodeList;
