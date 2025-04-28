"use client";

import { useState } from "react";
import { Input, InputId, InputPassword, InputBook } from "@/components/input";

export default function InputComponents() {
  const [textValue, setTextValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  const handleBookSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", bookSearchQuery);
    // Add actual search logic here if needed
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 text-3xl">
      <h1>Input Component Tests</h1>

      <h2 className="mt-4 text-xl">Input</h2>
      <Input
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter text here"
      />

      <h2 className="mt-4 text-xl">InputId</h2>
      <InputId value={idValue} onChange={(e) => setIdValue(e.target.value)} />

      <h2 className="mt-4 text-xl">InputPassword</h2>
      <InputPassword
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />

      <h2 className="mt-4 text-xl">InputBook</h2>
      <InputBook
        searchQuery={bookSearchQuery}
        setSearchQuery={setBookSearchQuery}
        onSearch={handleBookSearch}
      />
    </div>
  );
}
