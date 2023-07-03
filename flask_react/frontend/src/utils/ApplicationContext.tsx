import React from "react";

interface IThemeInfo{
    theme:'light'|'dark';
    onChange:()=>void;
}

 export const ThemeContext = React.createContext<IThemeInfo>({theme:"light",onChange: ()=> { }});
