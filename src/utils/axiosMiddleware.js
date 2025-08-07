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

// Non-hook version for use in API service functions
export const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: apiConfig.baseURL + "/api/v1",
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (!token) {
        // For API service calls, we'll handle this differently
        // Don't redirect here, let the calling component handle it
        return Promise.reject(new Error("No token found"));
      }
      config.headers.Authorization = `Bearer ${token}`;
      
      // 🔧 FIX: Solo usar timestamp para cache busting (sin headers problemáticos de CORS)
      if (config.method === 'get') {
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_t=${Date.now()}`;
      }
      
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
        // For API service calls, we'll handle this differently
        // Don't redirect here, let the calling component handle it
        console.error("Unauthorized access");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Non-hook version for public endpoints
export const createPublicAxiosInstance = () => {
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
};
