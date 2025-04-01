"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowLeft, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import SearchPage from "../../pages/search";

// Common search input style
const SEARCH_INPUT_STYLE =
  "w-full py-2 pl-11 pr-4 rounded-3xl bg-white/5 border border-white/10 text-white transition-all duration-200 focus:outline-none focus:border-[#36bccf] focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(54,188,207,0.2)] placeholder-[#94a3b8]";

// Export header height for other components to use for top margin
export const HEADER_HEIGHT = 73; // 24px (p-6) * 2 + remaining content height

interface SearchModalProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearchChange?: (isActive: boolean, value: string) => void;
  onClose: () => void;
}

const SearchModal = ({
  searchValue,
  setSearchValue,
  onClose,
  onSearchChange = () => {},
}: SearchModalProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const escPressedRef = useRef(false);
  const isComposingRef = useRef(false);

  // Focus handling
  const focusSearchInput = useCallback(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  }, []);

  useEffect(() => {
    focusSearchInput();
  }, [focusSearchInput]);

  // ESC key event handling for the entire document
  useEffect(() => {
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, [onClose]);

  // ESC key handling within the input field and composition event management
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        escPressedRef.current = true;
        if (isComposingRef.current) {
          setSearchValue("");
          onSearchChange(false, "");
        }
        onClose();
        setTimeout(() => {
          escPressedRef.current = false;
        }, 0);
      }
    },
    [onClose, onSearchChange, setSearchValue]
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    if (escPressedRef.current) {
      setSearchValue("");
      onSearchChange(false, "");
    }
  }, [onSearchChange, setSearchValue]);

  // Close when clicking outside the modal
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(true, value);
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchValue("");
    onSearchChange(true, "");
    focusSearchInput();
  };

  return (
    <div className="fixed inset-0 z-30">
      {/* Dark overlay that only covers the content area, not the sidebar */}
      <div className="fixed inset-y-0 left-[72px] right-0 bg-black opacity-100"></div>
      <div className="fixed inset-y-0 right-0 left-[72px] bg-black z-40">
        <div ref={modalRef} className="h-full">
          {/* Top search header */}
          <div className="sticky top-0 bg-black border-b border-white/10 shadow-lg z-40">
            <div className="p-6">
              <div className="relative">
                <div className={`relative ${SEARCH_INPUT_STYLE}`}>
                  {/* Back button */}
                  <button
                    type="button"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 bg-transparent border-0 w-6 h-6 flex items-center justify-center text-[#94a3b8] hover:text-[#36bccf] transition-colors duration-200 cursor-pointer"
                    onClick={onClose}
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-[18px] h-[18px]" />
                  </button>

                  {/* Search input field */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full bg-transparent focus:outline-none pl-2"
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    autoFocus
                  />

                  {/* Clear search button */}
                  {searchValue && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-transparent border-0 w-6 h-6 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search results area */}
          <div className="p-6 overflow-auto">
            <SearchPage searchValue={searchValue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isSignedIn } = useAuth();

  // Using empty dependency array to avoid dependency on searchValue
  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
    // Prevent scrolling on the body when search modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
    setSearchValue("");
    // Restore scrolling on the body when search modal is closed
    document.body.style.overflow = "";
  }, []);

  // Cleanup effect to ensure scrolling is restored if component unmounts while modal is open
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <header className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111] fixed top-0 left-[72px] right-0 z-20">
        <div className="relative flex-1">
          {/* Header search button */}
          <div
            className={`relative ${SEARCH_INPUT_STYLE} cursor-pointer hover:bg-white/8 hover:border-[#36bccf] hover:text-white transition-colors duration-200 group`}
            onClick={openSearchModal}
          >
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-[18px] h-[18px] text-[#94a3b8] group-hover:text-[#36bccf] transition-colors duration-200" />
            </div>

            {/* Search input field (inactive state) */}
            <input
              type="text"
              className="w-full bg-transparent focus:outline-none pl-2"
              placeholder="Search"
              value=""
              readOnly
              onClick={openSearchModal}
            />
          </div>
        </div>
        <div className="ml-4 w-8 h-8">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
              <span className="text-xs">?</span>
            </div>
          )}
        </div>
      </header>

      {/* Spacer div with the same height as the header to prevent content from being hidden */}
      <div style={{ height: HEADER_HEIGHT }} />

      {isSearchModalOpen && (
        <SearchModal
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onClose={closeSearchModal}
        />
      )}
    </>
  );
}
