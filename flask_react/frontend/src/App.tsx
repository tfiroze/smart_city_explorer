import { ThemeProvider } from "@mui/material/styles";
import "./app.css"; // Import the CSS file
import { Login } from "./views/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/Dashboard";
import {
	AuthContext,
	IUserInfo,
	ThemeContext,
} from "./utils/ApplicationContext";
import darkTheme from "./utils/Themes/darkTheme";
import lightTheme from "./utils/Themes/lightTheme";
import { useState } from "react";
import { Startup } from "./views/Startup";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Questionnaire } from "./views/Questionnaire";

function App() {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: "AIzaSyBDUEkaYex_MSMMPfoAAE_xYcFeKjzQigE",
		libraries: ["places"],
	});

	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [authed, setAuthed] = useState(false);
	const [userInfo, setuserInfo] = useState<IUserInfo | null>({
		name: "Thea",
		userUid: "18w79-d322d-1221-2238u89",
	});

	const onThemeChange = () => {
		if (theme === "light") {
			setTheme("dark");
			document.body.style.backgroundColor = "#26262c";

		} else {
			setTheme("light");
			document.body.style.backgroundColor = "#DAE0E6";
		}
	};

	const authenticate = (userInfo: IUserInfo) => {
		setAuthed(authed ? false : true);
		setuserInfo(userInfo);
		if (theme === "dark") {
			document.body.style.backgroundColor = "#26262c";

		} else {
			document.body.style.backgroundColor = "#DAE0E6";
		}
		document.body.style.backgroundImage = `URL()`;
	};

	return (
		<ThemeContext.Provider value={{ onChange: onThemeChange, theme: theme }}>
			<AuthContext.Provider
				value={{
					authenticated: authed,
					authenticate: authenticate,
					userInfo: userInfo,
				}}
			>
				<ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
					<BrowserRouter>
						<Routes>
							{authed ? (
								<Route path="*" Component={Dashboard} />
							) : (
								<>
									{/* <Route path="*" Component={Startup} /> */}
									<Route path="*" Component={Questionnaire} />
								</>


							)}
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</AuthContext.Provider>
		</ThemeContext.Provider>
	);
}

export default App;
