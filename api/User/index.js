const express = require("express");

const {
	getBasicInformationController,
	getCompleteInformationController,
	getEducationInformationController,
	getProjectInformationController,
	getSkillInformationController,
	getTrainingInformationController,
	getWorkExperiencesController,
	getProfessionalSummaryController
} = require('./user.controller');

const app = express.Router();

app.get('/basicInformation', getBasicInformationController);

app.get("/professionalSummary", getProfessionalSummaryController)

app.get('/educationInformation', getEducationInformationController);

app.get('/skillInformation', getSkillInformationController);

app.get('/workExperienceInformation', getWorkExperiencesController);

app.get('/trainingInformation', getTrainingInformationController);

app.get('/projectInformation', getProjectInformationController);

app.get('/completeInformation', getCompleteInformationController);

module.exports = app;
