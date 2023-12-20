import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';


export const ThemeContext = createContext({});

export const useThemeContext = () => useContext(ThemeContext);

export const THEME = {LIGHT: "light", DARK: "dark"};

const ThemeContextProvider = ({children}) => {

	const [theme, setTheme] = useState(THEME.LIGHT);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	const value = useMemo(() => ({
		theme, setTheme
	}), [theme]);

	return <>
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	</>
};

export default ThemeContextProvider;
