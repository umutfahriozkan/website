import { Link } from "react-router";

export default function TypeLink({ docs, type }) {
  const typeName = type[0] === "function" ? "Function" : type[0];

  const link = docs?.links?.[type[0]] ?? null;

  return (
    <span className="docs-type-link">
      {!link && (
        <span title={type[0] === "*" ? "Any type" : undefined}>
          {typeName}
        </span>
      )}

      {link && typeof link === "object" && (
        <Link to={link}>{typeName}</Link>
      )}

      {link && typeof link === "string" && (
        <a href={link}>{typeName}</a>
      )}

      {type[1] && <span>{type[1]}</span>}
    </span>
  );
}