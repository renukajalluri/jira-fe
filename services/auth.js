import axios from "axios";
import config from "../config";
// const baseUrl = `${config.getServerHost()}/auth`
const baseUrl = "https://jira-be.herokuapp.com/auth/";

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

const signup = async (credentials) => {
  const response = await axios.post(`${baseUrl}/sign-up`, credentials);
  return response.data;
};

export default { login, signup };
