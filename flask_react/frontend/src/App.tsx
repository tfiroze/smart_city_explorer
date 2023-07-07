import { ThemeProvider } from "@mui/material/styles";
import "./app.css"; // Import the CSS file
import { Login } from "./views/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/Dashboard";
import { ThemeContext } from "./utils/ApplicationContext";
import darkTheme from "./utils/Themes/darkTheme";
import lightTheme from "./utils/Themes/lightTheme";
import { AuthStack } from "./utils/AuthStack";
import './app.css';
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

function App() {
  const { isLoaded } = useLoadScript({
  // useLoadScript({
    googleMapsApiKey: "AIzaSyBDUEkaYex_MSMMPfoAAE_xYcFeKjzQigE",
    libraries: ["places"],
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const onThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#1B212A" : "#DAE0E6";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ onChange: onThemeChange, theme: theme }}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <BrowserRouter>
          <AuthStack />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
