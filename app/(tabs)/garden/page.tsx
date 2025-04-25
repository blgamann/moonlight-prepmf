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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 flex flex-col justify-center">
      {searchResults.length === 0 && (
        <div className="text-center font-semibold text-white/90 mt-12 text-xl">
          읽은 책을 검색하고, 새로운 대화를 시작해보세요.
        </div>
      )}
      <div className="max-w-[680px] mx-auto w-full mt-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative flex items-center">
            {/* Removed left icon */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="책 제목, 저자"
              // Adjusted padding: removed pl-10, added pr-12 for button space
              className="w-full pr-12 pl-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out placeholder-gray-500 focus:outline-none focus:border-[#6ABECF] focus:bg-white/15"
            />
            <button
              type="submit" // Trigger form submission
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-white focus:outline-none"
              style={{ width: "48px" }} // Ensure button has enough space
              aria-label="Search"
            >
              {/* Circular background (can be styled further) */}
              <div className="bg-[#6ABECF] rounded-full p-1.5 flex items-center justify-center hover:cursor-pointer">
                {/* Search Icon SVG */}
                <svg
                  className="h-5 w-5 text-white/85"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        </form>

        {/* Conditional Display: Recent Searches or Search Results */}

        {!isLoading && searchResults.length > 0 && (
          <div>
            <h2 className="text-xl mb-4 mt-12 font-['NanumMyeongjo']">
              검색 결과
            </h2>
            <ul className="space-y-3">
              {searchResults.map((book, index) => (
                <li
                  key={book.isbn || index} // Use ISBN as key if available
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
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
                  <div className="flex-grow flex flex-col justify-center h-[120px]">
                    <Link href="/garden/vegan" passHref legacyBehavior>
                      <a className="text-lg font-semibold text-white hover:underline mb-1 line-clamp-2">
                        {/* Basic HTML entity removal for display */}
                        {book.title.replace(/<\/?b>/g, "")}
                      </a>
                    </Link>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">저자</span>{" "}
                      <span className="text-gray-400">
                        {book.author.replace(/<\/?b>/g, "")}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">출판</span>{" "}
                      <span className="text-gray-400">
                        {book.publisher} ·{" "}
                        {
                          book.pubdate && book.pubdate.length === 8
                            ? `${book.pubdate.substring(
                                0,
                                4
                              )}. ${book.pubdate.substring(
                                4,
                                6
                              )}. ${book.pubdate.substring(6, 8)}.`
                            : book.pubdate /* Fallback if format is unexpected */
                        }
                      </span>
                    </p>
                    {/* Removed description and price */}
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
