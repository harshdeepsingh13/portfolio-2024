import {getBasicInformationAPI} from "../../services/axios";

export default (state, updateState, loaderSetters) => ({
	getBasicInformation: async () => {
		try {
			loaderSetters.setGetBasicInformationLoader(true);
			const {data: {data}} = await getBasicInformationAPI();
			updateState({basicInformation: data.basicInformation});
		} catch (e) {
			console.log("e", e);
		} finally {
			loaderSetters.setGetBasicInformationLoader(false);
		}
	}
})
