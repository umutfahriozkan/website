import Types from '../Types';
import { convertLinks, typeKey } from '../../../util';
import { marked } from 'marked';

/* ---------- component ---------- */

export default function ParamTable({ params, docs, router, route }) {
  const hasOptional = params.some(p => p.optional);

  function paramDescription(param) {
    return marked(
      convertLinks(param.description, docs, router, route)
    );
  }

  function paramDefault(param) {
    return param.optional ? `<code>${param.default}</code>` : '';
  }

  return (
    <div className="param-table-wrapper">
      <table className="param-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            {hasOptional && <th>Optional</th>}
            {hasOptional && <th>Default</th>}
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {params.map(param => (
            <tr key={param.name}>
              <td>{param.name}</td>

              <td>
                {param.type.map(type => (
                  <Types
                    key={typeKey(type)}
                    names={type}
                    variable={param.variable}
                    nullable={param.nullable}
                    docs={docs}
                  />
                ))}
              </td>

              {hasOptional && (
                <td>
                  {param.optional && (
                    <em className="fa fa-check" />
                  )}
                </td>
              )}

              {hasOptional && (
                <td>
                  {param.optional &&
                  typeof param.default === 'undefined' ? (
                    <em>none</em>
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: paramDefault(param),
                      }}
                    />
                  )}
                </td>
              )}

              <td
                dangerouslySetInnerHTML={{
                  __html: paramDescription(param),
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
