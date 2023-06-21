import { createTheme } from "@mui/system";
import { ThemeProvider } from "styled-components";
import "./app.css"; // Import the CSS file
import { Login } from "./views/login/Login";



const theme = createTheme({
	palette: {
		primary: {
			main: "#3f51b5",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Login />
		</ThemeProvider>
	);
}

export default App;
