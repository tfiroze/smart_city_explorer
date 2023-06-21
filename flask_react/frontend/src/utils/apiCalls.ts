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
			return { valid: false };
		}

		return {
			valid: true,
			firstName: "Thea",
			dashboardData: [
				{
					date: new Date(),
					status: "pending",
					forecastedWeather: "Rainy",
					tags: ["Sushi", "Pizza", "Water"],
					venueId: "ce913c45-8ee5-454e-8369-ea38f9009b4b",
					venueName: "Oishi Bay",
				},
			],
		};
	};
}

let smartApi = new SmartCityApi();

export {smartApi}