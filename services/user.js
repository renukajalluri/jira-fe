import axios from "axios";
import config from "../config";
const baseUrl = "https://jira-be.herokuapp.com/user";
// const baseUrl = `${config.getServerHost()}/user`

const getUsers = async (headers) => {
  console.log(baseUrl);
  const res = await axios.get(baseUrl, headers);
  return res.data;
};

export default { getUsers };
