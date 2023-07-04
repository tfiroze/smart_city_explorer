import { ThemeProvider } from "@mui/material/styles";
import "./app.css"; // Import the CSS file
import { Login } from "./views/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/Dashboard";
import {
	ThemeContext,
} from "./utils/ApplicationContext";
import {
	AuthContext,
	IUserInfo,
} from "./utils/AuthContext"
import darkTheme from "./utils/Themes/darkTheme";
import lightTheme from "./utils/Themes/lightTheme";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import { Startup } from "./views/Startup";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Questionnaire } from "./views/Questionnaire";
import { smartApi } from "./utils/apiCalls";
import { AuthStack } from "./utils/AuthStack";

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
		email: ""
	});
	const authContext = useContext(AuthContext);

	const onThemeChange = () => {
		if (theme === "light") {
			setTheme("dark");
			document.body.style.backgroundColor = "#26262c";

		} else {
			setTheme("light");
			document.body.style.backgroundColor = "#DAE0E6";
		}
	};

	// const authenticate = (userInfo: IUserInfo) => {
	// 	setAuthed(authed ? false : true);
	// 	setuserInfo(userInfo);
	// 	if (theme === "dark") {
	// 		document.body.style.backgroundColor = "#26262c";

	// 	} else {
	// 		document.body.style.backgroundColor = "#DAE0E6";
	// 	}
	// 	document.body.style.backgroundImage = `URL()`;
	// };

	// useEffect(() => {
	// 	let name = "AuthToken=";
	// 	let ca = document.cookie.split(';');
	// 	for (let i = 0; i < ca.length; i++) {
	// 		let c = ca[i];
	// 		while (c.charAt(0) == ' ') {
	// 			c = c.substring(1);
	// 		}
	// 		if (c.indexOf(name) == 0) {
	// 			let token = c.substring(name.length, c.length);
	// 			let results = smartApi.autoLogin(token)
	// 			if (results.valid) {
	// 				authContext.authenticate({
	// 					first_name: "string",
	// 					last_name: "string",
	// 					userUid: "string",
	// 					email: "string",
	// 				});
	// 			}
	// 		}
	// 	}
	// }, [])

	return (
		<ThemeContext.Provider value={{ onChange: onThemeChange, theme: theme }}>
			<ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
				<AuthStack />
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}

export default App;
