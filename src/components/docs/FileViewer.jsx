import { useEffect, useMemo } from "react";
import { useParams, useOutletContext } from "react-router";

import { hljs, renderMarkdown } from "../../util";
import SourceButton from "./SourceButton";
import UnknownPage from "../UnknownPage";

export default function FileViewer() {
  const { category, file: fileId } = useParams();
  const { docs } = useOutletContext();
  
  /* ------------------ FILE RESOLUTION ------------------ */

  const file = useMemo(() => {
    const cat = docs.custom?.[category];
    if (!cat) return null;
    return cat.files?.[fileId] ?? null;
  }, [docs, category, fileId]);

  /* ------------------ MARKDOWN → HTML ------------------ */

  const html = useMemo(() => {
    if (!file) return "";

    let content;
    if (file.type === "md") {
      content = file.content;
    } else {
      content = `# ${file.name}\n\`\`\`${file.type}\n${file.content}\n\`\`\``;
    }

    return renderMarkdown(content);
  }, [file]);

  /* ------------------ HIGHLIGHT.JS ------------------ */

  useEffect(() => {
    if (!file) return;

    const blocks = document.querySelectorAll("#file-viewer pre code");
    for (const el of blocks) hljs(el);
  }, [html, file]);

  /* ------------------ RENDER ------------------ */

  if (!file) {
    return (
      <UnknownPage
        className="docs-page"
      />
    );
  }

  return (
    <div id="file-viewer" className="docs-page">
      <SourceButton path={file.path} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
