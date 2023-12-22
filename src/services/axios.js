import axios from "axios";
import {API_ROUTES} from "../config/config";

const axiosInstance = axios.create({baseURL: API_ROUTES.BASE_URL});

export const getBasicInformationAPI = () => axiosInstance({method: "GET", url: API_ROUTES.GET_BASIC_INFORMATION});

export const getSkillsAPI = () => axiosInstance({method: "GET", url: API_ROUTES.GET_SKILLS})

export const getProjectsAPI = () => axiosInstance({method: "GET", url: API_ROUTES.GET_PROJECTS})
