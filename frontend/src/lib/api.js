
// import axios from "axios";

// export const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL ||
//     "http://localhost:4000/api",

//   withCredentials: true,
// });

// export default api;


import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://aapka-BACKEND.vercel.app/api
  withCredentials: true,
});

export default api;
