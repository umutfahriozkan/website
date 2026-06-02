import { Link, useLocation } from 'react-router';
import { marked } from 'marked';
import Types from '../Types';
import TypeLink from '../TypeLink';
import ParamTable from './ParamTable';
import SourceButton from '../SourceButton';
import See from '../See';
import { convertLinks, parseLink, typeKey } from '../../../util';

export default function ClassMethod({ method, docs }) {
  const location = useLocation();

  const params = method.params
    ? method.params.filter(p => !p.name.includes('.'))
    : null;

  const description = method.description
    ? marked(
        convertLinks(method.description, docs, null, {
          pathname: location.pathname,
          search: location.search,
        })
      )
    : '';

  const returnDescription =
    method.returns?.description
      ? marked(
          convertLinks(method.returns.description, docs, null, {
            pathname: location.pathname,
            search: location.search,
          })
        )
      : '';

  const emits = method.emits
    ? method.emits.map(e =>
        parseLink(e.replace(/:event/i, ''), docs)
      )
    : null;

  const scrollTo = `${method.scope === 'static' ? 's-' : ''}${method.name}`;

  return (
    <div
      className="class-method class-item"
      id={`doc-for-${scrollTo}`}
    >
      <SourceButton meta={method.meta} docs={docs} />

      <h3>
        <Link to={{ search: `?scrollTo=${scrollTo}` }}>
          .{method.name}(
          {params &&
            params.map(param => (
              <span
                key={param.name}
                className={`method-param ${
                  param.optional ? 'optional' : ''
                }`}
              >
                {param.variable ? '...' : ''}
                {param.name}
              </span>
            ))}
          )
        </Link>
      </h3>

      {method.scope === 'static' && (
        <span
          className="badge"
          title="This method is on the class constructor function, not instances."
        >
          Static
        </span>
      )}

      {method.abstract && (
        <span
          className="badge"
          title="This method is abstract, and must be implemented in a child class."
        >
          Abstract
        </span>
      )}

      {method.deprecated && (
        <span
          className="badge warn"
          title="This method is deprecated, and may be removed in a future version."
        >
          Deprecated
        </span>
      )}

      {method.access === 'private' && (
        <span
          className="badge warn"
          title="This method is private, and may change or be removed at any time."
        >
          Private
        </span>
      )}

      <div className="class-item-details">
        <p dangerouslySetInnerHTML={{ __html: description }} />

        {method.params && (
          <ParamTable params={method.params} docs={docs} />
        )}

        <div className="method-return">
          Returns:{' '}
          {method.returns ? (
            <>
              {(method.returns.types || method.returns).map(rtrn => (
                <Types
                  key={typeKey(rtrn)}
                  names={rtrn}
                  variable={method.returns.variable}
                  nullable={method.returns.nullable}
                  docs={docs}
                />
              ))}
            </>
          ) : (
            <TypeLink
              type={['void']}
              docs={docs}
              className="docs-type"
            />
          )}

          {method.returns?.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: returnDescription,
              }}
            />
          )}
        </div>

        {method.throws && (
          <div className="method-throws">
            Throws:{' '}
            {method.throws.map(thrw => (
              <Types
                key={thrw}
                names={thrw}
                docs={docs}
              />
            ))}
          </div>
        )}

        {emits && (
          <div className="method-emits">
            Emits:{' '}
            {emits.length > 1 ? (
              <ul>
                {emits.map(event => (
                  <li key={event.text}>
                    <Link
                      to={event.link}
                      className="docs-type"
                    >
                      {event.text}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                to={emits[0].link}
                className="docs-type"
              >
                {emits[0].text}
              </Link>
            )}
          </div>
        )}

        {method.examples && (
          <div className="method-examples">
            Examples:
            {method.examples.map(example => (
              <pre key={example}>
                <code className="javascript">
                  {example}
                </code>
              </pre>
            ))}
          </div>
        )}

        {method.see && (
          <See see={method.see} docs={docs} />
        )}
      </div>
    </div>
  );
}
