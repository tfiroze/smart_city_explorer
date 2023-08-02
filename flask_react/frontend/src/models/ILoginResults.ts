export default interface ILoginResults{
  valid:boolean;
  token?:string|null;
  errorType:string;
}