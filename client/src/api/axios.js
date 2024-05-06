import axios from 'axios';
const PORT = process.env.PORT || 3080;
const baseURL = `http://localhost:${PORT}`;

export default axios.create({
  baseURL: baseURL,
});

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

