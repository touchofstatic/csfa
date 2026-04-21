import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeContext } from "./components/Contexts";
import Manager from "./components/Manager.jsx";

export default function App() {
  // Themes feature. Current theme name is set in localstorage
  const [theme, setTheme] = useState(() => {
    const loadTheme = JSON.parse(localStorage.getItem("theme"));
    return loadTheme || "colder-nord";
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  function changeTheme(theme) {
    setTheme(theme);
  }

  return (
    <>
      {/* Helmet is used because our themes functionality is provided by webtui,
      where the theme is set by data-webtui-theme attribute in <html>,
      and Helmet allows to modify and pass props to index.html in React */}
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
