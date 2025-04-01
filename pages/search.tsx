import { Search } from "lucide-react";

interface SearchPageProps {
  searchValue: string;
}

export default function SearchPage({ searchValue }: SearchPageProps) {
  return (
    <main className="px-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-[#36bccf]" />
        <h1 className="text-2xl font-bold text-white">검색 결과</h1>
      </div>

      {searchValue ? (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              &ldquo;{searchValue}&rdquo; 검색 결과
            </h2>
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <p className="text-white/80">
                  일치하는 정원을 찾을 수 없습니다.
                </p>
              </div>
              <div className="text-white/60 text-sm">
                다른 검색어를 입력하거나 필터를 조정해보세요.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <p className="text-white/60 text-center max-w-md">
            검색어를 입력하여 정원, 책, 작가를 찾아보세요.
          </p>
        </div>
      )}
    </main>
  );
}
