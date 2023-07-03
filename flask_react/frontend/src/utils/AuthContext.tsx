import React, { createContext, useState } from "react";


export interface IUserInfo {
  first_name: string;
  last_name: string;
  userUid: string;
  email: string;
}

interface IAuthenticationInfo {
  authenticated: boolean;
  authenticate: (info: IUserInfo) => void;
  userInfo?: IUserInfo | null;
  token?: string | null;
}


export const AuthContext = createContext<IAuthenticationInfo>({
  authenticated: false,
  authenticate: () => {},
  userInfo: null,
  token: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authInfo, setAuthInfo] = useState<IAuthenticationInfo>({
      authenticated: false,
      userInfo: null,
      token: null,
      authenticate: (info) => {
        setAuthInfo((prevAuthInfo) => ({
          ...prevAuthInfo,
          authenticated: true,
          userInfo: info,
        }));
      }
    });
  
    const authContextValue: IAuthenticationInfo = {
      ...authInfo,
    };
  
    return (
      <AuthContext.Provider value={authContextValue}>
        {children}
      </AuthContext.Provider>
    );
  };
  