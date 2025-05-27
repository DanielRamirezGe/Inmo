import { api } from "./api";

/**
 * A shared service module for property detail functionality
 * This centralizes the logic for fetching property data in both admin preview and public views
 */
export const propertyService = {
  /**
   * Fetches property details and related properties
   *
   * @param {Object}  - Axios instance with authentication
   * @param {string} id - The property ID to fetch
   * @param {boolean} isAdmin - Whether this is an admin preview (true) or public view (false)
   * @returns {Object} An object containing { property, relatedProperties, error }
   */
  async fetchPropertyDetails(id, isAdmin) {
    let property = null;
    let relatedProperties = [];
    let error = null;

    try {
      // Get property data - use the appropriate API endpoint based on whether this is admin or public
      const propertyData = isAdmin
        ? await api.getPropertyPreview(id)
        : await api.getPublicPropertyView(id);

      property = propertyData;

      // Get related properties from the same development
      if (propertyData?.developmentId || true) {
        const developmentPropertiesResponse = isAdmin
          ? await api.getPublishedProperties()
          : await api.getPublicProperties();
        const developmentProperties = developmentPropertiesResponse?.data || [];

        // Filter to exclude the current property and limit to 3 properties
        relatedProperties = developmentProperties
          .filter((prop) => prop.prototypeId !== id)
          .slice(0, 3);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      error = "No se pudo cargar la información de la propiedad";
    }

    return { property, relatedProperties, error };
  },

  /**
   * Submits user contact information from property detail pages
   *
   * @param {Object}  - Axios instance with authentication
   * @param {Object} userData - User data object with contact information
   * @returns {Object} API response data
   */
  async submitContactForm(userData) {
    return await api.submitUserInformation(userData);
  },
};
