import ILoginRequest from "../models/ILoginRequest";
import ILoginResults from "../models/ILoginResults";
import IRegisterRequest from "../models/IRegisterRequest";
import IRegisterResults from "../models/IRegisterResults";

class SmartCityApi {
	register = function (
		request: IRegisterRequest,
		mockFail: Boolean = false
	): IRegisterResults {
		if (mockFail) {
			return {
				valid: false,
				errorMessage: "Email already exists",
			};
		} else {
			return {
				valid: true
			};
		}
	};

	login = function (
		request: ILoginRequest,
		mockFail: Boolean = false
	): ILoginResults {
		if (mockFail) {
			return { valid: false, };
		}

		return {
			valid: true,
			firstName: "Thea",
			token:"8d40ff0c-6b52-42a8-a25d-6d3d5a6c4ab9",
			refreshToken:'ce913c45-8ee5-454e-8369-ea38f9009b4b',
			dashboardData: [
				{
					date: new Date(),
					status: "pending",
					forecastedWeather: "Rainy",
					tags: ["Sushi", "Pizza", "Water"],
					venueId: "ce913c45-8ee5-454e-8369-ea38f9009b4b",
					venueName:"temp"
				},
			],
		};
	};

	autoLogin = function(token:string) : ILoginResults{
	
		return {
			valid: true,
			firstName: "Thea",
			token:"fdeqefdwqfdwfd",
			dashboardData: [
				{
					date: new Date(),
					status: "pending",
					forecastedWeather: "Rainy",
					tags: ["Sushi", "Pizza", "Water"],
					venueId: "ce913c45-8ee5-454e-8369-ea38f9009b4b",
					venueName:"temp"
				},
			],
		};
	}
}

let smartApi = new SmartCityApi();

export {smartApi}