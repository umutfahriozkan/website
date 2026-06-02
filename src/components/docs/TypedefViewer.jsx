import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { marked } from "marked";

import { hljs, convertLinks, typeKey } from "../../util";
import Types from "./Types";
import ParamTable from "./class-viewer/ParamTable";
import SourceButton from "./SourceButton";
import See from "./See";
import UnknownPage from "../UnknownPage";
import { useOutletContext } from "react-router";
import { useApp } from "../../Context";

export default function TypedefViewer() {
  const { typedef: typedefName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {docs} = useOutletContext();
  const{darkMode} = useApp();
  /* ------------------ TYPEDEF LOOKUP ------------------ */

  const typedef = useMemo(
    () => docs.typedefs.find((t) => t.name === typedefName) || null,
    [docs, typedefName]
  );

  /* ------------------ MARKDOWN ------------------ */

  const description = useMemo(() => {
    if (!typedef?.description) return "";
    return marked(
      convertLinks(
        typedef.description,
        docs,
        navigate,
        location
      )
    );
  }, [typedef, docs, navigate, location]);

  const returnsDescription = useMemo(() => {
    if (!typedef?.returns?.description) return "";
    return marked(
      convertLinks(
        typedef.returns.description,
        docs,
        navigate,
        location
      )
    );
  }, [typedef, docs, navigate, location]);

  /* ------------------ HIGHLIGHT.JS ------------------ */

  useEffect(() => {
    if (!typedef) return;
    document
      .querySelectorAll("#typedef-viewer pre code")
      .forEach((el) => hljs(el));
  }, [typedef, description, returnsDescription]);

  /* ------------------ FALLBACK ------------------ */

  if (!typedef) {
    return <UnknownPage className="docs-page" darkMode={darkMode} />;
  }

  /* ------------------ RENDER ------------------ */

  return (
    <div id="typedef-viewer" className="docs-page">
      <SourceButton meta={typedef.meta} docs={docs} />

      <h1>{typedef.name}</h1>

      {typedef.deprecated && (
        <span
          className="badge warn"
          title="This typedef is deprecated, and may be removed in a future version."
        >
          Deprecated
        </span>
      )}

      {typedef.description && (
        <p
          className="typedef-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {typedef.see && <See see={typedef.see} docs={docs} />}

      <h2>Types</h2>
      <ul id="typedef-types">
        {typedef.type.map((type) => (
          <li key={typeKey(type)}>
            <Types names={type} docs={docs} />
          </li>
        ))}
      </ul>

      {typedef.props?.length > 0 && (
        <div id="typedef-props">
          <h2>Properties</h2>
          <ParamTable params={typedef.props} docs={docs} />
        </div>
      )}

      {typedef.params?.length > 0 && (
        <div id="typedef-params">
          <h2>Parameters</h2>
          <ParamTable params={typedef.params} docs={docs} />
        </div>
      )}

      {typedef.returns && (
        <div id="typedef-returns">
          <h2>Returns</h2>

          <p id="typedef-returns-types">
            {(typedef.returns.types || typedef.returns).map((rtrn) => (
              <Types
                key={typeKey(rtrn)}
                names={rtrn}
                variable={typedef.returns.variable}
                nullable={typedef.returns.nullable}
                docs={docs}
              />
            ))}
          </p>

          {typedef.returns.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: returnsDescription,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
