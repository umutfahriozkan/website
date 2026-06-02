import { scopedName } from '../../../util';
import { Link } from 'react-router';

export default function ClassOverview({ properties, methods, events }) {
  function scroll(to) {
    const el = document.getElementById(`doc-for-${to}`);
    if (!el) return;

    el.setAttribute('data-scrolled', true);
    setTimeout(() => el.setAttribute('data-scrolled', false), 1000);
    setTimeout(() => el.removeAttribute('data-scrolled'), 2000);

    el.scrollIntoView();
    window.scrollBy(0, -50);
  }

  return (
    <div id="class-overview">
      {/* ---------- Properties ---------- */}
      {properties?.length > 0 && (
        <div className="col">
          <div className="title">Properties</div>

          <ul className="animated-list">
            {properties.map(property => {
              const name = scopedName(property);

              return (
                <li
                  key={name}
                  className="animated-list-item"
                  onClick={() => scroll(name)}
                >
                  <Link
                    to={{
                      pathname: '', // same route
                      search: `?scrollTo=${name}`,
                    }}
                  >
                    {property.name}

                    {property.scope === 'static' && (
                      <span className="small-badge">S</span>
                    )}
                    {property.abstract && (
                      <span className="small-badge">A</span>
                    )}
                    {property.deprecated && (
                      <span className="small-badge warn">D</span>
                    )}
                    {property.access === 'private' && (
                      <span className="small-badge warn">P</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ---------- Methods ---------- */}
      {methods?.length > 0 && (
        <div className="col">
          <div className="title">Methods</div>

          <ul className="animated-list">
            {methods.map(method => {
              const name = scopedName(method);

              return (
                <li
                  key={name}
                  className="animated-list-item"
                  onClick={() => scroll(name)}
                >
                  <Link
                    to={{
                      pathname: '',
                      search: `?scrollTo=${name}`,
                    }}
                  >
                    {method.name}

                    {method.scope === 'static' && (
                      <span className="small-badge">S</span>
                    )}
                    {method.abstract && (
                      <span className="small-badge">A</span>
                    )}
                    {method.deprecated && (
                      <span className="small-badge warn">D</span>
                    )}
                    {method.access === 'private' && (
                      <span className="small-badge warn">P</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ---------- Events ---------- */}
      {events?.length > 0 && (
        <div className="col">
          <div className="title">Events</div>

          <ul>
            {events.map(event => {
              const key = `e-${event.name}`;

              return (
                <li key={event.name} onClick={() => scroll(key)}>
                  <Link
                    to={{
                      pathname: '',
                      search: `?scrollTo=${key}`,
                    }}
                  >
                    {event.name}

                    {event.deprecated && (
                      <span className="small-badge warn">D</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
