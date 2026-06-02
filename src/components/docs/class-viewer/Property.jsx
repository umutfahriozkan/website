import { Link, useLocation } from 'react-router';
import Types from '../Types';
import ParamTable from './ParamTable';
import SourceButton from '../SourceButton';
import See from '../See';
import { convertLinks, typeKey } from '../../../util';
import { marked } from 'marked';

export default function ClassProperty({ prop, docs }) {
  const location = useLocation();

  const scrollTo =
    `${prop.scope === 'static' ? 's-' : ''}${prop.name}`;

  const description = marked(
    convertLinks(prop.description, docs, null, {
      pathname: location.pathname,
      search: location.search,
    })
  );

  return (
    <div
      className="class-prop class-item"
      id={`doc-for-${scrollTo}`}
    >
      <SourceButton meta={prop.meta} docs={docs} />

      <h3>
        <Link to={{ search: `?scrollTo=${scrollTo}` }}>
          .{prop.name}
        </Link>
      </h3>

      {prop.scope === 'static' && (
        <span
          className="badge"
          title="This property is on the class constructor function, not instances."
        >
          Static
        </span>
      )}

      {prop.readonly && (
        <span
          className="badge"
          title="This property cannot be modified."
        >
          Read-only
        </span>
      )}

      {prop.deprecated && (
        <span
          className="badge warn"
          title="This property is deprecated, and may be removed in a future version."
        >
          Deprecated
        </span>
      )}

      {prop.access === 'private' && (
        <span
          className="badge warn"
          title="This property is private, and may change or be removed at any time."
        >
          Private
        </span>
      )}

      <div className="class-item-details">
        <p dangerouslySetInnerHTML={{ __html: description }} />

        {prop.props?.length > 0 && (
          <ParamTable params={prop.props} docs={docs} />
        )}

        <div className="prop-type">
          Type:{' '}
          {prop.type.map(type => (
            <Types
              key={typeKey(type)}
              names={type}
              nullable={prop.nullable}
              docs={docs}
            />
          ))}
        </div>

        {prop.default && (
          <div className="prop-default">
            Default: <code>{prop.default}</code>
          </div>
        )}

        {prop.see && (
          <See see={prop.see} docs={docs} />
        )}
      </div>
    </div>
  );
}
