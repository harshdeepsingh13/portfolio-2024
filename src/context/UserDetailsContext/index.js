import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import actions from './actions';

const initState = {
	basicInformation: {}
}

export const UserDetailsContext = createContext(initState);

export const useUserDetailsContext = () => useContext(UserDetailsContext);

const UserDetailsContextProvider = ({children}) => {

	const [state, setState] = useState({});
	const [getBasicInformationLoader, setGetBasicInformationLoader] = useState(false);

	const updateState = useCallback((updatedData, toClear = false) => {
		setState((prevState => (toClear ? {} : {...prevState, ...updatedData})))
	}, [setState]);

	const enhancedActions = useMemo(() => actions(state, updateState, {
		setGetBasicInformationLoader
	}), [state, updateState]);


	const value = useMemo(() => ({
		actions: enhancedActions,
		state,
		loaders: {getBasicInformationLoader}
	}), [enhancedActions, state, getBasicInformationLoader]);

	return <>
		<UserDetailsContext.Provider value={value}>
			{children}
		</UserDetailsContext.Provider>
	</>
};

export default UserDetailsContextProvider;
