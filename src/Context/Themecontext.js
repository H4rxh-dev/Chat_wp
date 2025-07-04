import { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const Themecontext=createContext()


 export const Theeprovider=({children})=>{
  const systemTheme = useColorScheme();
    const[theme,setTheme]=useState(systemTheme)
 useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

const toggletheme=()=>{
 setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));}

return(
<Themecontext value={{theme,isDark:theme==="dark",toggletheme}}>
{children}
</Themecontext>
 )
 }