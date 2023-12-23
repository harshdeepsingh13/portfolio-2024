import React from 'react';
import {Route, Routes} from "react-router-dom";
import {LINK} from "./config/config";
import Home from "./containerComponents/Home";
import Skills from "./containerComponents/Skills";
import Projects from "./containerComponents/Projects";
import Experiences from "./containerComponents/Experiences";
import Education from "./containerComponents/Education";
import ResumePage from "./containerComponents/ResumePage";
import Search from "./containerComponents/Search";


const ROUTES = [
	{path: LINK.HOME, element: <Home/>},
	{path: LINK.SKILLS, element: <Skills/>},
	{path: LINK.PROJECTS, element: <Projects/>},
	{path: LINK.EXPERIENCES, element: <Experiences/>},
	{path: LINK.EDUCATION,element: <Education/>},
	{path: LINK.RESUME, element: <ResumePage/>},
]

if(process.env.REACT_APP_MODE === "dev") {
	ROUTES.push({path: LINK.SEARCH, element: <Search/>})
}

const AppRouter = props => {
	return <>
		<Routes>
			{ROUTES.map(({element, path}) => (
				<Route path={path} element={element}/>
			))}
		</Routes>
	</>;
}
export default AppRouter
