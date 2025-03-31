"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowLeft, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import SearchPage from "../../pages/search";

interface HeaderProps {
  onSearchChange?: (isActive: boolean, value: string) => void;
}

// 검색 관련 공통 스타일 및 컴포넌트
const SEARCH_INPUT_STYLE =
  "w-full py-2 pl-11 pr-4 rounded-3xl bg-white/5 border border-white/10 text-white transition-all duration-200 focus:outline-none focus:border-[#36bccf] focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(54,188,207,0.2)] placeholder-[#94a3b8]";

// 검색 아이콘 컴포넌트
const SearchIcon = () => (
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94a3b8]" />
);

// 검색 입력 필드 컴포넌트
const SearchInput = ({
  value,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  placeholder = "검색",
  autoFocus = false,
  readOnly = false,
  onClick,
}: {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
}) => (
  <input
    type="text"
    className="w-full bg-transparent focus:outline-none"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onCompositionStart={onCompositionStart}
    onCompositionEnd={onCompositionEnd}
    autoFocus={autoFocus}
    readOnly={readOnly}
    onClick={onClick}
  />
);

// 검색 모달 컴포넌트
const SearchModal = ({
  searchValue,
  setSearchValue,
  onSearchChange,
  onClose,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearchChange: (isActive: boolean, value: string) => void;
  onClose: () => void;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const escPressedRef = useRef(false);
  const isComposingRef = useRef(false);

  // 포커스 처리
  const focusSearchInput = useCallback(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  }, []);

  useEffect(() => {
    focusSearchInput();
  }, [focusSearchInput]);

  // 문서 레벨 ESC 이벤트
  useEffect(() => {
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [onClose]);

  // 입력창 내 ESC 처리
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

  // 모달 외부 클릭 시 닫기
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
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
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
      <div className="fixed inset-y-0 right-0 left-[72px] bg-black/70 backdrop-blur-sm">
        <div ref={modalRef} className="h-full">
          {/* 상단 검색 헤더 */}
          <div className="sticky top-0 bg-[#111] border-b border-white/10 shadow-lg z-40">
            <div className="p-6">
              <div className="relative">
                <div className={`relative ${SEARCH_INPUT_STYLE}`}>
                  <SearchIcon />
                  <SearchInput
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    autoFocus
                  />
                  {searchValue && (
                    <button
                      type="button"
                      className="absolute right-12 top-1/2 -translate-y-1/2 z-10 bg-transparent border-0 w-6 h-6 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      onClick={handleClearSearch}
                      aria-label="검색어 지우기"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-transparent border-0 w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#36bccf] transition-colors duration-200 cursor-pointer"
                    onClick={onClose}
                    aria-label="닫기"
                  >
                    <ArrowLeft className="w-[18px] h-[18px] transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 검색 결과 영역 */}
          <div className="p-6 overflow-auto">
            <SearchPage searchValue={searchValue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Header({ onSearchChange }: HeaderProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { isSignedIn } = useAuth();

  // Default empty function if onSearchChange is not provided
  const handleSearchChange = useCallback(
    (isActive: boolean, value: string) => {
      onSearchChange?.(isActive, value);
    },
    [onSearchChange]
  );

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
    handleSearchChange(true, searchValue);
  }, [handleSearchChange, searchValue]);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
    setSearchValue("");
    handleSearchChange(false, "");
  }, [handleSearchChange]);

  return (
    <>
      <header className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111] relative z-10">
        <div className="relative flex-1">
          <div
            className={`relative ${SEARCH_INPUT_STYLE} cursor-pointer`}
            onClick={openSearchModal}
          >
            <SearchIcon />
            <SearchInput
              value=""
              placeholder="검색"
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

      {isSearchModalOpen && (
        <SearchModal
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearchChange={handleSearchChange}
          onClose={closeSearchModal}
        />
      )}
    </>
  );
}
