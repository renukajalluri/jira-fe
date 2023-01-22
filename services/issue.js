import axios from "axios";
import config from "../config";
const baseUrl = "https://jira-be.vercel.app/issue";
// const baseUrl = `${config.getServerHost()}/issue`

const updateIssue = async (id, dataObj, header) => {
  const response = await axios.put(`${baseUrl}/${id}`, dataObj, header);
  return response.data;
};
const createIssue = async (dataObj, header) => {
  const response = await axios.post(baseUrl, dataObj, header);
  return response.data;
};

const getIssueById = async (id, header) => {
  const url = `${baseUrl}/${id}`;
  const response = await axios.get(url, header);
  return response.data;
};

const getIssuesByProjectId = async (projectId, headers) => {
  const url = `${baseUrl}/issueByProject/${projectId}`;
  const response = await axios.get(url, headers);
  return response.data;
};

const getRelatedIssuesByIssueId = async (issueId, headers) => {
  const url = `${baseUrl}/related-issues/${issueId}`;
  const response = await axios.get(url, headers);
  return response.data;
};

export default {
  createIssue,
  getIssuesByProjectId,
  getIssueById,
  updateIssue,
  getRelatedIssuesByIssueId,
};
