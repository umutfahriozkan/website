import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams, useOutletContext } from "react-router";
import Sidebar from "./Sidebar";
import Container from "../Container";

export default function DocsViewer() {
  const [showPrivate, setShowPrivate] = useState(false);
  const params = useParams();

  const { docs } = useOutletContext();

  /* ------------------ KEY (router-view :key) ------------------ */

  const key = useMemo(() => {
    if (params.file) return `${params.category}/${params.file}`;
    if (params.search) return "search";
    return params.className || params.typedef;
  }, [params]);

  /* ------------------ SCROLL TOP BUTTON ------------------ */

  useEffect(() => {
    const scroller = document.getElementById("scroll-top");
    if (!scroller) return;

    let hideTimeout;
    let showTimeout;

    const showListener = () => {
      if ((window.pageYOffset || document.documentElement.scrollTop) > 300) {
        clearTimeout(hideTimeout);
        clearTimeout(showTimeout);
        scroller.style.display = "block";
        showTimeout = setTimeout(() => {
          scroller.style.opacity = "1";
        }, 20);
        window.removeEventListener("scroll", showListener);
        window.addEventListener("scroll", hideListener);
      }
    };

    const hideListener = () => {
      if ((window.pageYOffset || document.documentElement.scrollTop) < 300) {
        clearTimeout(hideTimeout);
        clearTimeout(showTimeout);
        scroller.style.opacity = "0";
        hideTimeout = setTimeout(() => {
          scroller.style.display = "none";
        }, 1000);
        window.removeEventListener("scroll", hideListener);
        window.addEventListener("scroll", showListener);
      }
    };

    window.addEventListener("scroll", showListener);

    return () => {
      window.removeEventListener("scroll", showListener);
      window.removeEventListener("scroll", hideListener);
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
    };
  }, []);

  /* ------------------ HELPERS ------------------ */

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div id="docs-viewer">
      <Container>
        <Sidebar
          onShowPrivate={setShowPrivate}
        />

        {/* Transition intentionally omitted (same behavior, simpler) */}
        <Outlet
          key={key}
          context={{
            showPrivate,
            docs
          }}
        />
      </Container>

      <div id="docs-meta">
        <p>
          Documentation built at{" "}
          {new Date(docs.meta.date).toUTCString()}.
          <br />
          Generator: v{docs.meta.generator} &nbsp; Format:{" "}
          {docs.meta.format}
        </p>
      </div>

      <div
        id="scroll-top"
        title="Scroll to top"
        onClick={scrollTop}
      >
        <em className="fa fa-arrow-up" />
      </div>
    </div>
  );
}
