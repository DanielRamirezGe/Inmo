"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import apiConfig from "../config/apiConfig";

export const useAxiosMiddleware = () => {
  const router = useRouter();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiConfig.baseURL + "/api/v1",
    });

    // Add a request interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (!token) {
          // console.error("Token not found. Redirecting to login...");
          router.push("/login");
          return Promise.reject(new Error("No token found"));
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // console.error("Unauthorized. Redirecting to login...");
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [router]);

  return axiosInstance;
};

// New hook for public endpoints that don't require authentication
export const usePublicAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiConfig.baseURL + "/api/v1",
    });

    // No authentication interceptors for public endpoints
    // Only add basic error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Public API error:", error);
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return axiosInstance;
};
