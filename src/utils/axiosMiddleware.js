"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useAxiosMiddleware = () => {
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3010/api/v1", // Base URL for the API
  });

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found. Redirecting to login...");
        router.push("/login"); // Redirect to login page
        return Promise.reject(new Error("No token found"));
      }
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor (optional, for handling errors globally)
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.error("Unauthorized. Redirecting to login...");
        router.push("/login"); // Redirect to login page
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
