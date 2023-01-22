import axios from "axios";
import config from "../config";
const baseUrl = "https://jira-be.vercel.app/project";
// const baseUrl = `${config.getServerHost()}/project`

const createProject = async (dataObj, header) => {
  const response = await axios.post(baseUrl, dataObj, header);
  return response.data;
};

const getProjectById = async (id, header) => {
  const response = await axios.get(`${baseUrl}/${id}`, header);
  return response.data;
};

const getProjects = async (header) => {
  const response = await axios.get(baseUrl, header);
  return response.data;
};

export default { createProject, getProjects, getProjectById };
