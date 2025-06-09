export const API_ROUTES = {
  BASE_URL: "/api/user",
  GET_BASIC_INFORMATION: "/basicInformation",
  GET_SKILLS: "/skillInformation",
  GET_PROJECTS: "/projectInformation",
  GET_EXPERIENCES: "/workExperienceInformation",
  GET_EDUCATION_DETAILS: "/educationInformation",
};

export type SkillName =
  | "HTML"
  | "CSS"
  | "SASS"
  | "Sass"
  | "Styled Components"
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "ExpressJS"
  | "Node"
  | "MongoDB"
  | "AWS"
  | "Nginx"
  | "MySQL"
  | "Google Analytics"
  | "JAVA"
  | "Java"
  | "Spring Boot"
  | "Vite"
  | "Chart.js";

export const SKILLS_ASSETS_MAPPING: Record<SkillName, string> = {
  HTML: "/assets/logos/html.svg",
  CSS: "/assets/logos/css.svg",
  SASS: "/assets/logos/sass.svg",
  Sass: "/assets/logos/sass.svg",
  "Styled Components": "/assets/logos/styled-components.svg",
  JavaScript: "/assets/logos/js.png",
  TypeScript: "/assets/logos/ts.png",
  React: "/assets/logos/react.svg",
  ExpressJS: "/assets/logos/express.svg",
  Node: "/assets/logos/node.svg",
  MongoDB: "/assets/logos/mongodb.svg",
  AWS: "/assets/logos/aws.svg",
  Nginx: "/assets/logos/nginx.svg",
  MySQL: "/assets/logos/mysql.svg",
  "Google Analytics": "/assets/logos/google-analytics.svg",
  JAVA: "/assets/logos/java.svg",
  Java: "/assets/logos/java.svg",
  "Spring Boot": "/assets/logos/spring-boot.svg",
  Vite: "/assets/logos/vitejs.svg",
  "Chart.js": "/assets/logos/chartjs.svg",
};

export const LINK_MAPPING = {
  HOME: "/",
  SKILLS: "/skills",
  PROJECTS: "/projects",
  EXPERIENCES: "/experiences",
  EDUCATION: "/education",
  RESUME: "/resume",
  SEARCH: "/search",
};

export const cloudinaryResLink: string = process.env.NEXT_PUBLIC_CLOUDINARY_RES_LINK || "";

export const gaID = process.env.NEXT_PUBLIC_GA_ID || "";
