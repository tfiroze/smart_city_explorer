import { IPlannedTrip } from "./IPlannedTrip";

export default interface ILoginResults{
  valid:boolean;
  dashboardData?:IPlannedTrip[]
  firstName?:string;
  token?:string|null;
  refreshToken?:string|null;
}