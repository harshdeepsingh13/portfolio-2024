import educations from "../../modals/educations";
import project from "../../modals/project";
import skill from "../../modals/skill";
import user from "../../modals/user";
import workExperience from "../../modals/workExperience";
import { connectToDB } from "./mongoose";

const userEmail = process.env.UESR_EMAIL;

export const getData = {
  getBasicInformation: async () => {
    // Disable Next.js data cache for this request so DB reads are always fresh.
    // noStore();
    await connectToDB();
    const data = await user
      .findOne(
        { email: userEmail },
        {
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
          socialMediaLinks: 1,
        }
      )
      .lean();

    return JSON.parse(JSON.stringify(data));
  },
  getSkills: async () => {
    // Disable caching for route-level skill reads.
    // noStore();
    await connectToDB();
    const data = await skill.findOne({ user: userEmail }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getProjects: async () => {
    // Disable caching so project edits appear immediately.
    // noStore();
    await connectToDB();
    const data = await project.find({ user: userEmail }, undefined, { sort: { startDate: -1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getWorkExperiences: async () => {
    // Disable caching so experience updates are reflected on first refresh.
    // noStore();
    await connectToDB();
    const data = await workExperience.find({ user: userEmail }, undefined, { sort: { startDate: -1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getEducationInformation: async () => {
    // Disable caching so education updates are reflected on first refresh.
    // noStore();
    await connectToDB();
    const data = await educations.find({ user: userEmail }, undefined, { sort: { priority: 1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
};
