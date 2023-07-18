import IVenueItem from "./IVenueItem";

export default interface IItinerary {
	plan:IVenueItem[]
	name:string;
	comments:string;
	budget:number;
	startTime:string;
	endTime:string;
	date:string;
}