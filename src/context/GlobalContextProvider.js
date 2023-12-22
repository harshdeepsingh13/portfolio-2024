import React from 'react';
import ThemeContextProvider from "./ThemeContext/ThemeContext";
import UserDetailsContextProvider from "./UserDetailsContext";

const GlobalContextProvider = ({children}) => {
	return <>
		<ThemeContextProvider>
			<UserDetailsContextProvider>
				{children}
			</UserDetailsContextProvider>
		</ThemeContextProvider>
	</>
};
export default GlobalContextProvider
