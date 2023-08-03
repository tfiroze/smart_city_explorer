export default interface IRegisterRequest {
    firstname:string;
    surname:string;
    email:string;
    password:string;
    confirmPassword: string;
    captcha:string;
}