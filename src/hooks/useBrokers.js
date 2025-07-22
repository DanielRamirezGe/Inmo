import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

export const useBrokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    active: undefined,
  });

  // Fetch brokers with current filters and pagination
  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.active !== undefined && { active: filters.active }),
      };

      const response = await api.getBrokers(params);
      
      setBrokers(response.data || []);
      setPagination(prev => ({
        ...prev,
        currentPage: response.pagination?.currentPage || 1,
        totalRecords: response.pagination?.totalRecords || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error fetching brokers:", err);
      setError(err.message || "Error al cargar los brokers");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, filters]);

  // Load brokers on mount and when dependencies change
  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page
      pageSize: newPageSize,
    }));
  };

  // Handle search filter
  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when searching
    }));
  };

  // Handle active filter
  const handleActiveFilterChange = (activeStatus) => {
    setFilters(prev => ({
      ...prev,
      active: activeStatus,
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1, // Reset to first page when filtering
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      active: undefined,
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  };

  // Format broker data for display
  const formatBrokerData = (broker) => {
    const fullName = `${broker.name} ${broker.lastNameP}${broker.lastNameM ? ` ${broker.lastNameM}` : ''}`;
    const recordDate = new Date(broker.recordDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      ...broker,
      fullName,
      recordDate,
      statusText: broker.active ? 'Activo' : 'Inactivo',
      statusColor: broker.active ? 'success' : 'error',
    };
  };

  // Get formatted brokers
  const formattedBrokers = brokers.map(formatBrokerData);

  return {
    // State
    brokers: formattedBrokers,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchBrokers,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleActiveFilterChange,
    clearFilters,
    
    // Utilities
    formatBrokerData,
  };
}; 