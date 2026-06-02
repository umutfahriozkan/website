import TypeLink from "./TypeLink";
import { typeKey } from "../../util";

export default function Types({
  names = [],
  variable = false,
  nullable = false,
  docs,
}) {
  return (
    <span className="docs-type">
      {nullable && "?"}
      {variable && "..."}
      {names.map((type) => (
        <TypeLink
          key={typeKey(type)}
          type={type}
          docs={docs}
        />
      ))}
    </span>
  );
}