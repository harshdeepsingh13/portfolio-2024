const {
	getBasicInformation,
	getCompleteInformation,
	getEducationInformation,
	getProjectInformation,
	getSkillInformation,
	getTrainingInformation,
	getWorkExperiences,
} = require("./user.model");

exports.getBasicInformationController = async (req, res, next) => {
	try {
		const basicInformation = await getBasicInformation();
		res.status(200).json({
			status: 200,
			message: "Basic information retrieved successfully",
			data: {
				basicInformation
			}
		});
		console.log(`[ user.controller.js ] Basic information for the user successfully fetched.`)
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getEducationInformationController = async (req, res, next) => {
	try {
		const {q} = req.query;
		const educationInformation = await getEducationInformation(q);
		res.status(200).json(
			{
				status: 200,
				message: "education information successfully retrieved.",
				data: {
					educationInformation
				}
			}
		);
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getSkillInformationController = async (req, res, next) => {
	try {
		const {q} = req.query;
		const skills = await getSkillInformation( q);
		res.status(200).json(
			{
				status: 200,
				message: "data successfully retrieved",
				data: skills?.skills || []
			}
		)
	} catch (e) {
		console.log("e", e);
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getWorkExperiencesController = async (req, res, next) => {
	try {
		const {q} = req.query;
		const workExperiences = await getWorkExperiences(q);
		res.status(200).json(
			{
				status: 200,
				message: "data successfully retrieved",
				data: {
					workExperiences
				}
			}
		)
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getProjectInformationController = async (req, res, next) => {
	try {
		const {q} = req.query;
		const projects = await getProjectInformation(q);
		res.status(200).json(
			{
				status: 200,
				message: "data successfully retrieved",
				data: {
					projects
				}
			}
		)
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getCompleteInformationController = async (req, res, next) => {
	try {
		const information = await getCompleteInformation();
		res.status(200).json(
			{
				status: 200,
				message: "complete information retrieval successful",
				data: {
					...information
				}
			}
		)
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(e);
	}
};

exports.getTrainingInformationController = async (req, res, next) => {
	try {
		const {q} = req.query;
		const trainings = await getTrainingInformation( q);
		res.status(200).json(
			{
				status: 200,
				message: "data successfully retrieved",
				data: {
					trainings
				}
			}
		)
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
};

exports.getProfessionalSummaryController = async (req, res, next) => {
	try {
		const professionalSummary = await getBasicInformation({objective: 1})
		res.status(200).json({
			message: "Professional Summary successfully retrieved",
			data: {objective: professionalSummary?.objective || ""}
		})
	} catch (e) {
		req.error = {status: 500, message: "An Error occurred!"}
		return next(new Error());
	}
}
