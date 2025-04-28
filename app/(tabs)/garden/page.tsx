// app/garden/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InputBook } from "@/components/input";
import { Label } from "@/components/label";
import { BookMdMeta } from "@/components/book";
import dummyData from "./dummy-data.json"; // Import dummy data

interface BookItem {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  pubdate: string; // "YYYYMMDD"
  isbn: string;
  description: string;
}

export default function GardenPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Can be null initially

  // Initialize searchQuery state to empty string
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookItem[]>([]);

  // Function to update search results and URL
  const updateSearch = (query: string) => {
    const trimmedQuery = query.trim();
    // setBookSearchQuery(query); // InputBook handles setting this state via prop

    if (!trimmedQuery) {
      setSearchResults([]);
      // Only push if the path is not already /garden
      if (window.location.pathname + window.location.search !== "/garden") {
        router.push("/garden", { scroll: false });
      }
      console.log("Search query is empty. Cleared results and URL.");
      return;
    }

    setSearchResults(dummyData.items);
    const targetUrl = `/garden?q=${encodeURIComponent(trimmedQuery)}`;
    // Only push if the URL is different
    if (window.location.pathname + window.location.search !== targetUrl) {
      router.push(targetUrl, { scroll: false });
    }
    console.log("Dummy search results:", dummyData.items);
  };

  // useEffect to read URL query on mount and set initial state
  useEffect(() => {
    // searchParams might be null on initial render, check inside useEffect
    const initialQueryFromUrl = searchParams?.get("q") || "";
    if (initialQueryFromUrl) {
      console.log("Initial query from URL:", initialQueryFromUrl);
      setBookSearchQuery(initialQueryFromUrl); // Set state from URL
      // Since we're using dummy data, set results directly
      setSearchResults(dummyData.items);
      console.log("Set initial dummy search results based on URL query.");
      // If using API: updateSearch(initialQueryFromUrl); // Or call API fetch directly
    }
  }, [searchParams]); // Re-run if searchParams object changes

  const handleBookSearch = async (query: string): Promise<void> => {
    console.log("Handling search for:", query);
    // Update the input state immediately when search is triggered
    setBookSearchQuery(query);
    updateSearch(query);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen max-w-[720px] mx-auto px-4">
      {searchResults.length === 0 ? (
        <Label className="mb-6 mt-8 text-center">
          읽은 책을 검색하고, 새로운 대화를 시작해보세요.
        </Label>
      ) : (
        <Label className="mb-4 mt-4">{""}</Label>
      )}
      <InputBook
        searchQuery={bookSearchQuery}
        setSearchQuery={setBookSearchQuery}
        onSearch={handleBookSearch}
      />
      <div className="flex flex-col gap-2 w-full">
        {searchResults.map((book) => (
          <div key={book.isbn} className="mb-4">
            <BookMdMeta
              imageUrl={book.image}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              publicationDate={
                book.pubdate.length === 8
                  ? `${book.pubdate.slice(0, 4)}. ${book.pubdate.slice(
                      4,
                      6
                    )}. ${book.pubdate.slice(6, 8)}.`
                  : book.pubdate
              }
              link={"/garden/vegan"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
