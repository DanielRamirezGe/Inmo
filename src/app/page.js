"use client";
import React from "react";
import MainHeader from "./components/mainHeader";
import PropertiesGrid from "@/components/PropertiesGrid";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function Home() {
  // No drawer state needed - using page navigation now

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      <MainHeader />
      <PropertiesGrid
        key="home-properties-grid"
        // No onPropertyClick - will use default page navigation
      />

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
