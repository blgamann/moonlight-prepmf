"use client";

import Sidebar from "@/components/app/sidebar";
import Header from "@/components/app/header";
import MainPage from "@/pages/main";
import { useState } from "react";

export default function App() {
  // Store search state for potential future use in other components
  const [searchState, setSearchState] = useState({
    isActive: false,
    value: "",
  });

  const handleSearchChange = (isActive: boolean, value: string) => {
    setSearchState({ isActive, value });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Sidebar />
      <div className="ml-[72px] w-[calc(100%-72px)]">
        <Header onSearchChange={handleSearchChange} />

        <MainPage />
      </div>
    </div>
  );
}
