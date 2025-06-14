import { useState, useEffect } from "react";
import { api } from "../services/api";

export const useMainVideo = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMainVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getMainVideoUrl();

        setVideoData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainVideo();
  }, []);

  return {
    videoData,
    loading,
    error,
    videoUrl: videoData?.url || null,
  };
};
