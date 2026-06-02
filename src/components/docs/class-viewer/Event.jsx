import { Link, useLocation } from "react-router";
import ParamTable from "./ParamTable";
import SourceButton from "../SourceButton";
import See from "../See";
import { convertLinks } from "../../../util";
import Markdown from "marked-react";

export default function ClassEvent({ event, docs }) {
  const location = useLocation();
  return (
    <div className="class-event class-item" id={`doc-for-e-${event.name}`}>
      <SourceButton meta={event.meta} docs={docs} />

      <h3>
        <Link to={{ search: `?scrollTo=e-${event.name}` }}>{event.name}</Link>
      </h3>

      {event.deprecated && (
        <span
          className="badge warn"
          title="This event is deprecated, and may be removed in a future version."
        >
          Deprecated
        </span>
      )}

      <div className="class-item-details">
        <Markdown
          value={convertLinks(event.description, docs, null, {
            pathname: location.pathname,
            search: location.search,
          })}
        />

        {event.params?.length > 0 && (
          <ParamTable params={event.params} docs={docs} />
        )}

        {event.see && <See see={event.see} docs={docs} />}
      </div>
    </div>
  );
}
