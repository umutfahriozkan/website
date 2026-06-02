export default function UnknownPage({ type }) {
  return (
    <div>
      <h1>Unknown {type || "page"}</h1>

      <p>This page doesn't actually exist. Oh no!</p>
    </div>
  );
}
