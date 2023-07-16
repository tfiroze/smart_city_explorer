export enum busynessLevel {
	low = "low",
	moderate = "moderate",
	high = "high",
}
// low = "Not busy",
// 	moderate = "Somewhat busy",
// 	high = "Very busy",

export const getBusynessDescription = (busyness: busynessLevel | undefined) => {
	if (!busyness) return 'Unknown busyness level';
	switch (busyness) {
		case busynessLevel.low:
		  return 'Not busy';
		case busynessLevel.moderate:
		  return 'Somewhat busy';
		case busynessLevel.high:
		  return 'Very busy';
		default:
		  return 'Unknown busyness level';
	  }
  };


  
  export const getColor = (busyness: busynessLevel | undefined) => {
	switch (busyness) {
	  case busynessLevel.low:
		return "success";  // or any color you desire
	  case busynessLevel.moderate:
		return "warning";  // or any color you desire
	  case busynessLevel.high:
		return "error";  // or any color you desire
	  default:
		return "default";
	}
  };
  
// export const getColor = (level: busynesLevel) => {
// 	switch (level) {
// 		case busynesLevel.low:
// 			return "success";
// 		case busynesLevel.moderate:
// 			return "warning";
// 		case busynesLevel.high:
// 			return "error";
// 	}
// };