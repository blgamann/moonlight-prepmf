"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
// lodash/debounce를 직접 임포트하여 번들 사이즈 최적화
import debounce from "lodash/debounce";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

// 가정: contents.json 파일이 올바른 경로에 있고 CardData[] 타입과 일치합니다.
import contents from "@/app/dummy/contents.json";

/* ==========================
   1. 타입 정의
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
   2. 상수 정의
============================= */
const CARD_SPECS: Record<CardSize, { height: string; baseWidth: string }> = {
  L: { height: "h-[300px]", baseWidth: "basis-[900px]" },
  M: { height: "min-h-[180px]", baseWidth: "basis-[600px]" },
  S: { height: "min-h-[120px]", baseWidth: "basis-[400px]" },
};

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

const BASE_CARD_STYLE =
  "bg-gradient-to-br from-[#111] to-[#181818] overflow-hidden rounded-lg shadow-lg border border-[#6dd1e4]/10 transition-all duration-150 ease-in-out hover:border-[#6dd1e4]/30 flex";

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
   3. 데이터 로딩 및 맵핑
============================= */
const allContent: CardData[] = contents as CardData[];
const contentMap = new Map<number, CardData>(
  allContent.map((content) => [content.id, content])
);

/* ==========================
   4. 헬퍼 함수
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
  description: "요청한 콘텐츠가 없거나 오류가 발생했습니다.",
  meta: { soulLinkCount: 0, memberCount: 0, questionCount: 0, answerCount: 0 },
});

/* ==========================
   5. 커스텀 훅: useResponsiveLayout
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
   6. 컴포넌트: CardMetaInfo
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
   7. 컴포넌트: 크기별 카드 컴포넌트
============================= */
interface SizeSpecificCardProps {
  data: CardData;
  meta: MetaData;
}

const LargeCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, imageUrl, questionText, description } = data;

  return (
    <div className="flex h-full w-full flex-row">
      {imageUrl && (
        <div className="relative w-[200px] flex-shrink-0 h-full overflow-hidden rounded-l-lg">
          <Image
            src={imageUrl}
            alt={`${title} 커버 이미지`}
            fill
            className="object-cover"
            priority
            sizes="200px"
            onError={(e) => {
              console.error(
                `Image loading error for ${imageUrl}:`,
                e.currentTarget.currentSrc
              );
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-between space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow">
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

const MediumCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, imageUrl, questionText, description } = data;

  return (
    <div className="flex h-full w-full flex-row">
      {imageUrl && (
        <div className="relative w-[133px] flex-shrink-0 h-full overflow-hidden rounded-l-lg">
          <Image
            src={imageUrl}
            alt={`${title} 커버 이미지`}
            fill
            className="object-cover"
            sizes="133px"
            onError={(e) => {
              console.error(
                `Image loading error for ${imageUrl}:`,
                e.currentTarget.currentSrc
              );
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-between space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow">
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
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
MediumCard.displayName = "MediumCard";

const SmallCard: React.FC<SizeSpecificCardProps> = memo(({ data, meta }) => {
  const { title, questionText, description } = data;

  return (
    <div className="flex h-full w-full flex-row items-start">
      <div className="flex flex-1 flex-col p-3 sm:p-4 justify-start space-y-1 sm:space-y-2 overflow-hidden">
        <div className="flex-grow">
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
   8. 컴포넌트: CardContent
============================= */
interface CardContentProps {
  item: LayoutItem;
}

const CardContent: React.FC<CardContentProps> = memo(({ item }) => {
  const { size, data } = item;

  // 데이터 로딩 실패 시 대체 UI
  if (data.id === -1) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4 text-center">
        <p className="text-white/70">{data.title}</p>
      </div>
    );
  }

  // 크기별 컴포넌트 렌더링
  switch (size) {
    case "L":
      return <LargeCard data={data} meta={data.meta} />;
    case "M":
      return <MediumCard data={data} meta={data.meta} />;
    case "S":
      return <SmallCard data={data} meta={data.meta} />;
    default:
      return null;
  }
});
CardContent.displayName = "CardContent";

/* ==========================
   9. 컴포넌트: Card
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
   10. 메인 페이지 컴포넌트: HomePage
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
                    ? item.data.id
                    : `fallback-${item.contentId}-${item.size}`
                }
                item={item}
              />
            ))}
          </div>
        ))}

        {currentLayout.length === 0 && contentMap.size > 0 && (
          <div className="text-center text-white/60 py-10">
            레이아웃을 로딩 중이거나 현재 화면 크기에 맞는 콘텐츠가 없습니다...
          </div>
        )}
        {contentMap.size === 0 && (
          <div className="text-center text-white/60 py-10">
            콘텐츠 데이터가 없습니다. `contents.json` 파일을 확인해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
