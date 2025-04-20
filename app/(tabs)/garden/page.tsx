"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Interface for Book Search Result Item based on search-result.json
interface BookSearchResult {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  pubdate: string;
  isbn: string;
  description: string;
}

// Mock search results data (replace with actual API call later)
import mockSearchResults from "@/search-result.json"; // Assuming search-result.json is in the root or accessible path

const GardenPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Placeholder for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "채식주의자",
    "노르웨이의 숲",
    "사피엔스",
  ]);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // Prevent form submission page reload
    if (!searchQuery.trim()) return; // Don't search if query is empty

    setIsLoading(true);
    setSearchResults([]); // Clear previous results

    // Simulate API call
    // In a real app, you would fetch from an API endpoint:
    // const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
    // const data = await response.json();
    // For now, use mock data if the query matches "채식주의자"
    try {
      if (searchQuery.trim().toLowerCase() === "채식주의자") {
        // Limit results to 5-6 as requested
        const resultsToShow = mockSearchResults.items.slice(0, 6);
        setSearchResults(resultsToShow);

        // Add to recent searches (simple implementation)
        if (!recentSearches.includes(searchQuery)) {
          setRecentSearches(
            [searchQuery, ...recentSearches].slice(0, 5) // Keep only last 5
          );
        }
      } else {
        // Handle cases where mock data doesn't match or no results
        setSearchResults([]);
        console.log(
          "Mock data only available for '채식주의자'. No results for:",
          searchQuery
        );
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]); // Ensure results are cleared on error
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle deleting a recent search term
  const handleDeleteRecentSearch = (indexToDelete: number) => {
    setRecentSearches((prevSearches) =>
      prevSearches.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col pt-12">
      <div className="max-w-[680px] mx-auto w-full flex-grow">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="책 제목, 저자 등을 검색해보세요..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          {/* Add a search button if needed, or rely on Enter key */}
          {/* <button type="submit" className="mt-2 p-2 bg-blue-600 rounded">Search</button> */}
        </form>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center text-gray-400">검색 중...</div>
        )}

        {/* Conditional Display: Recent Searches or Search Results */}
        {!isLoading && searchResults.length === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              최근 검색어
            </h2>
            {recentSearches.length > 0 ? (
              <ul className="space-y-2">
                {recentSearches.map((term, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-gray-400 hover:text-white group text-base"
                  >
                    <span
                      className="cursor-pointer group-hover:text-blue-400"
                      onClick={() => {
                        setSearchQuery(term);
                        // handleSearch(); // Optionally trigger search on click
                      }}
                    >
                      {term}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent li's onClick if it exists
                        handleDeleteRecentSearch(index);
                      }}
                      className="text-xs text-gray-500 hover:text-blue-400 ml-2 px-1 rounded"
                      aria-label={`Remove ${term} from recent searches`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-gray-500">
                최근 검색 기록이 없습니다.
              </p>
            )}
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              검색 결과
            </h2>
            <ul className="space-y-4">
              {searchResults.map((book, index) => (
                <li
                  key={book.isbn || index} // Use ISBN as key if available
                  className="flex items-start space-x-4 p-3 bg-gray-900 rounded-lg border border-gray-700"
                >
                  <div className="flex-shrink-0">
                    {book.image && (
                      <Image
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        width={80} // Adjust size as needed
                        height={120} // Adjust size as needed
                        className="object-cover rounded"
                        unoptimized // If using external images without loader config
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <Link href="/garden/vegan" passHref legacyBehavior>
                      <a className="text-xl font-semibold text-blue-400 hover:underline">
                        {/* Basic HTML entity removal for display */}
                        {book.title.replace(/<\/?b>/g, "")}
                      </a>
                    </Link>
                    <p className="text-base text-gray-400 mt-1">
                      저자: {book.author.replace(/<\/?b>/g, "")} | 출판사:{" "}
                      {book.publisher}
                    </p>
                    <p className="text-base text-gray-500 mt-1">
                      출판일: {book.pubdate}
                    </p>
                    <p className="text-base text-gray-300 mt-2 line-clamp-3">
                      {book.description.replace(/<\/?b>/g, "")}
                    </p>
                    {/* Display price/discount if needed */}
                    {/* <p className="text-sm text-green-400 mt-1">가격: {book.discount}원</p> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Add some bottom padding to prevent content from sticking to the very bottom */}
        <div className="pb-16"></div>
      </div>
    </div>
  );
};

export default GardenPage;
