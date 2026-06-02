import { Link } from "react-router";
import { parseLink } from "../../util";

export default function DocsSee({ see, docs }) {
  const parsed = see.map((s) => parseLink(s, docs));

  const renderItem = (item) => {
    if (typeof item.link === "object") {
      return (
        <Link to={item.link} className="docs-type">
          {item.text}
        </Link>
      );
    }

    if (typeof item.link === "string") {
      return <a href={item.link}>{item.text}</a>;
    }

    return <span>{item.text}</span>;
  };

  return (
    <p className="docs-see">
      See also:
      {see.length > 1 ? (
        <ul>
          {parsed.map((s) => (
            <li key={s.text}>{renderItem(s)}</li>
          ))}
        </ul>
      ) : (
        <span>{renderItem(parsed[0])}</span>
      )}
    </p>
  );
}
