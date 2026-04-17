import axios from "axios";

const API = axios.create({
  baseURL: "https://gym-crm-backend-dscs.onrender.com/api",
});

export default API;