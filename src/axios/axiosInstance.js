// api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import { redirectTo,logout } from '../utils'

const baseURL = "http://localhost:8000/api/"

const instance = axios.create({
  baseURL: baseURL,
//   timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem("accessToken");
  
      // Check if the Authorization header should be included
      if (config.headers.Authorization !== false) {
        if (accessToken) {
          config.headers.Authorization = `Token ${accessToken}`;
        }
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
let isToastDisplayed = false;
instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
    if (!isToastDisplayed && error.response && error.response.status === 401) {
        toast.error("Token expired. Redirecting to login...");
        isToastDisplayed = true;
        // // logout()
        setTimeout(() => {
            window.location.href = "/";
        }, 1000); 

      }
      return Promise.reject(error);
    }
  );

export default instance;
