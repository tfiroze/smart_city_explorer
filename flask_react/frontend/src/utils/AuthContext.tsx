import React, { createContext, useState } from "react";


export interface IUserInfo {
  first_name: string|null;
  surname: string|null;
  user_id: string|null;
  email: string|null;
}

export interface IAuthenticationInfo {
  authenticated: boolean;
  authenticate: (cond:boolean, info?: IUserInfo) => void;
  userInfo?: IUserInfo | null;
  token?: string | null;
}


export const AuthContext = createContext<IAuthenticationInfo>({
  authenticated: false,
  authenticate: () => {},
  userInfo: null,
  token: null
});


  