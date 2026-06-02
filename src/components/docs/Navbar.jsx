import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import Loading from '../Loading';
import Container from "../Container"
import { useApp } from '../../Context';

/* ---------- component ---------- */

export default function DocsNavbar({ sources }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const {currentSource: source, setCurrentSource} = useApp();

  const [tagChoice, setTagChoice] = useState(null);
  const [tags, setTags] = useState(null);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  /* ---------- load tags (race-safe) ---------- */
  useEffect(() => {
    let alive = true;
    setTags(null);

    if (source.tags) {
      setTags(source.tags);
      return;
    }

    source.fetchTags().then(t => {
      if (alive && source.id === source) {
        setTags(t);
      }
    });

    return () => {
      alive = false;
    };
  }, [source]);

  /* ---------- update tag choice (Vue @enter equivalent) ---------- */
  useEffect(() => {
    if (!tags) return;

    setTagChoice(
      params.tag ||
      source.recentTag ||
      source.defaultTag ||
      null
    );
  }, [tags, params.tag, source]);

  /* ---------- source select → route ---------- */
  useEffect(() => {
    console.log("source navbar")
    if (params.source !== source) {
      navigate(`/docs/${source}`, { replace: false });
    }
  }, [source]);

  /* ---------- tag select → route ---------- */
  useEffect(() => {
    if (!tagChoice) return;
    if (params.tag === tagChoice) return;

    navigate(
      {
        pathname: location.pathname.replace(/\/[^/]*$/, `/${tagChoice}`),
        search: location.search,
      },
      { replace: false }
    );
  }, [tagChoice]);

  /* ---------- route → local state sync ---------- */
  useEffect(() => {
    if (params.tag && tagChoice !== params.tag) {
      setTagChoice(params.tag);
    }
  }, [params.tag]);

  /* ---------- search (debounced) ---------- */
  useEffect(() => {
    const id = setTimeout(() => {
      if (!search) return;

      navigate(
        { pathname: '/docs/search', search: `?q=${search}` },
        { replace: true }
      );
    }, 200);

    return () => clearTimeout(id);
  }, [search]);

  const onSearchEnter = e => {
    if (e.key === 'Enter') {
      navigate(
        { pathname: '/docs/search', search: `?q=${search}` },
        { replace: false }
      );
    }
  };

  return (
    <div id="docs-navbar">
      <Container>
        View docs for{' '}

        <select
          value={source}
          onChange={e => setCurrentSource(e.target.value)}
        >
          {sources.map(src => (
            <option key={src.id} value={src.id}>
              {src.name}
            </option>
          ))}
        </select>

        {tags ? (
          <select
            key={source.id}
            value={tagChoice ?? ''}
            onChange={e => setTagChoice(e.target.value)}
          >
            {tags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        ) : (
          <Loading />
        )}

        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value.trim())}
          onKeyDown={onSearchEnter}
        />

        <Link to="/docs/search">
          <em className="fa fa-search" />
        </Link>
      </Container>
    </div>
  );
}
