import { MoveLeft, MoveRight } from "lucide-react";
import { BookSm, BookSmProps } from "./book";
import { ProfileSmIndex, ProfileBaseProps as ProfileSmProps } from "./profile";
import { ButtonDeep } from "./button";

export function IndexBack({ back }: { back?: string }) {
  return (
    <div className="flex items-center gap-2">
      <MoveLeft className="text-white/60" />
      {back && (
        <span className="text-white/60 text-base cursor-pointer hover:underline">
          {back}
        </span>
      )}
    </div>
  );
}

export function IndexForward({ forward }: { forward?: string }) {
  return (
    <div className="flex items-center gap-2">
      {forward && (
        <span className="text-white/60 text-base cursor-pointer hover:underline">
          {forward}
        </span>
      )}
      <MoveRight className="text-white/60" />
    </div>
  );
}

export function IndexTop({
  profile,
  className,
}: {
  profile: ProfileSmProps;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center border-b border-white/5 px-6 py-4 h-16 ${className}`}
    >
      <div className="text-white/60 text-base">2024년 04월 26일</div>
      {profile && <ProfileSmIndex {...profile} />}
    </div>
  );
}

export function IndexTopBack({
  back,
  title,
  book,
  profile,
  totalPages,
  currentPage,
  className,
}: {
  back?: string;
  title: string;
  book?: BookSmProps;
  profile?: ProfileSmProps;
  totalPages?: number;
  currentPage?: number;
  className?: string;
}) {
  if (book && profile) {
    throw new Error("book과 profile은 동시에 존재할 수 없습니다.");
  }

  return (
    <div
      className={`relative flex items-center border-b border-white/5 px-6 py-4 h-16 ${className}`}
    >
      {/* 좌측 */}
      <IndexBack back={back} />

      <div
        className="
          absolute
          left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          min-w-[180px]
          max-w-[60%]"
      >
        <div
          className="
          text-center
          whitespace-nowrap
          overflow-hidden
          text-ellipsis
          text-white/95
          text-base font-['NanumMyeongjo']
          line-clamp-1 
        "
        >
          {title}
        </div>
        {totalPages && currentPage && (
          <div className="text-center text-white/40 text-xs tracking-widest">
            {currentPage}/{totalPages}
          </div>
        )}
      </div>

      {/* 우측 (절대 위치) */}
      {(book || profile) && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center h-full overflow-hidden">
          {book && (
            // 높이를 컨테이너에 맞추기 위해 h-full 추가
            <div className="h-full flex flex-col items-center justify-center">
              <BookSm {...book} />
            </div>
          )}
          {profile && <ProfileSmIndex {...profile} />}
        </div>
      )}
    </div>
  );
}

export function IndexBottom({
  back,
  forward,
}: {
  back?: string;
  forward?: string;
}) {
  return (
    <div className="flex justify-between items-center border-t border-white/5 px-6 py-4 h-18">
      <IndexBack back={back} />
      <IndexForward forward={forward} />
    </div>
  );
}

export function IndexBottomButton({
  back,
  forward,
  className,
}: {
  back?: string;
  forward?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between items-center border-t border-white/5 px-6 py-4 h-20 ${className}`}
    >
      <IndexBack back={back} />
      <ButtonDeep />
      <IndexForward forward={forward} />
    </div>
  );
}
