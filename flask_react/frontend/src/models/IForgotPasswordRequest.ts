export default interface IForgotPasswordRequest {
    email:string;
    password:string;
    confirmPassword: string;
    captcha:string;
}