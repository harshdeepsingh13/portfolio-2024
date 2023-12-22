import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import actions from './actions';

const initState = {
	basicInformation: {},
	skills: [],
}

export const UserDetailsContext = createContext(initState);

export const useUserDetailsContext = () => useContext(UserDetailsContext);

const UserDetailsContextProvider = ({children}) => {

	const [state, setState] = useState({});
	const [getBasicInformationLoader, setGetBasicInformationLoader] = useState(false);
	const [getSkillsLoader, setGetSkillsLoader] = useState(false)

	const updateState = useCallback((updatedData, toClear = false) => {
		setState((prevState => (toClear ? {} : {...prevState, ...updatedData})))
	}, [setState]);

	const enhancedActions = useMemo(() => actions(state, updateState, {
		setGetBasicInformationLoader,
		setGetSkillsLoader
	}), [state, updateState]);


	const value = useMemo(() => ({
		actions: enhancedActions,
		state,
		loaders: {getBasicInformationLoader, getSkillsLoader}
	}), [enhancedActions, state, getBasicInformationLoader, getSkillsLoader]);

	return <>
		<UserDetailsContext.Provider value={value}>
			{children}
		</UserDetailsContext.Provider>
	</>
};

export default UserDetailsContextProvider;
