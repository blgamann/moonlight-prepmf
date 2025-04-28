import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
}

/**
 * 범용 텍스트 입력 컴포넌트
 */
export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  className = "",
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full pr-12 pl-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out placeholder-gray-500 focus:outline-none focus:border-[#6ABECF] focus:bg-white/15 ${className}`}
    />
  );
}

/**
 * 로그인 아이디 입력 필드
 */
export function InputId(props: Omit<InputProps, "type">) {
  return <Input type="text" placeholder="이메일 또는 전화번호" {...props} />;
}

/**
 * 로그인 패스워드 입력 필드
 */
export function InputPassword(props: Omit<InputProps, "type">) {
  return <Input type="password" placeholder="비밀번호" {...props} />;
}

export interface BookSearchProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (query: string) => Promise<void>;
}

export function InputBook({
  searchQuery,
  setSearchQuery,
  onSearch,
}: BookSearchProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    await onSearch(searchQuery.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="책 제목, 저자"
          className="w-full pr-12 pl-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-base placeholder-gray-500 focus:outline-none focus:border-[#6ABECF] focus:bg-white/15"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 focus:outline-none"
          style={{ width: 48 }}
          aria-label="Search"
        >
          <div className="bg-[#6ABECF] rounded-full p-1.5 flex items-center justify-center hover:cursor-pointer">
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
  );
}
