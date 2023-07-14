export default interface Itinerary {
	timeFrom: string;
	timeTo: string;
	imgLink: string;
	title: string;
	description: string;
	venueId: string | number; //based on backend but ye....( ͡° ʖ̯ ͡°)
	budget: number;
	invited: number;
	conflictsWithPrevouse?: boolean;
	invitedParticipant?:string[];
}