export enum busynesLevel {
	low = "low",
	moderate = "moderate",
	high = "high",
}
// low = "Not busy",
// 	moderate = "Somewhat busy",
// 	high = "Very busy",


export const getColor = (level: busynesLevel) => {
	switch (level) {
		case busynesLevel.low:
			return "success";
		case busynesLevel.moderate:
			return "warning";
		case busynesLevel.high:
			return "error";
	}
};