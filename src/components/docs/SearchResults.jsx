import { Link } from 'react-router';

/* ---------- component ---------- */

export default function SearchResults({ results, showScores, searchTerm }) {
  /* ---------- helpers ---------- */

  function highlightName(result) {
    const match = result.matches?.find(m => m.key === 'fullName');
    const baseName = result.item.fullName || result.item.name;

    if (!match) return baseName;

    let name = match.value;

    // walk backwards so indices stay valid
    for (let i = match.indices.length - 1; i >= 0; i--) {
      const [startIdx, endIdx] = match.indices[i];
      const matchStr = name.slice(startIdx, endIdx + 1);
      const before = name.slice(0, startIdx);
      const after = name.slice(endIdx + 1);

      const exact =
        matchStr.toLowerCase() === searchTerm.toLowerCase();

      name = `${before}${
        exact ? '<strong>' : ''
      }<em>${matchStr}</em>${
        exact ? '</strong>' : ''
      }${after}`;
    }

    return name;
  }

  function typeClass(type) {
    if (type === 'Property') return 'secondary';
    if (type === 'Method') return 'tertiary';
    if (type === 'Event') return 'quaternary';
    if (type === 'Typedef') return 'quinary';
    return '';
  }

  /* ---------- render ---------- */

  return (
    <ul className="results-list animated-list">
      {results.map(result => {
        const item = result.item;
        const key =
          item.key || item.fullName || item.name;

        return (
          <li key={key} className="animated-list-item">
            {showScores && (
              <span className="score">
                {Math.round((1 - result.score) * 100)}%
              </span>
            )}

            <Link to={item.route}>
              <span
                className={`badge ${typeClass(item.type)}`}
                title={item.type}
              >
                {item.type[0]}
              </span>

              <span
                dangerouslySetInnerHTML={{
                  __html: highlightName(result),
                }}
              />

              {item.type === 'Method' ? '()' : ''}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
