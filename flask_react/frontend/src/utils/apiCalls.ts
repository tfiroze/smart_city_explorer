import { error } from "console";
import ILoginRequest from "../models/ILoginRequest";
import ILoginResults from "../models/ILoginResults";
import IRegisterRequest from "../models/IRegisterRequest";
import IRegisterResults from "../models/IRegisterResults";
import IForgotPasswordRequest from "../models/IForgotPasswordRequest";

class SmartCityApi {
	register = async function (
		request: IRegisterRequest
	) 
	: Promise<IRegisterResults>
	{
		console.log(request);
		

		try {
			const response =await fetch('https://csstudent09.ucd.ie' + "/api/register", {
				method: "POST",
				credentials: 'include',
				body: new URLSearchParams({...request}),
			});

			if (response.status === 200) {
				const data = await response.json();
				console.log('Register User Request Response: ', data)
				if (data?.valid) {
					return {
						valid: true,
						errorType: "0"
					};
				} else {
					return {
						valid: false,
						errorType: '1'
					};
				}
			} else {
				return {
					valid: false,
					errorType: '2'
				};
			}
		} catch (error) {
			console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}

	};

	verifyEmail = async function(email: string){
		  try {
			const response = await fetch('https://csstudent09.ucd.ie' + "/api/emails", {
				method: "POST",
				body: new URLSearchParams({email: email}),
				credentials: 'include'
			  });

			if (response.status === 200) {
				const data = await response.json();
				console.log('Verify Email Request Response: ', data)
				if (data?.valid) {
					return {
						valid: true,
						errorType: "0"
					};
				} else {
					return {
						valid: false,
						errorType: '1'
					};
				}
			} else {
				return {
					valid: false,
					errorType: '2'
				};
			}
		} catch (error) {
			console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}
	};

	login = async function (request: ILoginRequest): Promise<ILoginResults> {
		try {
			const response = await fetch('https://csstudent09.ucd.ie' + "/api/login", {
				method: "POST",
				body: new URLSearchParams({ ...request })
			});

			if (response.status === 200) {
				const data = await response.json();
				console.log('Login Request Response: ', data)
				if (data?.valid) {
					return {
						valid: true,
						token: data.token,
						tokenExpirationTime: data.tokenExpirationTime,
						errorType: "0"
					};
				} else {
					return {
						valid: false,
						errorType: '1'
					};
				}
			} else {
				return {
					valid: false,
					errorType: '2'
				};
			}
		} catch (error) {
			console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}
	};

	dashboard = async function (token: string) {
		console.log(token);

		try {
			const response = await fetch('https://csstudent09.ucd.ie' + "/api/users", {
				method: "GET",
				headers: {
					"token": token, // Add the token in the headers with the key "token"
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				console.log('User Dashbord Request Response: ', data)
					return {
					  valid: true,
					  token: token,
					  errorType: "0",
					  ...data
					};
			} else {
				  return {
					valid: false,
					errorType: '2'
				  };
			}
		} catch (error) {
			console.log(error);
			return {
			  valid: false,
			  errorType: '2'
			};
		}
	}

	getQuestionnaire = async function (token: string) {
		try {
			const response = await fetch('https://csstudent09.ucd.ie' + "/api/tripinfoquestionnaire", {
				method: "GET",
				headers: {
					"token": token, // Add the token in the headers with the key "token"
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				console.log('User Dashbord Request Response: ', data)
					return {
					  valid: true,
					  ...data
					};
			} else {
				  return {
					valid: false
				  };
			}
		} catch (error) {
			console.log(error);
			return {
			  valid: false,
			};
		}
	}

	verifyForgotPasswordEmail = async function(email: string){
		try {
		  const response = await fetch('https://csstudent09.ucd.ie' + "/api/captcha", {
			  method: "POST",
			  body: new URLSearchParams({email: email}),
			  credentials: 'include'
			});

		  if (response.status === 200) {
			  const data = await response.json();
			  console.log('Verify Forgot Password Captcha Request Response: ', data)
			  if (data?.valid) {
				  return {
					  valid: true,
					  errorType: "0"
				  };
			  } else {
				  return {
					  valid: false,
					  errorType: '1'
				  };
			  }
		  } else {
			  return {
				  valid: false,
				  errorType: '2'
			  };
		  }
	  } catch (error) {
		  console.log(error);
		  return {
			  valid: false,
			  errorType: '2'
		  };
	  }
  };

  forgotPassword = async function(request: IForgotPasswordRequest){
	console.log(request);
	
	try {
	  const response = await fetch('https://csstudent09.ucd.ie' + "/api/password", {
		  method: "POST",
		  body: new URLSearchParams({...request}),
		  credentials: 'include'
		});

	  if (response.status === 200) {
		  const data = await response.json();
		  console.log('Forgot Password Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0"
			  };
		  } else {
			  return {
				  valid: false,
				  errorType: '1'
			  };
		  }
	  } else {
		  return {
			  valid: false,
			  errorType: '2'
		  };
	  }
  } catch (error) {
	  console.log(error);
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};


};

// autoLogin = function(token:string) : ILoginResults{

// 	return {
// 		valid: true,
// 		firstName: "Thea",
// 		token:"fdeqefdwqfdwfd",
// 		dashboardData: [
// 			{
// 				date: new Date(),
// 				status: "pending",
// 				forecastedWeather: "Rainy",
// 				tags: ["Sushi", "Pizza", "Water"],
// 				venueId: "ce913c45-8ee5-454e-8369-ea38f9009b4b",
// 				venueName:"temp"
// 			},
// 		],
// 	};
// }

let smartApi = new SmartCityApi();

function setCookie(
	name: string,
	value: string | null | undefined,

) {
	const d = new Date();
	d.setTime(d.getTime() + 360 * 24 * 60 * 60 * 1000);
	let expires = d.toUTCString();
	document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export { smartApi }