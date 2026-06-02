import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Link, Outlet, useMatches, useLocation, useNavigationType } from "react-router";
import DocumentationPage from "./components/pages/Documentation";
import DocsLoader from "./components/docs/Loader";
import DocsViewer from "./components/docs/Viewer";
import FileViewer from "./components/docs/FileViewer";
import ClassViewer from "./components/docs/class-viewer/ClassViewer";
import TypedefViewer from "./components/docs/TypedefViewer";
import DocsSearch from "./components/docs/Search";
import "./styles/master.scss";
import { AppProvider, useApp } from "./Context";
import Container from "./components/Container";
import Stats from "./components/Stats";
import { Navigate } from "react-router";
import MainSource from "./data/MainSource"

/* Register filters
Vue.filter('marked', text => {
  if (!text) text = '**Documentation missing.**';
  text = marked(text);
  return text.replace(/<(info|warn)>([\s\S]+)<\/\1>/gi, '<div class="$1">$2</div>');
});
*/

function Layout() {
  const { darkMode, toggleDarkMode, repository } = useApp();
  return (
    <>
      <header>
        <Container>
          <Link to="/">discord.js</Link>

          <nav>
            <Link to="/docs">Documentation</Link>
            <a href={`https://github.com/${repository}`}>GitHub</a>
            <a href="https://discordjs.guide/">Guide</a>
          </nav>
        </Container>
      </header>
      <Outlet />
      <footer>
        <Container>
          <strong>
            <Link to="/">discord.js</Link>
          </strong>
          <p>A powerful library for interacting with the Discord API</p>
          <Stats />
          <a href="" id="dark-mode-link" onClick={toggleDarkMode}>
            <em className={darkMode ? "fa fa-sun-o" : "fa fa-moon-o"}></em>
            Turn {darkMode ? "on" : "off"} the lights
          </a>
        </Container>

        <div id="site-meta">
          <div id="site-meta-label">&pi;</div>
          commit: {GIT_COMMIT_HASH}
          <br />
          built at: {new Date(BUILT_AT).toUTCString()}
        </div>
      </footer>
    </>
  );
}
// 


function MatchLogger() {
  const matches = useMatches();

  useEffect(() => {
    console.log(
      '[matches]',
      matches.map(m => m.route.path || '(index)')
    );
  }, [matches]);

  return null;
}

function RouteLogger() {
  const location = useLocation();
  const navType = useNavigationType(); // PUSH | POP | REPLACE

  useEffect(() => {
    console.log(
      '[router]',
      navType,
      location.pathname,
      location.search
    );
  }, [location, navType]);

  return null;
}

ReactDOM.createRoot(document.body).render(
    <BrowserRouter>
    
  <RouteLogger />
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
          <Route path="*"  element={<Navigate to="/docs/" replace />} />
            <Route path="docs" element={<DocumentationPage />}>
              <Route path=":source" element={<DocsLoader />}>
                <Route path=":tag" element={<DocsViewer />}>
                  <Route path="search" element={<DocsSearch />} />
                  <Route path="class/:className" element={<ClassViewer />} />
                  <Route path="typedef/:typedef" element={<TypedefViewer />} />
                  <Route path=":category/:file" element={<FileViewer />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
);
