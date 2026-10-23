
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
  baseURL: import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? "https://repair-hub-l2pc.vercel.app/api"
      : "http://localhost:4000/api"),

  withCredentials: true,
});

export default api;
