import { error } from "console";
import ILoginRequest from "../models/ILoginRequest";
import ILoginResults from "../models/ILoginResults";
import IRegisterRequest from "../models/IRegisterRequest";
import IRegisterResults from "../models/IRegisterResults";
import IForgotPasswordRequest from "../models/IForgotPasswordRequest";
import { api } from "./utility_func";

class SmartCityApi {
	register = async function (
		request: IRegisterRequest
	) 
	: Promise<IRegisterResults>
	{
		
		try {
			const response =await fetch(api + "/api/register", {
				method: "POST",
				credentials: 'include',
				body: new URLSearchParams({...request}),
			});

			if (response.status === 200) {
				const data = await response.json();
				// console.log('Register User Request Response: ', data)
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
			// console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}

	};

	verifyEmail = async function(email: string){
		  try {
			const response = await fetch(api + "/api/emails", {
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
			// console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}
	};

	login = async function (request: ILoginRequest): Promise<ILoginResults> {
		try {
			const response = await fetch(api + "/api/login", {
				method: "POST",
				body: new URLSearchParams({ ...request })
			});

			if (response.status === 200) {
				const data = await response.json();
				// console.log('Login Request Response: ', data)
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
			// console.log(error);
			return {
				valid: false,
				errorType: '2'
			};
		}
	};

	dashboard = async function (token: string) {
		// console.log(token);

		try {
			const response = await fetch(api + "/api/users", {
				method: "GET",
				headers: {
					"token": token, // Add the token in the headers with the key "token"
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				// console.log('User Dashbord Request Response: ', data)
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
			// console.log(error);
			return {
			  valid: false,
			  errorType: '2'
			};
		}
	}

	allTrips = async function (user_id: string) {
		try {
			const response = await fetch(api + `/api/trips/all/${user_id}`, {
				method: "GET",
			});
			if (response.status === 200) {
				const data = await response.json();
				// console.log('All Trips Request Response: ', data)
					return {
					  valid: true,
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
			// console.log(error);
			return {
			  valid: false,
			  errorType: '2'
			};
		}
	}

	getQuestionnaire = async function (token: string) {
		try {
			const response = await fetch(api + "/api/tripinfoquestionnaire", {
				method: "GET",
				headers: {
					"token": token, // Add the token in the headers with the key "token"
				},
			});
			if (response.status === 200) {
				const data = await response.json();
				// console.log('User Dashbord Request Response: ', data)
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
			// console.log(error);
			return {
			  valid: false,
			};
		}
	}

	verifyForgotPasswordEmail = async function(email: string){
		try {
		  const response = await fetch(api + "/api/captcha", {
			  method: "POST",
			  body: new URLSearchParams({email: email}),
			  credentials: 'include'
			});

		  if (response.status === 200) {
			  const data = await response.json();
			//   console.log('Verify Forgot Password Captcha Request Response: ', data)
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
		//   console.log(error);
		  return {
			  valid: false,
			  errorType: '2'
		  };
	  }
  };

  forgotPassword = async function(request: IForgotPasswordRequest){
	// console.log(request);
	
	try {
	  const response = await fetch(api + "/api/password", {
		  method: "POST",
		  body: new URLSearchParams({...request}),
		  credentials: 'include'
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Forgot Password Request Response: ', data)
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
	//   console.log(error);
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

popularPlaces = async function(){
	try {
	  const response = await fetch(api + "/api/popularPlaces", {
		  method: "GET",
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Popular Places Request Response: ', data)
		  if (data?.length > 0) {
			  return {
				  valid: true,
				  errorType: "0",
				  places: [...data]
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

updatePassword = async function(request: object, token:string){
	try {
	  const response = await fetch(api + "/api/password", {
		  method: "PATCH",
		  body: new URLSearchParams({...request}),
		  credentials: 'include',
		  headers: {
			"token": token, // Add the token in the headers with the key "token"
		},
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Update Password Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

updateUserDetails = async function(request: object){
	try {
	  const response = await fetch(api + "/api/users", {
		  method: "PUT",
		  body: new URLSearchParams({...request}),
		  credentials: 'include',
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Update UserDetails Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

getRecommendation = async function(request: object){
	try {
	  const response = await fetch(api + "/api/venues", {
		  method: "POST",
		  body: JSON.stringify({...request}),
		  headers: {
			'Content-Type': 'application/json'
		  }
		//   credentials: 'include',
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get Recommendation Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
				  ...data
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

getFare = async function(request: object){
	
	
	try {
	  const response = await fetch(api + "/api/fare", {
		  method: "POST",
		  body: JSON.stringify({...request}),
		  headers: {
			'Content-Type': 'application/json'
		  }
		//   credentials: 'include',
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get Fare Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
				  ...data
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

getDuration = async function(request: object){
	
	try {
	  const response = await fetch(api + "/api/duration", {
		  method: "POST",
		  body: JSON.stringify({...request}),
		  headers: {
			'Content-Type': 'application/json'
		  }
		//   credentials: 'include',
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get Duration Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
				  ...data
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

confirmItienary = async function(request: object){

	try {
	  const response = await fetch(api + "/api/trips", {
		  method: "POST",
		  body: new URLSearchParams({...request}),
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get Confirmation Itienary Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
				  trip_id: data.data.trip_id
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
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

checkEmail = async function(email: string){

	try {
	  const response = await fetch(api + "/api/checkEmail", {
		  method: "POST",
		  body: JSON.stringify({email: email}),
		  headers: {
			'Content-Type': 'application/json'
		  }
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get CheckEmail Request Response: ', data)
		  if (data?.valid) {
			  return {
				  valid: true,
				  errorType: "0",
				  user_id: data.user_id
			  };
		  } else {
			  return {
				  valid: false,
				  errorType: '1',
				  message: data.message
			  };
		  }
	  } else {
		  return {
			  valid: false,
			  errorType: '2',
			  message: 'Something Went Wrong'
		  };
	  }
  } catch (error) {
	  return {
		  valid: false,
		  errorType: '2',
		  message: 'Something Went Wrong!'
	  };
  }
};

sendRequest = async function(req: object){
	
	try {
	  const response = await fetch(api + "/api/sendInvite", {
		  method: "POST",
		  body: JSON.stringify(req),
		  headers: {
			'Content-Type': 'application/json'
		  }
		});

	  if (response.status === 200) {
		  const data = await response.json();
		//   console.log('Get CheckEmail Request Response: ', data)
		  if (data?.valid && data?.message) {
			  return {
				  valid: true,
				  errorType: "0",
				  message: data.message
			  };
		  } else {
			  return {
				  valid: false,
				  errorType: '1',
				  message: data.message
			  };
		  }
	  } else {
		  return {
			  valid: false,
			  errorType: '1',
			  message: "Request Already Sent!"
		  };
	  }
  } catch (error) {
	  return {
		  valid: false,
		  errorType: '2'
	  };
  }
};

getItienaryDetails = async function (trip_id:number) {
	try {
		const response = await fetch(api + `/api/trips/${trip_id}`, {
			method: "GET",
			credentials: 'include',
		  });
  
		if (response.status === 200) {
			const data = await response.json();
			// console.log('Get Itienary Request Response: ', data)
			if (data?.valid) {
				return {
					valid: true,
					errorType: "0",
					...data
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
		return {
			valid: false,
			errorType: '2'
		};
	}
}

getRequest = async function (req:object) {
	try {
		const response = await fetch(api + `/api/checkRequests`, {
			method: "POST",
			credentials: 'include',
			body: JSON.stringify({...req}),
			headers: {
				'Content-Type': 'application/json'
			  }
		  });
  
		if (response.status === 200) {
			const data = await response.json();
			// console.log('Get Trip Request Response: ', data)
			if (data?.valid) {
				return {
					valid: true,
					errorType: "0",
					...data
				};
			} else {
				return {
					valid: true,
					errorType: '1',
					data: []
				};
			}
		} else {
			return {
				valid: true,
				errorType: '2',
				data: []
			};
		}
	} catch (error) {
		return {
			valid: false,
			errorType: '2'
		};
	}
}

acceptRequest = async function (req:object) {
	try {
		const response = await fetch(api + `/api/acceptInvite`, {
			method: "POST",
			credentials: 'include',
			body: JSON.stringify({...req}),
			headers: {
				'Content-Type': 'application/json'
			  }
		  });
  
		if (response.status === 200) {
			const data = await response.json();
			// console.log('Get Trip Request Response: ', data)
			if (data?.valid) {
				return {
					valid: true,
					errorType: "0",
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
		return {
			valid: false,
			errorType: '2'
		};
	}
}

declineRequest = async function (req:object) {
	try {
		const response = await fetch(api + `/api/declineInvite`, {
			method: "POST",
			credentials: 'include',
			body: JSON.stringify({...req}),
			headers: {
				'Content-Type': 'application/json'
			  }
		  });
  
		if (response.status === 200) {
			const data = await response.json();
			if (data?.valid) {
				return {
					valid: true,
					errorType: "0",
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
		return {
			valid: false,
			errorType: '2'
		};
	}
}




addFriendsToTrip = async function(request: object){
	try {
		const response = await fetch(api + "/api/venues", {
			method: "POST",
			body: new URLSearchParams({...request}),
			credentials: 'include',
		  });
  
		if (response.status === 200) {
			const data = await response.json();
			// console.log('Update UserDetails Request Response: ', data)
			if (data?.valid) {
				return {
					valid: true,
					errorType: "0",
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
		return {
			valid: false,
			errorType: '2'
		};
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