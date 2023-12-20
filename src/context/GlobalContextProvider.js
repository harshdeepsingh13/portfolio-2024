import React from 'react';
import ThemeContextProvider from "./ThemeContext/ThemeContext";

const GlobalContextProvider = ({children}) => {
  return <>
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  </>
};
export default GlobalContextProvider
