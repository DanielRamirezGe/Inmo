import { useState } from "react";
import { api } from "../../services/api";

export const useBotPerformance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Overview - Vista General
  const getOverview = async (period = "30d") => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceOverview(period);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Users - Análisis de Usuarios
  const getUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceUsers(params);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Conversations - Análisis de Conversaciones
  const getConversations = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceConversations(params);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Interactions - Análisis de Interacciones
  const getInteractions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceInteractions(params);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Conversions - Análisis de Conversiones
  const getConversions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceConversions(params);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Health - Estado de Salud del Bot
  const getHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceHealth();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inventory - Análisis de Inventario
  const getInventory = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBotPerformanceInventory(params);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getOverview,
    getUsers,
    getConversations,
    getInteractions,
    getConversions,
    getHealth,
    getInventory,
  };
};
