import { error } from "console";
import ILoginRequest from "../models/ILoginRequest";
import ILoginResults from "../models/ILoginResults";
import IRegisterRequest from "../models/IRegisterRequest";
import IRegisterResults from "../models/IRegisterResults";

class SmartCityApi {
	register = function (
		request: IRegisterRequest,
		mockFail: Boolean = false
	) {
		// if (mockFail) {
		// 	return {
		// 		valid: false,
		// 		errorMessage: "Email already exists",
		// 	};
		// } else {
		// 	return {
		// 		valid: true
		// 	};
		// }

		fetch('http://127.0.0.1:5000' + "/api/emails", {
			method: "POST",
			body: new URLSearchParams({email: 'manish.salian@ucdconnect.ie'})
		  }).then(res => {
			console.log(res);
			if (res.status === 200) {
				res.json().then(data => {
				  console.log("autodata : ", data)
				//   return {
				// 	valid: true,
				// 	firstName: "Thea",
				// 	token:"8d40ff0c-6b52-42a8-a25d-6d3d5a6c4ab9",
				// 	refreshToken:'ce913c45-8ee5-454e-8369-ea38f9009b4b',
				// 	dashboardData: [
				// 		{
				// 			date: new Date(),
				// 			status: "pending",
				// 			forecastedWeather: "Rainy",
				// 			tags: ["Sushi", "Pizza", "Water"],
				// 			venueId: "ce913c45-8ee5-454e-8369-ea38f9009b4b",
				// 			venueName:"temp"
				// 		},
				// 	],
				// };
				});
			  }
			
			
		  }).catch(err=>{
			console.log(err);
		  });

		// fetch('http://127.0.0.1:5000' + "/api/register", {
		// 	method: "POST",
		// 	body: new URLSearchParams({
		// 		email:'manish.salian@ucdconnect.ie',
		// 		firstname: 'Manish',
		// 		surname:'Salian',
		// 		password:'lets@go',
		// 		captcha:'ldHy60'
		// 	})
		//   }).then(res => {
		// 	console.log(res);
		// 	if (res.status === 200) {
		// 		res.json().then(data => {
		// 		  console.log("autodata : ", data)
				  
		// 		});
		// 	  }
			
			
		//   }).catch(err=>{
		// 	console.log(err);
		//   });
		 
	};

	login = async function (request: ILoginRequest): Promise<ILoginResults> {
		console.log('API Called', request);
	  
		try {
		  const response = await fetch('http://127.0.0.1:5000' + "/api/login", {
			method: "POST",
			body: new URLSearchParams({...request})
		  });
	  
		  if (response.status === 200) {
			const data = await response.json();
			console.log('Login Request Response: ',data)
			if (data?.valid) {
			  return {
				valid: true,
				token: data.token,
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

	dashboard = async function(token: string){
		console.log(token);
		
		try {
			const response = await fetch('http://127.0.0.1:5000' + "/api/users", {
			  method: "GET",
			  headers: {
				"token": token, // Add the token in the headers with the key "token"
			  },
			});
		
			if (response.status === 200) {
			  const data = await response.json();
			  console.log('User Dashbord Request Response: ',data)
			//   if (data?.valid) {
			// 	return {
			// 	  valid: true,
			// 	  token: data.token,
			// 	  errorType: "0"
			// 	};
			//   } else {
			// 	return {
			// 	  valid: false,
			// 	  errorType: '1'
			// 	};
			//   }
			} else {
			//   return {
			// 	valid: false,
			// 	errorType: '2'
			//   };
			}
		  } catch (error) {
			console.log(error);
			// return {
			//   valid: false,
			//   errorType: '2'
			// };
		  }
	}


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

export {smartApi}