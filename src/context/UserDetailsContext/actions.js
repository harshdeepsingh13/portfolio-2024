import {
	getBasicInformationAPI,
	getEducationDetailsAPI,
	getExperiencesAPI,
	getProjectsAPI,
	getSkillsAPI
} from "../../services/axios";

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
    },
    getProjects: async () => {
        try {
            loaderSetters.setGetProjectsLoader(true);
            const {data: {data}} = await getProjectsAPI();
            updateState({projects: data.projects})
        } catch (e) {
            console.error("e", e);
        } finally {
            loaderSetters.setGetProjectsLoader(false);
        }
    },
    getExperiences: async () => {
        try {
            loaderSetters.setGetExperiencesLoader(true);
            const {data: {data}} = await getExperiencesAPI();
            updateState({experiences: data.workExperiences});
        } catch (e) {
            console.error("e", e)
        } finally {
            loaderSetters.setGetExperiencesLoader(false);
        }
    },
    getEducationDetails: async () => {
        try {
            loaderSetters.setGetEducationDetailsLoader(true);
            const {data: {data}} = await getEducationDetailsAPI();
            updateState({educationDetails: data.educationInformation.educationInformation.educations})
        } catch (e) {
            console.error("e", e);
        } finally {
            loaderSetters.setGetEducationDetailsLoader(false);
        }
    }
})
