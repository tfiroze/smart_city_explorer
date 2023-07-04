import { useEffect, useState } from "react";
import { AuthContext, IAuthenticationInfo } from "./AuthContext";
import { BrowserRouter, Routes, useNavigate } from "react-router-dom";
import { Router } from "./Router";

export const AuthStack = () => {
  const [authInfo, setAuthInfo] = useState<IAuthenticationInfo>({
    authenticated: false,
    userInfo: null,
    token: null,
    authenticate: (cond, info) => {
      console.log(cond, 'Condition for relogin');

      if (cond) {
        setAuthInfo((prevAuthInfo) => ({
          ...prevAuthInfo,
          authenticated: true,
          userInfo: info,
        }));
      } else {
        setAuthInfo((prevAuthInfo) => ({
          ...prevAuthInfo,
          authenticated: false,
          userInfo: null,
        }));
      }
    },
  });

  const authContextValue: IAuthenticationInfo = {
    ...authInfo,
  };
  console.log('AuthContext Called', authInfo.authenticated);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    checkLoginStatus(accessToken)

  }, []);

  useEffect(() => {
    console.log(authInfo, 'Verification'); // Verify that authContext is updated
  }, [authInfo]);

  function getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  function checkLoginStatus(accessToken: string | null) {
    if (accessToken !== null) {
      const userUid = localStorage.getItem('userUid');
      const email = localStorage.getItem('email');
      const first_name = localStorage.getItem('first_name');
      const last_name = localStorage.getItem('last_name');
      console.log(first_name, authInfo, 'APP AUTH');

      authInfo.authenticate(true, {
        first_name: first_name,
        last_name: last_name,
        userUid: email,
        email: userUid,
      });
    } else {
      authInfo.authenticate(false)
    }
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <BrowserRouter>
        <Router auth={authContextValue.authenticated} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

