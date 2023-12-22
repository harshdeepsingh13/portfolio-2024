const mongoose = require("mongoose");
const UserSchema = require('../../schemas/user.schema');
const EducationsSchema = require("../../schemas/educations.schema");
const WorkExperienceSchema = require("../../schemas/workExperience.schema");
const ProjectSchema = require("../../schemas/project.schema");
const TrainingSchema = require('../../schemas/trainings.schema');
const SkillSchema = require("../../schemas/skill.schema");

const userEmail = process.env.UESR_EMAIL;

const basicInformationProjection = {
	_id: 0,
	name: 1,
	tags: 1,
	objective: 1,
	avatar: 1,
	email: 1,
	contactNumber: 1,
	currentLocation: 1,
	dob: 1,
	website: 1,
	socialMediaLinks: 1
};
const userInformationProjection = {
	_id: 0,
	name: 1,
	email: 1,
	avatar: 1
};
const educationInformationProjection = {
	_id: 0,
	educationInformation: 1
};
const skillInformationProjection = {
	_id: 0,
	skills: 1
};
const workExperienceProjection = {
	_id: 0,
	workExperienceInformation: 1
};
const projectsProjection = {
	_id: 0,
	projectsInformation: 1
};
const trainingsProjection = {
	_id: 0,
	trainingInformation: 1
};

const User = mongoose.model("User", UserSchema);
const WorkExperience = mongoose.model("WorkExperience", WorkExperienceSchema);
const EducationDetail = mongoose.model("EducationDetail", EducationsSchema);
const Project = mongoose.model("Project", ProjectSchema);
const Training = mongoose.model("Training", TrainingSchema);
const Skill = mongoose.model("Skill", SkillSchema)

exports.getBasicInformation = (projection = basicInformationProjection) =>
	User.findOne(
		{email: userEmail},
		projection
	);

exports.getEducationInformation = async (q) => {
	let filter = {user: userEmail};
	if (q) filter.instituteName = {$regex: "^" + q, $options: "i"}
	const educationInformation = await EducationDetail.find(
		filter,
		{},
		{
			sort: {priority: 1}
		}
	);
	return {educationInformation: {educations: [...educationInformation]}};
};

exports.getSkillInformation = async (q) => {
	if (q) {
		return (await Skill.aggregate([
			{$match: {user: userEmail}},
			{
				$set: {
					skills: {
						$filter: {
							input: "$skills",
							as: "skill",
							cond: {
								$regexMatch: {
									input: "$$skill",
									regex: new RegExp("^" + q),
									options: "i"
								}
							}
						}
					}
				}
			},
			{$project: skillInformationProjection}
		]))[0]
	}
	return Skill.findOne({user: userEmail}, skillInformationProjection);
}

exports.getWorkExperiences = (q) => {
	let filter = {user: userEmail};
	if (q) filter.company = {$regex: "^" + q, $options: "i"}
	return WorkExperience.find(
		filter,
		{},
		{
			sort: {startDate: -1}
		}
	);
};


exports.getProjectInformation = (q) => {
	let filter = {user: userEmail};
	if (q) filter.name = {$regex: "^" + q, $options: "i"}
	return Project.find(
		filter,
		{},
		{
			sort: {startDate: -1}
		}
	);
};

exports.getTrainingInformation = (q) => {
	let filter = {user: userEmail};
	if (q) filter.name = {$regex: "^" + q, $options: "i"}
	return Training.find(
		filter,
		{},
		{
			sort: {startDate: -1}
		}
	);
};

exports.getCompleteInformation = async () => ({
	basicInformation: await this.getBasicInformation(),
	educationInformation: await this.getEducationInformation(),
	skillsInformation: await this.getSkillInformation(),
	workExperienceInformation: {workExperienceInformation: {workExperiences: await this.getWorkExperiences()}},
	trainingInformation: {trainingInformation: {trainings: await this.getTrainingInformation()}},
	projects: {projectsInformation: {projects: await this.getProjectInformation()}}
});
