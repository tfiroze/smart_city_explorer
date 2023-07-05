import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState, useContext } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { BrowserRouter } from "react-router-dom";
import { ThemeContext } from "./utils/ApplicationContext";
import { AuthContext } from "./utils/AuthContext";
import darkTheme from "./utils/Themes/darkTheme";
import lightTheme from "./utils/Themes/lightTheme";
import { AuthStack } from "./utils/AuthStack";

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBDUEkaYex_MSMMPfoAAE_xYcFeKjzQigE",
    libraries: ["places"],
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const themeContext = useContext(ThemeContext);

  const onThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#26262c" : "#DAE0E6";
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
