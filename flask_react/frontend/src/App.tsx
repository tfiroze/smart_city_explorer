import { ThemeProvider } from "@mui/material/styles";
import "./app.css"; // Import the CSS file
import { Login } from "./views/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/Dashboard";
import { ThemeContext } from "./utils/ApplicationContext";
import { AuthContext, IUserInfo } from "./utils/AuthContext";
import darkTheme from "./utils/Themes/darkTheme";
import lightTheme from "./utils/Themes/lightTheme";
import { useEffect, useState } from "react";
import { Startup } from "./views/Startup";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Questionnaire } from "./views/Questionnaire";
import { smartApi } from "./utils/apiCalls";

function App() {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: "AIzaSyBDUEkaYex_MSMMPfoAAE_xYcFeKjzQigE",
		libraries: ["places"],
	});

	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [authed, setAuthed] = useState(false);
	const [userInfo, setuserInfo] = useState<IUserInfo | null>({
		first_name: "",
		last_name: "",
		userUid: "",
		email: "",
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

	useEffect(() => {
		let name = "AuthToken=";
		let ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				let token = c.substring(name.length, c.length);
				let results = smartApi.autoLogin(token);
				if (results.valid) {
					authenticate({
						email: "",
						first_name: "",
						last_name: "",
						userUid: "",
					});
				}
			}
		}
	}, []);

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
					token: null,
				}}
			>
				<ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
					<BrowserRouter>
						<Routes>
							{authed ? (
								<>
									<Route path="*" Component={Dashboard} />
									<Route path="*" Component={Questionnaire} />
								</>
							) : (
								<>
									<Route path="*" Component={Startup} />
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
