import { useEffect, useRef, useState } from "react";

const noop = () => {};
const json = (res) => res.json();

export default function Stats() {
  const fetchingRef = useRef(false);

  const [downloads, setDownloads] = useState(
    `${(6_500_000).toLocaleString()}+`
  );
  const [stars, setStars] = useState(
    `${(6_500).toLocaleString()}+`
  );
  const [contributors, setContributors] = useState("100+");

  useEffect(() => {
    async function fetchStats() {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      const [downloadsRes, starsRes, contributorsRes] = await Promise.all([
        fetch(
          "https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js"
        ).then(json, noop),
        fetch(
          "https://api.github.com/repos/discordjs/discord.js"
        ).then(json, noop),
        fetch(
          "https://api.github.com/repos/discordjs/discord.js/stats/contributors"
        ).then(json, noop),
      ]);

      if (downloadsRes?.downloads) {
        let total = 0;
        for (const item of downloadsRes.downloads) {
          total += item.downloads;
        }
        setDownloads(total.toLocaleString());
      }

      if (starsRes?.stargazers_count != null) {
        setStars(starsRes.stargazers_count.toLocaleString());
      }

      if (Array.isArray(contributorsRes)) {
        setContributors(contributorsRes.length.toLocaleString());
      }
    }

    fetchStats();
  }, []);

  return (
    <ul className="stats">
      <li>{downloads} downloads</li>
      <li>{stars} stars</li>
      <li>{contributors} contributors</li>
    </ul>
  );
}