import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';

import Types from '../Types';
import TypeLink from '../TypeLink';
import ParamTable from './ParamTable';
import Overview from './Overview';
import Property from './Property';
import Method from './Method';
import Event from './Event';
import SourceButton from '../SourceButton';
import See from '../See';
import UnknownPage from "../../UnknownPage"
import { hljs, convertLinks, scopedName, typeKey, renderMarkdown } from '../../../util';

import { useOutletContext } from 'react-router';
import { useApp } from '../../../Context';

export default function ClassViewer() {


  const { docs } = useOutletContext();
  const { showPrivate } = useApp();
  
  const { className, source, tag } = useParams();

  const clarse = useMemo(
    () => docs.classes.find(c => c.name === className),
    [docs.classes, className]
  );

  const constructorParams = useMemo(() => {
    if (!clarse?.construct?.params) return null;
    return clarse.construct.params.filter(p => !p.name.includes('.'));
  }, [clarse]);

  const properties = useMemo(() => {
    if (!clarse?.props) return null;
    const list = showPrivate
      ? clarse.props
      : clarse.props.filter(p => p.access !== 'private');

    return [...list].sort((a, b) =>
      `${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(
        `${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`
      )
    );
  }, [clarse, showPrivate]);

  const methods = useMemo(() => {
    if (!clarse?.methods) return null;
    const list = showPrivate
      ? clarse.methods
      : clarse.methods.filter(m => m.access !== 'private');

    return [...list].sort((a, b) =>
      `${a.scope === 'static' ? 'ZZZ' : ''}${a.name}`.localeCompare(
        `${b.scope === 'static' ? 'ZZZ' : ''}${b.name}`
      )
    );
  }, [clarse, showPrivate]);

  const description = useMemo(() => {
    if (!clarse?.description) return null;
    return renderMarkdown(
      convertLinks(clarse.description, docs, source, tag)
    );
  }, [clarse, docs]);

  useEffect(() => {
    document.querySelectorAll('pre code').forEach(el => hljs(el));
  }, [clarse]);

  if (!clarse) {
   // return <UnknownPage className="docs-page"/>;
  }

  console.log("trigger");
  return (
    <div id="class-viewer" className="docs-page">
      <SourceButton meta={clarse.meta} docs={docs} />

      <h1>{clarse.name}</h1>

      <p className="class-name-extra">
        {clarse.extends && (
          <span>
            extends{' '}
            {typeof clarse.extends[0] === 'string' ? (
              <TypeLink type={clarse.extends} docs={docs} />
            ) : (
              clarse.extends.map(type => (
                <Types
                  key={typeKey(type)}
                  names={type}
                  docs={docs}
                />
              ))
            )}
          </span>
        )}

        {clarse.implements && (
          <span>
            {' '}implements{' '}
            {typeof clarse.implements[0] === 'string' ? (
              <TypeLink type={clarse.implements} docs={docs} />
            ) : (
              clarse.implements.map(type => (
                <Types
                  key={typeKey(type)}
                  names={type}
                  docs={docs}
                />
              ))
            )}
          </span>
        )}
      </p>

      {clarse.abstract && <span className="badge class-badge">Abstract</span>}
      {clarse.deprecated && <span className="badge class-badge warn">Deprecated</span>}
      {clarse.access === 'private' && <span className="badge class-badge warn">Private</span>}

      {description && (
        <p
          className="class-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {clarse.see && <See see={clarse.see} docs={docs} />}

      {clarse.construct &&
        (showPrivate || clarse.construct.access !== 'private') && (
          <div id="class-constructor">
            <h2>Constructor</h2>
            <pre>
              <code className="js">
                new {docs.global}.{clarse.name}(
                {constructorParams?.map(p => (
                  <span key={p.name} className="constructor-param">
                    {p.name}
                  </span>
                ))}
                );
              </code>
            </pre>
            <ParamTable params={clarse.construct.params} docs={docs} />
          </div>
        )}

      <Overview
        properties={properties}
        methods={methods}
        events={clarse.events}
      />

      {properties?.length > 0 && <h2>Properties</h2>}
      {properties?.map(p => (
        <Property key={scopedName(p)} prop={p} docs={docs} />
      ))}

      {methods?.length > 0 && <h2>Methods</h2>}
      {methods?.map(m => (
        <Method key={scopedName(m)} method={m} docs={docs} />
      ))}

      {clarse.events?.length > 0 && <h2>Events</h2>}
      {clarse.events?.map(e => (
        <Event key={`e-${e.name}`} event={e} docs={docs} />
      ))}
    </div>
  );
}
