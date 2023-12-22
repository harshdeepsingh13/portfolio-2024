import {getBasicInformationAPI, getSkillsAPI} from "../../services/axios";

export default (state, updateState, loaderSetters) => ({
	getBasicInformation: async () => {
		try {
			loaderSetters.setGetBasicInformationLoader(true);
			const {data: {data}} = await getBasicInformationAPI();
			updateState({basicInformation: data.basicInformation});
		} catch (e) {
			console.error("e", e);
		} finally {
			loaderSetters.setGetBasicInformationLoader(false);
		}
	},
	getSkills: async () => {
		try {
			loaderSetters.setGetSkillsLoader(true);
			const {data: {data}} = await getSkillsAPI();
			updateState({skills: data})
		} catch (e) {
			console.error("e", e);
		} finally {
			loaderSetters.setGetSkillsLoader(false);
		}
	}
})
