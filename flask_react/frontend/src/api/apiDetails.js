// import axios from "axios"; // library to help make API calls

// const getPlacesData = async () => {
// 	try {
// 		const response = await axios.get();
// 		// request (if successful, code runs)
// 	} catch (error) {}
// };
import axios from "axios";

// const URL =
// 	"https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary"; // change

// const options = {
// 	params: {
// 		// change from static :/
// 		bl_latitude: "11.847676",
// 		tr_latitude: "12.838442",
// 		bl_longitude: "109.095887",
// 		tr_longitude: "109.149359",
// 		// restaurant_tagcategory_standalone: "10591",
// 		// restaurant_tagcategory: "10591",
// 		// limit: "30",
// 		// currency: "USD",
// 		// open_now: "false",
// 		// lunit: "km",
// 		// lang: "en_US",
// 	},
// 	headers: {
// 		"X-RapidAPI-Key": "56ada39b28msh66de501f48b72dcp1aad6ejsnd55b28aaab10",
// 		"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
// 	},
// };

export const getPlacesData = async (type, sw, ne) => {
	try {
		const {
			data: { data },
		} = await axios.get(
			`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, // dynamic, not only receive restaurants
			{
				params: {
					// change from static :/
					bl_latitude: sw.lat,
					tr_latitude: ne.lat,
					bl_longitude: sw.lng,
					tr_longitude: ne.lng,
					// restaurant_tagcategory_standalone: "10591",
					// restaurant_tagcategory: "10591",
					// limit: "30",
					// currency: "USD",
					// open_now: "false",
					// lunit: "km",
					// lang: "en_US",
				},
				headers: {
					"X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
				},
			}
		);
		// request (if successful, code runs)
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const getWeatherData = async (lat, lng) => {
	try {
		const { data } = await axios.get(
			"https://ai-weather-by-meteosource.p.rapidapi.com/current",
			{
				params: {
					lat: lat,
					lon: lng,
					// timezone: "auto",
					// language: "en",
					// units: "auto",
				},
				headers: {
					"X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
					"X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
				},
			}
		);
		return data;
	} catch (error) {
		console.log(error);
	}
};

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }
