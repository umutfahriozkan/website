import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { Link, useLocation } from "react-router";
import { useApp } from "../../Context";
import { useParams } from "react-router";

export default function DocsSidebar({ onShowPrivate }) {
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  const {docs} = useOutletContext();

  const{darkMode, toggleDarkMode} = useApp();

  const { source, tag} = useParams();

  /* ------------------ FILTERING ------------------ */

  const visibleClasses = useMemo(() => {
    return showPrivate
      ? docs.classes
      : docs.classes.filter((c) => c.access !== "private");
  }, [docs, showPrivate]);

  const visibleTypedefs = useMemo(() => {
    return showPrivate
      ? docs.typedefs
      : docs.typedefs.filter((t) => t.access !== "private");
  }, [docs, showPrivate]);

  /* ------------------ LABELS ------------------ */

  const togglePrivateLabel = `Private items are ${
    showPrivate ? "shown" : "hidden"
  }. Click to toggle.`;

  const toggleDarkModeLabel = `The lights are ${
    darkMode ? "off" : "on"
  }. Click to toggle.`;

  /* ------------------ SIDE EFFECTS ------------------ */

  // Emit showPrivate changes (Vue watcher equivalent)
  useEffect(() => {
    onShowPrivate?.(showPrivate);
  }, [showPrivate, onShowPrivate]);

  // Route change watcher
  useEffect(() => {
    if (visible) setVisible(false);

    if (
      !location.search.includes("scrollTo") &&
      (window.pageYOffset || document.documentElement.scrollTop) > 300
    ) {
      window.scrollTo(0, 90);
    }
  }, [location]);

  /* ------------------ RENDER ------------------ */

  return (
    <div id="docs-sidebar">
      <div id="open-btn" onClick={() => setVisible(true)}>
        <em className="fa fa-bars" />
      </div>

      <div
        id="docs-sidebar-content"
        className={visible ? "open" : "closed"}
      >
        <div id="close-btn" onClick={() => setVisible(false)}>
          <em className="fa fa-arrow-left" aria-hidden="true" />
        </div>

        <em
          id="docs-visibility"
          className={`fa toggle ${
            showPrivate ? "fa-eye" : "fa-eye-slash"
          }`}
          title={togglePrivateLabel}
          onClick={() => setShowPrivate((v) => !v)}
        />

        <em
          id="docs-brightness"
          className={`fa toggle ${
            darkMode ? "fa-moon-o" : "fa-sun-o"
          }`}
          title={toggleDarkModeLabel}
          onClick={toggleDarkMode}
        />

        <ul>
          {Object.entries(docs.custom).map(([categoryID, category]) => (
            <li key={categoryID}>
              {category.name}
              <ul>
                {Object.entries(category.files).map(([fileID, file]) => (
                  <li key={fileID}>
                    <Link
                      to={`/docs/${categoryID}/${fileID}`}
                    >
                      {file.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {visibleClasses.length > 0 && (
            <li>
              Classes
              <ul className="animated-list">
                {visibleClasses.map((clarse) => (
                  <li
                    key={clarse.name}
                    className="animated-list-item"
                  >
                    <Link to={`/docs/${source}/${tag}/class/${clarse.name}`}>
                      {clarse.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          {visibleTypedefs.length > 0 && (
            <li>
              Typedefs
              <ul>
                {visibleTypedefs.map((typedef) => (
                  <li key={typedef.name}>
                    <Link to={`/docs/${source}/${tag}/typedef/${typedef.name}`}>
                      {typedef.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
