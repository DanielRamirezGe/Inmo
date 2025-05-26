"use client";
import * as React from "react";
import styles from "./page.module.css";
import MainHeader from "./components/mainHeader";
import DrawerAppBar from "./components/navBarGen";
import PropertiesGrid from "@/components/PropertiesGrid";

export default function Home() {
  return (
    <>
      <DrawerAppBar />
      <MainHeader />
      <PropertiesGrid key="home-properties-grid" />
    </>
  );
}
