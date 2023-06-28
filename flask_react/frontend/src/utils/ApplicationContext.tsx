import React from "react";

interface IThemeInfo{
    theme:'light'|'dark';
    onChange:()=>void;
}

export interface IUserInfo{
    name:string;
    userUid:string;
}

interface IAuthenticationInfo{
    authenticated:boolean;
    authenticate:(info:IUserInfo)=>void;
    userInfo?:IUserInfo |null
    token?:string |null
}
 export const ThemeContext = React.createContext<IThemeInfo>({theme:"light",onChange: ()=> { }});
 export const AuthContext = React.createContext<IAuthenticationInfo>({authenticated:false,authenticate:()=>{},token:null});
