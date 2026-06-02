import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import Slide from "../Slide";
import Loading from "../Loading";
import { useApp } from "../../Context";
import { useOutletContext } from "react-router";

export default function DocsLoader() {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  const [loadingTag, setLoadingTag] = useState(null);

  const location = useLocation();
  const prevRouteRef = useRef(null);

  const { setCurrentRepository: setRepository } = useApp();
  
  const {currentSource: source, currentTag: tag} = useApp();

  /* ------------------ LOAD DOCS ------------------ */

  const loadDocs = async () => {
    if (loadingTag === tag) return;

    setDocs(null);
    setError(null);
    setLoadingTag(tag);
    setRepository(source.repo);

    const startSource = source;
    const startTag = tag;

    try {
      const docsData = await source.fetchDocs(tag);

      if (source !== startSource || tag !== startTag) return;

      // Sort
      docsData.classes?.sort((a, b) => a.name.localeCompare(b.name));
      docsData.typedefs?.sort((a, b) => a.name.localeCompare(b.name));

      for (const c of docsData.classes || []) {
        c.props?.sort((a, b) => a.name.localeCompare(b.name));
        c.methods?.sort((a, b) => a.name.localeCompare(b.name));
        c.events?.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Built-in links
      docsData.links = {
        string:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
        number:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        boolean:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
        symbol:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",
        void: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
        Object:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
        Function:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function",
        function:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function",
        Array:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        Set: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
        Map: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
        Date: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
        RegExp:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
        Promise:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
        Error:
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error",
        EventEmitter:
          "https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter",
      };

      docsData.externals = docsData.externals || [];
      docsData.classes = docsData.classes || [];
      docsData.typedefs = docsData.typedefs || [];

      for (const x of docsData.externals) {
        docsData.links[x.name] = x.see[0].replace(
          /\{@link\s+(.+?)\s*\}/i,
          "$1",
        );
      }

      for (const c of docsData.classes) {
        docsData.links[c.name] = {
          name: "docs-class",
          params: { class: c.name },
        };
      }

      for (const t of docsData.typedefs) {
        docsData.links[t.name] = {
          name: "docs-typedef",
          params: { typedef: t.name },
        };
      }

      if (source.id === "commando") {
        docsData.links.Message = {
          name: "docs-class",
          params: { source: "main", tag: "master", class: "Message" },
        };
      }

      docsData.global = source.global;
      docsData.source = source.source;
      docsData.tag = tag;

      setDocs(docsData);
      setLoadingTag(null);

      updatePageTitle(location, docsData);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoadingTag(null);
    }
  };

  /* ------------------ SCROLL ------------------ */

  const scroll = (fromRoute) => {
    if (!docs) return;

    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (!scrollTo) return;

    const el =
      document.getElementById(`doc-for-${scrollTo}`) ||
      document.getElementById(`doc-for-e-${scrollTo}`) ||
      document.getElementById(scrollTo);

    if (!el) return;

    el.setAttribute("data-scrolled", "true");
    setTimeout(() => el.removeAttribute("data-scrolled"), 2000);

    el.scrollIntoView();
    window.scrollBy(0, -50);
  };

  /* ------------------ TITLE ------------------ */

  const updatePageTitle = (loc, docsData = docs) => {
    if (!docsData) {
      document.title = "discord.js";
      return;
    }
    document.title = "discord.js";
  };

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    loadDocs();
  }, [source, tag]);

  useEffect(() => {
    if (docs) setTimeout(scroll, 700);
  }, [docs]);

  useEffect(() => {
    scroll(prevRouteRef.current);
    prevRouteRef.current = location;
  }, [location]);

  /* ------------------ RENDER ------------------ */
  
  return (
    <div id="docs-body">
      {docs ? (
        <Outlet
          context={{
            docs,
          }}
        />
      ) : (
        <Slide>
          {!error ? (
            <Loading />
          ) : (
            <p id="docs-error">
              Couldn't load the documentation data.
              <pre>{error.toString()}</pre>
            </p>
          )}
        </Slide>
      )}
    </div>
  );
}
