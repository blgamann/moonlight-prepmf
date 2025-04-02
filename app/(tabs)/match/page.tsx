"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import debounce from "lodash/debounce";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

import contents from "@/app/dummy/contents.json";

/* ==========================
   1. 타입 정의 (변경 없음)
============================= */
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

/* ==========================
   2. 상수 정의 (*** 변경됨 ***)
============================= */
const CARD_SPECS: Record<CardSize, { height: string; baseWidth: string }> = {
  L: { height: "h-[300px]", baseWidth: "basis-[900px]" },
  // --- 변경점: min-h-[180px] 를 h-[180px] 로 변경 ---
  // 이렇게 하면 MediumCard 컨테이너의 높이가 180px로 고정되어
  // 내부 이미지 컨테이너의 h-full 이 명확한 높이를 상속받을 수 있습니다.
  M: { height: "h-[180px]", baseWidth: "basis-[600px]" },
  // -------------------------------------------------
  S: { height: "min-h-[120px]", baseWidth: "basis-[400px]" },
};

// 반응형 중단점 (Tailwind 기본값과 일치)
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

// 기본 카드 스타일
const BASE_CARD_STYLE =
  "bg-gradient-to-br from-[#111] to-[#181818] overflow-hidden rounded-lg shadow-lg border border-[#6dd1e4]/10 transition-all duration-150 ease-in-out hover:border-[#6dd1e4]/30 flex"; // flex for internal layout

// 다양한 화면 크기에 대한 레이아웃 패턴 정의 (변경 없음)
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

/* ==========================
   3. 데이터 로딩 및 맵핑 (변경 없음)
============================= */
const allContent: CardData[] = contents as CardData[];
const contentMap = new Map<number, CardData>(
  allContent.map((content) => [content.id, content])
);

/* ==========================
   4. 헬퍼 함수 (변경 없음)
============================= */
const getLayoutPatternForWidth = (width: number): LayoutDefinitionItem[][] => {
  if (width >= breakpoints.lg) return layoutPatterns.lg;
  if (width >= breakpoints.md) return layoutPatterns.md;
  if (width >= breakpoints.sm) return layoutPatterns.sm;
  return layoutPatterns.default;
};

const getCardContainerClasses = (size: CardSize): string => {
  const spec = CARD_SPECS[size];
  return `grow shrink ${spec.baseWidth} ${spec.height} ${BASE_CARD_STYLE}`;
};

const getFallbackData = (contentId: number): CardData => ({
  id: -1,
  title: `콘텐츠 ID ${contentId} 로딩 실패`,
  popularity: "low",
  imageUrl: undefined,
  questionText: "데이터를 찾을 수 없습니다.",
  description: "요청한 콘텐츠가 없거나 `contents.json` 파일을 확인해주세요.",
  meta: { soulLinkCount: 0, memberCount: 0, questionCount: 0, answerCount: 0 },
});

/* ==========================
   5. 커스텀 훅: useResponsiveLayout (변경 없음)
============================= */
function useResponsiveLayout(): LayoutItem[][] {
  const [layout, setLayout] = useState<LayoutItem[][]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const populateLayout = useCallback(
    (pattern: LayoutDefinitionItem[][]): LayoutItem[][] => {
      return pattern
        .map((row) =>
          row.map((itemDef) => {
            const content = contentMap.get(itemDef.contentId);
            const data = content ?? getFallbackData(itemDef.contentId);
            return { ...itemDef, data };
          })
        )
        .filter((row) => row.length > 0);
    },
    []
  );

  const updateLayout = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentPattern = getLayoutPatternForWidth(window.innerWidth);
      setLayout(populateLayout(currentPattern));
    }
  }, [populateLayout]);

  const debouncedUpdateLayout = useMemo(
    () => debounce(updateLayout, 150),
    [updateLayout]
  );

  useEffect(() => {
    setIsMounted(true);
    updateLayout();
    window.addEventListener("resize", debouncedUpdateLayout);
    return () => {
      debouncedUpdateLayout.cancel();
      window.removeEventListener("resize", debouncedUpdateLayout);
    };
  }, [updateLayout, debouncedUpdateLayout]);

  if (!isMounted) {
    return [];
  }

  return layout;
}

/* ==========================
   6. 컴포넌트: CardMetaInfo (변경 없음)
============================= */
interface CardMetaInfoProps {
  meta: MetaData;
}

const CardMetaInfo: React.FC<CardMetaInfoProps> = memo(({ meta }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-white/10 mt-auto flex-shrink-0">
    <span className="flex items-center text-xs text-white/60">
      <LinkIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 소울링크{" "}
      {meta.soulLinkCount.toLocaleString()}쌍
    </span>
    <span className="flex items-center text-xs text-white/60">
      <UserGroupIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 멤버{" "}
      {meta.memberCount.toLocaleString()}명
    </span>
    <span className="flex items-center text-xs text-white/60">
      <QuestionMarkCircleIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 질문{" "}
      {meta.questionCount.toLocaleString()}개
    </span>
    <span className="flex items-center text-xs text-white/60">
      <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />{" "}
      답변 {meta.answerCount.toLocaleString()}개
    </span>
  </div>
));
CardMetaInfo.displayName = "CardMetaInfo";

/* ==========================
   7. 컴포넌트: 크기별 카드 컴포넌트 (테스트용 외부 URL 유지)
============================= */
interface SizeSpecificCardProps {
  data: CardData;
  meta: MetaData;
}

// --- LargeCard (테스트용 외부 URL 유지) ---
const LargeCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, imageUrl, questionText, description } = data;

  return (
    <div className="flex h-full w-full flex-row">
      {/* 테스트를 위해 imageUrl 대신 외부 URL 하드코딩 */}
      {true && ( // imageUrl 조건 대신 항상 보이도록
        <div className="relative w-[200px] flex-shrink-0 h-full overflow-hidden rounded-l-lg">
          <Image
            src={
              "https://publicdomainarchive.com/wp-content/uploads/2017/09/free-stock-photos-public-domain-images-003-667x1000-192684_667x675.jpg"
            }
            alt={`${title} cover image`}
            fill
            className="object-cover"
            priority
            sizes="200px"
            onError={(e) => {
              console.error(
                `Large Card Image loading error for TEST URL:`,
                e.currentTarget.currentSrc
              );
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-between space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow min-h-0">
          <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
            {title}
          </p>
          <h2
            className="text-xl sm:text-2xl font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
            title={questionText}
          >
            {questionText}
          </h2>
          <p
            className="text-sm text-white/70 line-clamp-3 sm:line-clamp-4"
            title={description}
          >
            {description}
          </p>
        </div>
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
LargeCard.displayName = "LargeCard";

// --- MediumCard (테스트용 외부 URL 유지) ---
const MediumCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, imageUrl, questionText, description } = data;

  // 이제 부모 Card의 높이가 h-[180px]로 고정되었으므로,
  // 아래 div의 h-full은 180px 높이를 상속받아 fill 이 정상 작동해야 합니다.
  return (
    <div className="flex h-full w-full flex-row">
      {/* 테스트를 위해 imageUrl 대신 외부 URL 하드코딩 */}
      {true && ( // imageUrl 조건 대신 항상 보이도록
        <div className="relative w-[133px] flex-shrink-0 h-full overflow-hidden rounded-l-lg">
          <Image
            src={
              "https://publicdomainarchive.com/wp-content/uploads/2017/09/free-stock-photos-public-domain-images-003-667x1000-192684_667x675.jpg"
            }
            alt={`${title} cover image`}
            fill // fill requires parent with position:relative and dimensions
            className="object-cover" // Scales image nicely
            priority // Optionally prioritize if often above the fold
            sizes="133px" // Informative size for next/image
            onError={(e) => {
              console.error(
                `Medium Card Image loading error for TEST URL:`,
                e.currentTarget.currentSrc
              );
            }}
          />
        </div>
      )}
      {/* Text Content Area */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-between space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow min-h-0">
          <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
            {title}
          </p>
          <h2
            className="text-lg sm:text-xl font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
            title={questionText}
          >
            {questionText}
          </h2>
          <p
            className="text-sm text-white/70 line-clamp-2 sm:line-clamp-3"
            title={description}
          >
            {description}
          </p>
        </div>
        {/* Meta info */}
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
MediumCard.displayName = "MediumCard";

// --- SmallCard (변경 없음) ---
const SmallCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, questionText, description } = data;

  return (
    <div className="flex h-full w-full flex-row items-start">
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-start space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow min-h-0">
          <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
            {title}
          </p>
          <h2
            className="text-base sm:text-lg font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
            title={questionText}
          >
            {questionText}
          </h2>
          <p className="text-sm text-white/70 line-clamp-2" title={description}>
            {description}
          </p>
        </div>
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
SmallCard.displayName = "SmallCard";

/* ==========================
   8. 컴포넌트: CardContent (변경 없음)
============================= */
interface CardContentProps {
  item: LayoutItem;
}

const CardContent: React.FC<CardContentProps> = memo(({ item }) => {
  const { size, data } = item;

  if (data.id === -1) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4 text-center">
        <p className="text-sm text-red-400">{data.title}</p>
      </div>
    );
  }

  switch (size) {
    case "L":
      return <LargeCard data={data} meta={data.meta} />;
    case "M":
      return <MediumCard data={data} meta={data.meta} />;
    case "S":
      return <SmallCard data={data} meta={data.meta} />;
    default:
      console.warn("Unknown card size:", size);
      return null;
  }
});
CardContent.displayName = "CardContent";

/* ==========================
   9. 컴포넌트: Card (변경 없음)
============================= */
interface CardProps {
  item: LayoutItem;
}

const Card: React.FC<CardProps> = memo(({ item }) => (
  <div className={getCardContainerClasses(item.size)}>
    <CardContent item={item} />
  </div>
));
Card.displayName = "Card";

/* ==========================
   10. 메인 페이지 컴포넌트: HomePage (변경 없음)
============================= */
export default function HomePage() {
  const currentLayout = useResponsiveLayout();

  return (
    <div className="w-full min-h-screen bg-black p-1 sm:p-2">
      <div className="flex flex-col gap-1 sm:gap-2">
        {currentLayout.map((rowItems, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex flex-row flex-nowrap items-start gap-1 sm:gap-2"
          >
            {rowItems.map((item) => (
              <Card
                key={
                  item.data.id !== -1
                    ? `card-${item.data.id}`
                    : `fallback-${item.contentId}-${item.size}`
                }
                item={item}
              />
            ))}
          </div>
        ))}

        {currentLayout.length === 0 && contentMap.size > 0 && (
          <div className="text-center text-white/60 py-10">
            레이아웃 로딩 중...
          </div>
        )}
        {contentMap.size === 0 && (
          <div className="text-center text-white/60 py-10">
            콘텐츠 데이터가 없습니다. `public` 폴더 내 `contents.json` 경로 및
            파일 내용을 확인해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
