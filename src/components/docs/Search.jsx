import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import Fuse from 'fuse.js';

import { scopedName } from '../../util';
import SearchResults from './SearchResults';

/* ---------- helpers ---------- */

function fullName(child, parentName) {
  return `${parentName}${child.scope === 'static' ? '.' : '#'}${child.name}`;
}

function buildFuse(docs, toggles, showPrivate) {
  const items = [];

  for (const c of docs.classes) {
    if (!showPrivate && c.access === 'private') continue;

    if (toggles.classes) {
      items.push({
        type: 'Class',
        parent: c.name,
        name: c.name,
        fullName: c.name,
        scope: c.scope,
        access: c.access,
        route: null,
      });
    }

    if (c.props && toggles.props) {
      for (const p of c.props) {
        if (!showPrivate && p.access === 'private') continue;
        items.push({
          type: 'Property',
          parent: c.name,
          name: p.name,
          fullName: fullName(p, c.name),
          scope: p.scope,
          access: p.access,
          route: null,
        });
      }
    }

    if (c.methods && toggles.methods) {
      for (const m of c.methods) {
        if (!showPrivate && m.access === 'private') continue;
        items.push({
          type: 'Method',
          parent: c.name,
          name: m.name,
          fullName: fullName(m, c.name),
          scope: m.scope,
          access: m.access,
          route: null,
        });
      }
    }

    if (c.events && toggles.events) {
      for (const e of c.events) {
        if (!showPrivate && e.access === 'private') continue;
        items.push({
          type: 'Event',
          parent: c.name,
          name: e.name,
          fullName: `${c.name}#${e.name}`,
          scope: e.scope,
          access: e.access,
          key: null,
          route: null,
        });
      }
    }
  }

  if (toggles.typedefs) {
    for (const t of docs.typedefs) {
      if (!showPrivate && t.access === 'private') continue;
      items.push({
        type: 'Typedef',
        parent: t.name,
        name: t.name,
        fullName: t.name,
        scope: t.scope,
        access: t.access,
        route: null,
      });
    }
  }

  return new Fuse(items, {
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'parent', weight: 0.2 },
      { name: 'fullName', weight: 0.3 },
    ],
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 3,
  });
}

/* ---------- component ---------- */

export default function DocsSearch({ docs, showPrivate }) {
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState(params.get('q') ?? '');
  const [showScores, setShowScores] = useState(false);
  const [toggles, setToggles] = useState({
    classes: true,
    props: true,
    methods: true,
    events: true,
    typedefs: true,
  });

  /* sync URL → state */
  useEffect(() => {
    setSearch(params.get('q') ?? '');
  }, [params]);

  /* sync state → URL (debounced) */
  useEffect(() => {
    const id = setTimeout(() => {
      setParams(search ? { q: search } : {});
    }, 200);
    return () => clearTimeout(id);
  }, [search, setParams]);

  const fuse = useMemo(
    () => buildFuse(docs, toggles, showPrivate),
    [docs, toggles, showPrivate]
  );

  const results = useMemo(() => {
    if (!search || search.length < 2) return [];

    const res = fuse.search(search);

    for (const r of res) {
      const item = r.item;

      if (item.type === 'Class') {
        item.route = { name: 'docs-class', params: { class: item.name } };
        continue;
      }

      if (item.type === 'Property' || item.type === 'Method') {
        item.fullName = fullName(item, item.parent);
        item.route = {
          name: 'docs-class',
          params: { class: item.parent },
          query: { scrollTo: scopedName(item) },
        };
        continue;
      }

      if (item.type === 'Event') {
        item.key = `e-${item.parent}#${item.name}`;
        item.fullName = fullName(item, item.parent);
        item.route = {
          name: 'docs-class',
          params: { class: item.parent },
          query: { scrollTo: `e-${item.name}` },
        };
        continue;
      }

      if (item.type === 'Typedef') {
        item.route = {
          name: 'docs-typedef',
          params: { typedef: item.name },
        };
      }
    }

    // prune false-positive class-member matches
    let i = 0;
    while (i < res.length) {
      const r = res[i];
      if (['Property', 'Method', 'Event'].includes(r.item.type)) {
        const keys = r.matches.map(m => m.key);
        if (
          keys.length === 2 &&
          keys.includes('parent') &&
          keys.includes('fullName')
        ) {
          res.splice(i, 1);
          continue;
        }
      }
      i++;
    }

    return res;
  }, [fuse, search]);

  const fullMatches = results.filter(
    r => Math.round((1 - r.score) * 100) === 100
  );

  const partialMatches = results.filter(
    r => Math.round((1 - r.score) * 100) !== 100
  );

  return (
    <div id="docs-search" className="docs-page">
      <em
        id="show-scores"
        className={`fa fa-bar-chart ${!showScores ? 'disabled' : ''}`}
        title={`Scores are ${showScores ? 'shown' : 'hidden'}. Click to toggle.`}
        onClick={() => setShowScores(s => !s)}
      />

      <h1>Search</h1>

      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value.trim())}
      />

      <div id="toggles">
        {Object.keys(toggles).map(k => (
          <label key={k}>
            <input
              type="checkbox"
              checked={toggles[k]}
              onChange={() =>
                setToggles(t => ({ ...t, [k]: !t[k] }))
              }
            />
            {' '}
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </label>
        ))}
      </div>

      {search && search.length >= 2 ? (
        results.length ? (
          <>
            {fullMatches.length > 0 && (
              <div
                className={
                  fullMatches.length && partialMatches.length
                    ? 'results-separator'
                    : ''
                }
              >
                <h2>
                  Results for "{search}" ({fullMatches.length})
                </h2>
                <SearchResults
                  results={fullMatches}
                  showScores={showScores}
                  searchTerm={search}
                />
              </div>
            )}

            {partialMatches.length > 0 && (
              <>
                <h2>
                  Similar results for "{search}" ({partialMatches.length})
                </h2>
                <SearchResults
                  results={partialMatches}
                  showScores={showScores}
                  searchTerm={search}
                />
              </>
            )}
          </>
        ) : (
          <p>No results for "{search}".</p>
        )
      ) : (
        <p>Your search query must be at least two characters.</p>
      )}
    </div>
  );
}
