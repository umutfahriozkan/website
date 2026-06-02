import { useOutletContext } from "react-router";
import { sourceURL } from "../../util";

export default function SourceButton({ meta, path }) {

  const {docs} = useOutletContext();

  const buildSourceURL = (path, file, line) =>
    sourceURL(docs.source, docs.tag, path, file, line);

  const href = meta
    ? buildSourceURL(meta.path, meta.file, meta.line)
    : buildSourceURL(path);

  return (
    <div className="source-button">
      <a href={href} title="Source">
        <em className="fa fa-code" />
      </a>
    </div>
  );
}