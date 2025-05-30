import { API_ROUTES } from "@/config/config";
import axios from "axios";

export default axios.create({ baseURL: API_ROUTES.BASE_URL });
