import axios from "axios";
import config from "../config";
const baseUrl = "https://jira-be.vercel.app/user";
// const baseUrl = `${config.getServerHost()}/user`

const getUsers = async (headers) => {
  const res = await axios.get(baseUrl, headers);
  return res.data;
};

export default { getUsers };
