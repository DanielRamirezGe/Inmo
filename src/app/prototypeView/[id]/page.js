"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyDetailView from "@/components/PropertyDetailView";
import { propertyService } from "@/services/propertyService";
import { usePublicAxios } from "@/utils/axiosMiddleware";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import DrawerAppBar from "../../components/navBarGen";

export default function PublicPropertyViewPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);

  // Get axiosInstance
  const axiosInstance = usePublicAxios();

  // Initialize reCaptcha
  const { executeRecaptcha, isDevelopmentMode } = useRecaptcha();

  // Use a reference to control if the API call has already been made
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    // Define the fetch function
    const fetchPropertyData = async () => {
      // If the call was already made, don't repeat it
      if (fetchedRef.current) return;

      // Mark that the call is in progress before any async operations
      fetchedRef.current = true;

      try {
        setLoading(true);

        // Get property data using shared service
        const {
          property: propertyData,
          relatedProperties: related,
          error: fetchError,
        } = await propertyService.fetchPropertyDetails(
          axiosInstance,
          id,
          false
        ); // false = public view

        // Only set state if the component is still mounted
        setProperty(propertyData);
        setRelatedProperties(related);

        if (fetchError) {
          setError(fetchError);
        }
      } catch (err) {
        console.error("Error in public property view:", err);
        setError("No se pudo cargar la información de la propiedad");
      } finally {
        setLoading(false);
      }
    };

    // Execute the fetch only if we have an ID and haven't already fetched
    if (id && !fetchedRef.current) {
      fetchPropertyData();
    }

    // Cleanup function to reset the reference when the component unmounts
    return () => {
      fetchedRef.current = false;
    };
  }, [id]); // Remove axiosInstance from dependencies to prevent re-fetching

  // Function to handle contact form submission
  const handleSubmitContactForm = async (userData) => {
    // Submit user information to the API using shared service
    return await propertyService.submitContactForm(axiosInstance, userData);
  };

  return (
    <>
      <DrawerAppBar />
      <div style={{ marginTop: "100px" }}></div>
      <PropertyDetailView
        property={property}
        loading={loading}
        error={error}
        relatedProperties={relatedProperties}
        executeRecaptcha={executeRecaptcha}
        isDevelopmentMode={isDevelopmentMode}
        submitContactForm={handleSubmitContactForm}
        returnPath="/"
        isAdmin={false}
        propertyId={id}
      />
    </>
  );
}
