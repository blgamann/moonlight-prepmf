"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
// lodash/debounce를 직접 임포트하여 번들 사이즈 최적화
import debounce from "lodash/debounce";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import contents from "@/app/dummy/contents.json";

/* =======================
   타입 및 상수 정의
========================= */

// 가독성을 위해 타입을 명시적으로 export (필수는 아님)
export type CardSize = "L" | "M" | "S";

export interface MetaData {
  soulLinkCount: number;
  memberCount: number;
  questionCount: number;
  answerCount: number;
}

export interface CardData {
  id: number;
  title: string;
  popularity: "high" | "medium" | "low";
  imageUrl?: string;
  questionText: string;
  description: string;
  meta: MetaData;
}

export interface LayoutDefinitionItem {
  size: CardSize;
  contentId: number;
}

export interface LayoutItem extends LayoutDefinitionItem {
  data: CardData;
}

// 카드 스펙: 객체의 키를 CardSize 타입으로 명시
const CARD_SPECS: Record<CardSize, { height: string; baseWidth: string }> = {
  L: { height: "h-[300px]", baseWidth: "basis-[900px]" }, // L만 고정 높이
  M: { height: "min-h-[180px]", baseWidth: "basis-[600px]" }, // M/S는 최소 높이 추가 가능성 고려
  S: { height: "min-h-[120px]", baseWidth: "basis-[400px]" }, // 최소 높이 설정 (예시)
};

// 샘플 콘텐츠 데이터 (타입 단언 명확화)
const allContent: CardData[] = contents as CardData[];

// 반응형 레이아웃 패턴 정의 (변경 없음)
const layoutPatterns: Record<string, LayoutDefinitionItem[][]> = {
  default: [
    [{ size: "L", contentId: 1 }],
    [{ size: "M", contentId: 2 }],
    [{ size: "S", contentId: 3 }],
    [{ size: "M", contentId: 4 }],
    [{ size: "L", contentId: 5 }],
    [{ size: "S", contentId: 6 }],
  ],
  sm: [
    [{ size: "L", contentId: 1 }],
    [
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ],
    [
      { size: "S", contentId: 6 },
      { size: "S", contentId: 8 },
    ],
    [{ size: "M", contentId: 4 }],
  ],
  md: [
    [{ size: "L", contentId: 1 }],
    [
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ],
    [
      { size: "M", contentId: 4 },
      { size: "S", contentId: 6 },
    ],
    [
      { size: "L", contentId: 5 },
      { size: "S", contentId: 8 },
    ],
  ],
  lg: [
    [
      { size: "L", contentId: 1 },
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ],
    [
      { size: "M", contentId: 4 },
      { size: "S", contentId: 6 },
      { size: "L", contentId: 5 },
    ],
    [
      { size: "S", contentId: 8 },
      { size: "S", contentId: 10 },
      { size: "M", contentId: 9 },
      { size: "S", contentId: 13 },
    ],
    [
      { size: "L", contentId: 7 },
      { size: "L", contentId: 11 },
    ],
  ],
};

// Tailwind 기본 브레이크포인트 (변경 없음)
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

// 최적화: 콘텐츠 ID를 키로 하는 Map 생성 (O(1) 조회)
const contentMap = new Map<number, CardData>(
  allContent.map((content) => [content.id, content])
);

/* =======================
   헬퍼 함수들
========================= */

const getLayoutPatternForWidth = (width: number): LayoutDefinitionItem[][] => {
  // 변경 없음
  if (width >= breakpoints.lg) return layoutPatterns.lg;
  if (width >= breakpoints.md) return layoutPatterns.md;
  if (width >= breakpoints.sm) return layoutPatterns.sm;
  return layoutPatterns.default;
};

// 최적화: 기본 스타일 문자열을 상수로 분리하여 가독성 향상
const BASE_CARD_STYLE =
  "bg-gradient-to-br from-[#111] to-[#181818] overflow-hidden rounded-lg shadow-lg border border-[#6dd1e4]/10 transition-all duration-150 ease-in-out hover:border-[#6dd1e4]/30";

const getCardContainerClasses = (size: CardSize): string => {
  const spec = CARD_SPECS[size];
  // M, S 카드에 최소 높이 추가 또는 기존 min-h-fit 유지 가능
  const heightClass = spec.height || "min-h-fit"; // M, S에 고정 높이 없으면 최소 높이 유지
  const flexClasses = `grow shrink ${spec.baseWidth}`;
  return `${flexClasses} ${heightClass} ${BASE_CARD_STYLE}`;
};

// 최적화: fallback 데이터 생성을 함수 밖으로 빼거나 useMemo로 감싸 불필요한 재생성 방지 (여기선 간단하게 유지)
const getFallbackData = (contentId: number): CardData => ({
  id: -1, // 명확한 식별자
  title: `콘텐츠 ID ${contentId} 로드 실패`,
  popularity: "low",
  imageUrl: undefined, // imageUrl이 없을 수 있음을 명시
  questionText: "데이터를 찾을 수 없습니다.",
  description: "요청한 콘텐츠가 존재하지 않거나 로드 중 오류가 발생했습니다.",
  meta: { soulLinkCount: 0, memberCount: 0, questionCount: 0, answerCount: 0 },
});

/* =======================
   커스텀 훅: useResponsiveLayout
========================= */

function useResponsiveLayout(): LayoutItem[][] {
  // populateLayout 함수를 useState 이전에 정의
  const populateLayout = useCallback(
    (pattern: LayoutDefinitionItem[][]): LayoutItem[][] => {
      return pattern
        .map((row) =>
          row.map((itemDef) => {
            const content = contentMap.get(itemDef.contentId);
            return content
              ? { ...itemDef, data: content }
              : { ...itemDef, data: getFallbackData(itemDef.contentId) };
          })
        )
        .filter((row) => row.length > 0);
    },
    []
  );

  const [layout, setLayout] = useState<LayoutItem[][]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const initialPattern = getLayoutPatternForWidth(window.innerWidth);
    return populateLayout(initialPattern);
  });

  const updateLayout = useCallback(() => {
    const currentPattern = getLayoutPatternForWidth(window.innerWidth);
    setLayout(populateLayout(currentPattern));
  }, [populateLayout]); // populateLayout 함수 자체를 의존성으로 추가

  // 최적화: debounce 딜레이 조절 가능 (150ms는 적절해 보임)
  const debouncedUpdate = useMemo(
    () => debounce(updateLayout, 150),
    [updateLayout]
  );

  useEffect(() => {
    // 초기 마운트 시 클라이언트 사이드에서 레이아웃 재계산 (SSR 결과와 다를 수 있음)
    updateLayout();

    window.addEventListener("resize", debouncedUpdate);
    return () => {
      debouncedUpdate.cancel(); // 컴포넌트 언마운트 시 debounce 취소
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [updateLayout, debouncedUpdate]); // updateLayout은 useCallback으로 안정화됨

  return layout;
}

/* =======================
   컴포넌트: CardContent
   최적화: React.memo 적용 고려 (props가 복잡하지 않아 효과는 미미할 수 있음)
========================= */

interface CardContentProps {
  item: LayoutItem; // data 객체는 동일 참조일 가능성이 높음
}

// React.memo를 사용하면 item prop이 (얕은 비교로) 동일할 경우 리렌더링 방지
const CardContent: React.FC<CardContentProps> = memo(({ item }) => {
  const { size, data } = item;
  const { title, imageUrl, questionText, description, meta } = data;

  // 데이터 로딩 실패 시 표시 개선
  if (data.id === -1) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <p className="text-white/70 text-center">{data.title}</p>
      </div>
    );
  }

  const questionSizeClass =
    size === "L"
      ? "text-xl sm:text-2xl"
      : size === "M"
      ? "text-lg sm:text-xl"
      : "text-base sm:text-lg";

  const imageContainerWidthClass =
    size === "L" ? "w-[200px]" : size === "M" ? "w-[133px]" : "w-[100px]";

  // 이미지 sizes 속성 설명:
  // 브라우저는 이 정보를 사용하여 다양한 화면 크기에서 어떤 해상도의 이미지를 로드할지 결정합니다.
  // 예: "(max-width: 640px) 100px" -> 화면 너비 640px 이하에서는 이미지 렌더링 너비가 100px임을 의미.
  // 이 값은 실제 레이아웃과 카드 크기에 따라 더 정확하게 설정할수록 좋습니다.
  const imageSizes =
    size === "L"
      ? "(max-width: 640px) 200px, 200px" // 예시: sm 이하 200, 그 이상 200
      : size === "M"
      ? "(max-width: 640px) 133px, 133px" // 예시: sm 이하 133, 그 이상 133
      : "(max-width: 640px) 100px, 100px"; // S 카드 (이미지 표시 안 함)

  return (
    <div
      className={`flex h-full w-full ${
        size !== "S" ? "flex-row" : "flex-row items-start" // S 카드는 시작 정렬 유지
      }`}
    >
      {/* S 사이즈에서는 이미지 표시 안 함 (기존 로직 유지) */}
      {size !== "S" && imageUrl && (
        <div
          className={`relative ${imageContainerWidthClass} flex-shrink-0 h-full overflow-hidden rounded-l-lg`}
        >
          {/* Image 컴포넌트 최적화: priority, sizes 속성 활용 */}
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={`${title} 표지 이미지`} // alt 텍스트 개선
              fill
              className="object-contain" // 이미지가 잘리지 않도록 contain 사용 (cover도 가능)
              priority={size === "L"} // L 사이즈 카드는 중요도가 높다고 가정
              sizes={imageSizes} // 최적화된 이미지 로드를 위해 sizes 명시
            />
          </div>
        </div>
      )}
      <div
        className={`flex flex-1 flex-col p-3 sm:p-4 ${
          size === "S" ? "justify-start" : "justify-between" // S는 위에서부터 채우기, M/L은 공간 분배
        } space-y-1 sm:space-y-2 overflow-hidden`}
      >
        {/* 상단 텍스트 컨텐츠 */}
        <div className="flex-grow">
          {" "}
          {/* 텍스트 영역이 남은 공간 차지 */}
          <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
            {title}
          </p>
          <h2
            className={`${questionSizeClass} font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2`}
            title={questionText} // 긴 텍스트 title 속성 추가
          >
            {questionText}
          </h2>
          {/* 설명은 카드 크기에 따라 line-clamp 조절 */}
          <p
            className={`text-sm text-white/70 ${
              size === "L"
                ? "line-clamp-3 sm:line-clamp-4"
                : size === "M"
                ? "line-clamp-2 sm:line-clamp-3"
                : "line-clamp-2" // S
            }`}
            title={description} // 긴 텍스트 title 속성 추가
          >
            {description}
          </p>
        </div>

        {/* 하단 메타 정보 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-white/10 mt-auto flex-shrink-0">
          {/* flex-shrink-0 추가하여 메타 정보가 줄어들지 않도록 */}
          <span className="flex items-center text-xs text-white/60">
            <LinkIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 소울링크{" "}
            {meta.soulLinkCount.toLocaleString()}쌍
          </span>
          <span className="flex items-center text-xs text-white/60">
            <UserGroupIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 멤버{" "}
            {meta.memberCount.toLocaleString()}명
          </span>
          <span className="flex items-center text-xs text-white/60">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />{" "}
            질문 {meta.questionCount.toLocaleString()}개
          </span>
          <span className="flex items-center text-xs text-white/60">
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />{" "}
            답변 {meta.answerCount.toLocaleString()}개
          </span>
        </div>
      </div>
    </div>
  );
});
CardContent.displayName = "CardContent"; // Memo 컴포넌트 디버깅 이름 설정

/* =======================
   컴포넌트: Card
   최적화: React.memo 적용
========================= */

interface CardProps {
  item: LayoutItem;
}

// React.memo 적용: item prop이 (얕은 비교로) 동일하면 리렌더링 방지
const Card: React.FC<CardProps> = memo(({ item }) => (
  <div className={getCardContainerClasses(item.size)}>
    <CardContent item={item} />
  </div>
));
Card.displayName = "Card"; // Memo 컴포넌트 디버깅 이름 설정

/* =======================
   메인 페이지 컴포넌트: HomePage
========================= */

export default function HomePage() {
  const currentLayout = useResponsiveLayout();

  return (
    <div className="w-full min-h-screen bg-black p-1 sm:p-2">
      <div className="flex flex-col gap-1 sm:gap-2">
        {currentLayout.map((row, rowIndex) => (
          // 행에도 고유 key 부여 (rowIndex는 안정적임)
          <div
            key={`row-${rowIndex}`}
            className="flex flex-row flex-nowrap items-stretch gap-1 sm:gap-2" // items-stretch 추가하여 카드 높이 맞춤 시도
          >
            {row.map((item) => (
              // 최적화: Memoized Card 컴포넌트 사용
              // key는 contentId와 size 조합 또는 고유 ID 사용 고려 (data.id가 고유하다면 사용)
              <Card
                key={
                  item.data.id !== -1
                    ? item.data.id
                    : `fallback-${item.contentId}`
                }
                item={item}
              />
            ))}
          </div>
        ))}
        {/* 로딩 상태 또는 빈 상태 표시 개선 */}
        {currentLayout.length === 0 && contentMap.size > 0 && (
          <p className="text-center text-white/60 py-10">
            현재 화면 크기에 맞는 레이아웃을 구성 중이거나 표시할 콘텐츠가
            없습니다.
          </p>
        )}
        {contentMap.size === 0 && (
          <p className="text-center text-white/60 py-10">
            표시할 콘텐츠 데이터가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
