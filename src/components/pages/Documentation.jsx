import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useApp } from "../../Context";

import MainSource from "../../data/MainSource";
import CollectionSource from "../../data/CollectionSource";
import CommandoSource from "../../data/CommandoSource";
import RPCSource from "../../data/RPCSource";

import DocsNavbar from "../docs/Navbar";
import { Outlet } from "react-router";

export default function Documentation() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const sources = useMemo(
    () => ({
      [MainSource.id]: MainSource,
      // [CollectionSource.id]: CollectionSource,
      // [CommandoSource.id]: CommandoSource,
      // [RPCSource.id]: RPCSource,
    }),
    [],
  );

  const { currentSource, setCurrentSource, currentTag, setCurrentTag } = useApp();

  function handleRoute() {
    /* ---------- SOURCE ---------- */
    if (params.source && sources[params.source]) {
      setCurrentSource(sources[params.source]);
    } else {
      
      console.log("source")
      console.log(sources)
      console.log(params)
      navigate(
        `/docs/${currentSource.id}/${currentSource.defaultTag}/${currentSource.defaultFile.category}/${currentSource.defaultFile.id}`,
        { replace: true },
      );
      return;
    }

    /* ---------- TAG ---------- */
    if (params.tag) {
      setCurrentTag(params.tag);
      sources[params.source].recentTag = params.tag;
    } else {
      const src = sources[params.source];
      
      console.log("tag")
      navigate(
        `/docs/${src.id}/${src.recentTag || src.defaultTag}/${src.defaultFile.category}/${src.defaultFile.id}`,
        { replace: true },
      );
      return;
    }

    /* ---------- DEFAULT FILE ---------- */
    if (
      !params.file &&
      !params.className &&
      !params.typedef &&
      !location.pathname.includes("search")
    ) {
      
      console.log("default file")
      navigate(
        `/docs/${currentSource.id}/${currentTag}/${currentSource.defaultFile.category}/${currentSource.defaultFile.id}`,
        { replace: true },
      );
    }
  }

  useEffect(() => {
    handleRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, location.pathname]);

  return (
    <div id="docs">
      <DocsNavbar sources={Object.values(sources)} />
      <Outlet/>
    </div>
  );
}
