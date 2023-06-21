import { IPlannedTrip } from "./IPlannedTrip";

export default interface ILoginResults{
  valid:boolean;
  dashboardData?:IPlannedTrip[]
  firstName?:string;
}