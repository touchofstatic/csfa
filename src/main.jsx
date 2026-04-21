import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/themesdefault.css";
import "./styles/themescustom.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
