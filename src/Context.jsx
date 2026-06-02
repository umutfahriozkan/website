import { createContext, useContext, useEffect, useState } from "react";
import MainSource from "./data/MainSource";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("dark-mode");
    return stored !== "false" && stored !== null;
  });

  const [showPrivate, setPrivate] = useState(() => {
    const stored = localStorage.getItem("show-private");
    return stored !== "false" && stored !== null;
  });

  const [currentSource, setCurrentSource] = useState(MainSource);
  const [currentRepository, setCurrentRepository] = useState(MainSource.repo);
  const [currentTag, setCurrentTag] = useState(MainSource.defaultTag)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);
  const togglePrivate = () => setPrivate(x => !x);

  return (
    <AppContext.Provider
      value={{
        darkMode, setDarkMode, toggleDarkMode,
        showPrivate, setPrivate, togglePrivate,
        currentSource, setCurrentSource,
        currentRepository, setCurrentRepository,
        currentTag, setCurrentTag
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
