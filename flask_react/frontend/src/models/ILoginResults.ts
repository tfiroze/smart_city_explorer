export default interface ILoginResults{
  valid:boolean;
  token?:string|null;
  tokenExpirationTime?:string|null;
  errorType:string;
}