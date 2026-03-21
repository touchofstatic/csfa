import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeContext } from "./components/Contexts";
import Manager from "./components/Manager.jsx";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const loadTheme = JSON.parse(localStorage.getItem("theme"));
    return loadTheme || "gruvbox-dark-medium";
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  function changeTheme(theme) {
    setTheme(theme);
  }

  return (
    <>
      <HelmetProvider>
        <Helmet htmlAttributes>
          <html data-webtui-theme={theme} />
        </Helmet>
      </HelmetProvider>

      <main>
        <ThemeContext.Provider value={{ theme, changeTheme }}>
          <Manager />
        </ThemeContext.Provider>
      </main>
    </>
  );
}
