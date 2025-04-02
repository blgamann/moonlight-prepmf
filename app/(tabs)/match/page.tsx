/*******************************************************************************
 * app/page.tsx - Moonlight Project Masonry-like Card Layout
 *
 * Implements a horizontal, row-based layout with cards of fixed, distinct heights
 * and variable widths based on Flexbox (flex-basis + grow/shrink).
 * Uses predefined responsive patterns to change layout at breakpoints.
 * Aims for a visual Masonry effect by careful manual pattern design.
 *
 * Requirements Summary:
 * - Fixed Heights: L=300px, M=200px, S=133px
 * - Width: Base Width (L=900, M=600, S=400) + Equal distribution of remaining space 'n' per row.
 *          Implemented using `flex-basis` for base width and `flex-grow: 1`, `flex-shrink: 1`.
 * - Responsive: Layout patterns change at defined breakpoints (sm, md, lg).
 * - Visual Masonry: Patterns are manually designed to minimize vertical gaps.
 * - Content: L/M cards have images, S cards do not. Specific content structure.
 ******************************************************************************/
"use client"; // Necessary for using React client-side hooks

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash"; // For debouncing resize events
import Image from "next/image"; // For optimized image handling
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline"; // Example icons

// --- Type Definitions ---

type CardSize = "L" | "M" | "S";

interface MetaData {
  soulLinkCount: number;
  memberCount: number;
  questionCount: number;
  answerCount: number;
}

interface CardData {
  id: number;
  title: string; // Top small title (e.g., Author/Source)
  popularity: "high" | "medium" | "low"; // Used for mapping to L/M/S initially
  imageUrl?: string; // Optional image URL, mainly for L and M cards
  questionText: string; // Main question/headline text
  description: string; // Description text below the question
  meta: MetaData; // Metadata object
}

// Defines the structure of an item in the layout pattern definition
interface LayoutDefinitionItem {
  size: CardSize;
  contentId: number; // ID to map to CardData
}

// Defines the structure of an item ready for rendering (includes actual data)
interface LayoutItem extends LayoutDefinitionItem {
  data: CardData;
}

// --- Card Specifications ---
// Defines fixed height and base width (for flex-basis) for each card size.
// Uses Tailwind arbitrary values for precise pixel heights.
const CARD_SPECS: Record<CardSize, { height: string; baseWidth: string }> = {
  L: { height: "h-[300px]", baseWidth: "basis-[900px]" }, // 300px height, 900px base width
  M: { height: "h-[200px]", baseWidth: "basis-[600px]" }, // 200px height, 600px base width
  S: { height: "h-[133px]", baseWidth: "basis-[400px]" }, // *** UPDATED: 133px height, 400px base width ***
};

// --- Sample Content Data ---
// Ensure this array contains data for all `contentId`s used in `layoutPatterns`.
const allContent: CardData[] = [
  // Use placeholder images or actual image paths in your /public folder
  {
    id: 1,
    title: "김호연의「불편한 편의점」",
    popularity: "high",
    imageUrl: "/placeholder-images/uncomfortable-convenience-store.jpg",
    questionText: "평범한 일상 속에 숨겨진 특별함은 무엇일까?",
    description:
      "일상 속 작은 순간들이 가진 특별한 의미에 대해 이야기를 나눠보세요.",
    meta: {
      soulLinkCount: 42,
      memberCount: 198,
      questionCount: 8,
      answerCount: 245,
    },
  },
  {
    id: 2,
    title: "유발 하라리의「사피엔스」",
    popularity: "medium",
    imageUrl: "/placeholder-images/sapiens.jpg",
    questionText: "인류는 어떻게 지구의 지배자가 되었나?",
    description:
      "수렵채집인에서 시작하여 현재에 이르기까지 인류 역사의 거대한 흐름을 탐험합니다.",
    meta: {
      soulLinkCount: 150,
      memberCount: 255,
      questionCount: 15,
      answerCount: 310,
    },
  },
  {
    id: 3,
    title: "나의 작은 아이디어 노트",
    popularity: "low",
    questionText: "세상을 바꿀 다음 아이디어는?",
    description:
      "번뜩이는 영감과 작은 생각의 조각들을 기록하고 발전시키는 공간입니다.",
    meta: {
      soulLinkCount: 5,
      memberCount: 10,
      questionCount: 2,
      answerCount: 8,
    },
  },
  {
    id: 4,
    title: "칼 세이건의「코스모스」",
    popularity: "medium",
    imageUrl: "/placeholder-images/cosmos.jpg",
    questionText: "우리는 광활한 우주 속 어떤 존재인가?",
    description:
      "과학적 탐구를 통해 우주의 신비와 인간 존재의 의미를 성찰합니다.",
    meta: {
      soulLinkCount: 95,
      memberCount: 180,
      questionCount: 9,
      answerCount: 155,
    },
  },
  {
    id: 5,
    title: "재레드 다이아몬드의「총, 균, 쇠」",
    popularity: "high",
    imageUrl: "/placeholder-images/guns-germs-steel.jpg",
    questionText: "문명의 불평등은 어디에서 시작되었을까?",
    description:
      "지리, 환경, 기술적 요인이 인류 문명의 발전에 미친 영향을 분석합니다.",
    meta: {
      soulLinkCount: 180,
      memberCount: 310,
      questionCount: 22,
      answerCount: 450,
    },
  },
  {
    id: 6,
    title: "오늘의 감사 일기",
    popularity: "low",
    questionText: "오늘 하루 감사했던 일 세 가지는?",
    description: "소소하지만 확실한 행복을 찾아 기록하는 습관을 들여보세요.",
    meta: {
      soulLinkCount: 25,
      memberCount: 50,
      questionCount: 3,
      answerCount: 75,
    },
  },
  // Add more sample data matching IDs used in layoutPatterns below
  {
    id: 7,
    title: "샘플 L 데이터 7",
    popularity: "high",
    imageUrl: "https://via.placeholder.com/900x300/FF6347/FFFFFF?text=L+Card+7",
    questionText: "다른 L 카드 질문?",
    description: "L 카드 설명입니다.",
    meta: {
      soulLinkCount: 100,
      memberCount: 200,
      questionCount: 10,
      answerCount: 50,
    },
  },
  {
    id: 8,
    title: "샘플 S 데이터 8",
    popularity: "low",
    questionText: "다른 S 카드 질문?",
    description: "S 카드 설명입니다.",
    meta: {
      soulLinkCount: 10,
      memberCount: 20,
      questionCount: 1,
      answerCount: 5,
    },
  },
  {
    id: 9,
    title: "샘플 M 데이터 9",
    popularity: "medium",
    imageUrl: "https://via.placeholder.com/600x200/4682B4/FFFFFF?text=M+Card+9",
    questionText: "다른 M 카드 질문?",
    description: "M 카드 설명입니다.",
    meta: {
      soulLinkCount: 50,
      memberCount: 100,
      questionCount: 5,
      answerCount: 25,
    },
  },
  {
    id: 10,
    title: "샘플 S 데이터 10",
    popularity: "low",
    questionText: "또 다른 S 카드 질문?",
    description: "S 카드 설명입니다.",
    meta: {
      soulLinkCount: 12,
      memberCount: 22,
      questionCount: 2,
      answerCount: 7,
    },
  },
  {
    id: 11,
    title: "샘플 L 데이터 11",
    popularity: "high",
    imageUrl:
      "https://via.placeholder.com/900x300/32CD32/FFFFFF?text=L+Card+11",
    questionText: "매우 긴 L 질문?",
    description: "L 카드 설명입니다.",
    meta: {
      soulLinkCount: 110,
      memberCount: 210,
      questionCount: 11,
      answerCount: 55,
    },
  },
  {
    id: 12,
    title: "샘플 M 데이터 12",
    popularity: "medium",
    imageUrl:
      "https://via.placeholder.com/600x200/FFD700/000000?text=M+Card+12",
    questionText: "매우 긴 M 질문?",
    description: "M 카드 설명입니다.",
    meta: {
      soulLinkCount: 60,
      memberCount: 110,
      questionCount: 6,
      answerCount: 30,
    },
  },
  {
    id: 13,
    title: "샘플 S 데이터 13",
    popularity: "low",
    questionText: "매우 긴 S 질문?",
    description: "S 카드 설명입니다.",
    meta: {
      soulLinkCount: 15,
      memberCount: 25,
      questionCount: 3,
      answerCount: 9,
    },
  },
  {
    id: 14,
    title: "샘플 S 데이터 14",
    popularity: "low",
    questionText: "마지막 S 질문?",
    description: "마지막 S 카드 설명입니다.",
    meta: {
      soulLinkCount: 18,
      memberCount: 28,
      questionCount: 4,
      answerCount: 11,
    },
  },
];

// --- !!! Responsive Layout Patterns (Manual Masonry Design - CRITICAL!) !!! ---
// Manually design card combinations for each breakpoint.
// GOAL: Minimize vertical gaps visually, considering fixed heights (L:300, M:200, S:133).
//       Utilize height relationships (e.g., L ≈ M+S, M ≈ S+~half S) for better packing.
// CONSIDER: Base width sums per row vs. breakpoint width ranges. Avoid combinations
//           that cause excessive shrinking if cards shouldn't go below base width.
// NOTE: The patterns below are *examples* and **MUST BE REDESIGNED** based on the
//       updated S card specs (133px height, 400px baseWidth) and visual goals.
const layoutPatterns: Record<string, LayoutDefinitionItem[][]> = {
  default: [
    // ~639px: Vertical stack is safest
    [{ size: "L", contentId: 1 }],
    [{ size: "M", contentId: 2 }],
    [{ size: "S", contentId: 3 }], // H: 133px
    [{ size: "M", contentId: 4 }],
    [{ size: "L", contentId: 5 }],
    [{ size: "S", contentId: 6 }], // H: 133px
  ],
  sm: [
    // 640px–767px: Short rows. Check base widths.
    // M+S = 600+400 = 1000px. Will likely shrink in this range. Ok?
    [{ size: "L", contentId: 1 }], // Base: 900px -> Will shrink
    [
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ], // Base: 1000px -> Will shrink
    [
      { size: "S", contentId: 6 },
      { size: "S", contentId: 8 },
    ], // Base: 400+400=800px -> Will shrink
    [{ size: "M", contentId: 4 }], // Base: 600px -> Ok
    // *** Redesign patterns carefully for sm breakpoint ***
  ],
  md: [
    // 768–1023px: Medium rows. Check base widths.
    // L+S = 900+400 = 1300px -> Will shrink. Ok?
    // M+M = 600+600 = 1200px -> Will shrink. Ok?
    [{ size: "L", contentId: 1 }], // Base: 900px -> Ok
    [
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ], // Base: 1000px -> Ok
    [
      { size: "M", contentId: 4 },
      { size: "S", contentId: 6 },
    ], // Base: 1000px -> Ok
    [
      { size: "L", contentId: 5 },
      { size: "S", contentId: 8 },
    ], // Base: 1300px -> Shrink likely
    // *** Redesign patterns carefully for md breakpoint ***
  ],
  lg: [
    // 1024px 이상: Wide rows. Base widths less likely to be an issue. Focus on height packing.
    // L(300), M(200), S(133). Try to use L ≈ M+S, M ≈ S+S(approx) etc.
    [
      { size: "L", contentId: 1 },
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ], // H: 300, 200, 133. Base: 1900px
    [
      { size: "M", contentId: 4 },
      { size: "S", contentId: 6 },
      { size: "L", contentId: 5 },
    ], // H: 200, 133, 300. Base: 1900px
    [
      { size: "S", contentId: 8 },
      { size: "S", contentId: 10 },
      { size: "M", contentId: 9 },
      { size: "S", contentId: 13 },
    ], // H: 133*3 + 200. Base: 400*3+600 = 1800px
    [
      { size: "L", contentId: 7 },
      { size: "L", contentId: 11 },
    ], // H: 300, 300. Base: 1800px
    // *** Add more diverse patterns for lg, focusing on visual packing ***
  ],
};

// --- Tailwind Breakpoint Configuration ---
// Matches default Tailwind breakpoints. Adjust if your config is different.
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

// --- Helper Function: Get Layout Pattern for Current Width ---
const getLayoutPatternForWidth = (width: number): LayoutDefinitionItem[][] => {
  if (width >= breakpoints.lg) return layoutPatterns.lg;
  if (width >= breakpoints.md) return layoutPatterns.md;
  if (width >= breakpoints.sm) return layoutPatterns.sm;
  return layoutPatterns.default;
};

// --- Helper Function: Get Card Container CSS Classes ---
// Applies flex-basis (base width), grow, shrink, and fixed height.
const getCardContainerClasses = (size: CardSize): string => {
  const spec = CARD_SPECS[size];
  // Flex properties: Allow growing (1), shrinking (1), starting from base width
  const flexClasses = `grow shrink ${spec.baseWidth}`; // e.g., grow shrink basis-[400px]
  // Fixed height class based on card size
  const heightClass = spec.height; // e.g., h-[133px]
  // Base styling for the card container
  const baseStyle =
    "bg-white dark:bg-neutral-900 overflow-hidden rounded-lg shadow-md dark:border dark:border-neutral-700 transition-width duration-150 ease-in-out"; // Added transition

  return `${flexClasses} ${heightClass} ${baseStyle}`;
};

// --- Card Internal Content Component ---
// Renders the image (for L/M), text, and metadata within a card.
const CardContent: React.FC<{ item: LayoutItem }> = ({ item }) => {
  const { size, data } = item;
  const { title, imageUrl, questionText, description, meta } = data;

  // Dynamic styles based on card size
  const questionSizeClass =
    size === "L"
      ? "text-xl sm:text-2xl"
      : size === "M"
      ? "text-lg sm:text-xl"
      : "text-base sm:text-lg";
  const imageContainerWidthClass =
    size === "L" ? "w-2/5 sm:w-1/3" : size === "M" ? "w-1/3 sm:w-1/4" : ""; // Image width proportion
  const imageAspectRatioClass = "aspect-[2/3]"; // Standard book cover ratio

  return (
    // Main flex container: row for L/M, column for S
    <div
      className={`flex h-full w-full ${size !== "S" ? "flex-row" : "flex-col"}`}
    >
      {/* Image Section (Only for L and M cards with an imageUrl) */}
      {size !== "S" && imageUrl && (
        <div
          className={`relative ${imageContainerWidthClass} flex-shrink-0 ${imageAspectRatioClass} overflow-hidden rounded-l-lg`}
        >
          <Image
            src={imageUrl}
            alt={`${title} cover`}
            layout="fill" // Fill the container
            objectFit="cover" // Cover the area, maintaining aspect ratio (may crop)
            priority={size === "L"} // Prioritize loading large images
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 25vw" // Responsive image size hints
          />
        </div>
      )}
      {/* Text & Metadata Section */}
      <div
        className={`flex flex-1 flex-col p-3 sm:p-4 ${
          size === "S" ? "justify-between" : ""
        } space-y-1 sm:space-y-2 overflow-hidden`}
      >
        {/* Top Text Group */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
            {title}
          </p>
          <h2
            className={`${questionSizeClass} font-bold text-neutral-800 dark:text-neutral-100 leading-tight mb-1 sm:mb-2 line-clamp-2`}
          >
            {questionText}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 sm:line-clamp-3">
            {description}
          </p>
        </div>
        {/* Bottom Metadata Group (sticks to bottom) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
          <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <LinkIcon className="w-3.5 h-3.5 mr-1" /> 소울링크{" "}
            {meta.soulLinkCount}쌍
          </span>
          <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <UserGroupIcon className="w-3.5 h-3.5 mr-1" /> 멤버{" "}
            {meta.memberCount}명
          </span>
          <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5 mr-1" /> 질문{" "}
            {meta.questionCount}개
          </span>
          <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1" /> 답변{" "}
            {meta.answerCount}개
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  // State to hold the currently active layout pattern based on screen width
  const [currentLayout, setCurrentLayout] = useState<LayoutItem[][]>([]);

  // Function to calculate and set the current layout based on window width
  const handleResize = useCallback(() => {
    const pattern = getLayoutPatternForWidth(window.innerWidth);
    // Map the chosen pattern definition to actual data for rendering
    const populatedLayout: LayoutItem[][] = pattern
      .map(
        (rowPattern) =>
          rowPattern
            .map((itemDef) => {
              const content = allContent.find(
                (c) => c.id === itemDef.contentId
              );
              // Provide fallback data if content is not found to prevent errors
              const fallbackData: CardData = {
                id: -1,
                title: `콘텐츠 ${itemDef.contentId} 없음`,
                popularity: "low",
                questionText: "데이터 로딩 실패",
                description: "데이터를 불러올 수 없습니다.",
                meta: {
                  soulLinkCount: 0,
                  memberCount: 0,
                  questionCount: 0,
                  answerCount: 0,
                },
              };
              return { ...itemDef, data: content || fallbackData };
            })
            .filter((item) => item.data.id !== -1) // Filter out items with missing data
      )
      .filter((row) => row.length > 0); // Filter out any potentially empty rows
    setCurrentLayout(populatedLayout);
  }, []); // Empty dependency array means this function is created only once

  // Debounced version of the resize handler to improve performance
  const debouncedHandleResize = useMemo(
    () => debounce(handleResize, 150),
    [handleResize]
  );

  // Effect to set initial layout and add/remove resize listener
  useEffect(() => {
    handleResize(); // Set initial layout on mount
    window.addEventListener("resize", debouncedHandleResize); // Add listener

    // Cleanup function: remove listener and cancel debounce on unmount
    return () => {
      debouncedHandleResize.cancel();
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [handleResize, debouncedHandleResize]); // Dependencies are stable references

  // Render the main page layout
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-black p-1 sm:p-2">
      {/* Vertical container for rows */}
      <div className="flex flex-col gap-1 sm:gap-2">
        {/* Map over the current layout rows */}
        {currentLayout.map((row, rowIndex) => (
          // Each Row: horizontal flex, no wrap, align items top, gap between cards
          <div
            key={rowIndex}
            className="flex flex-row flex-nowrap items-start gap-1 sm:gap-2"
          >
            {/* Map over cards within the row */}
            {row.map((item) => (
              // Card Container: Applies flex sizing and fixed height
              <div
                key={item.data.id}
                className={getCardContainerClasses(item.size)}
              >
                {/* Render the internal card content */}
                <CardContent item={item} />
              </div>
            ))}
          </div>
        ))}
        {/* Message displayed if no content/layout is available */}
        {currentLayout.length === 0 &&
          allContent.length > 0 && ( // Show only if data exists but layout is empty (e.g., error state)
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-10">
              레이아웃을 구성할 수 없습니다.
            </p>
          )}
        {currentLayout.length === 0 &&
          allContent.length === 0 && ( // Show if no data loaded
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-10">
              표시할 콘텐츠가 없습니다.
            </p>
          )}
      </div>
    </div>
  );
}

// --- Required Installations ---
// npm install lodash @types/lodash
// npm install @heroicons/react
// npm install -D @tailwindcss/line-clamp

// --- Required Tailwind Configuration (tailwind.config.js) ---
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     // Or if using `src` directory:
//     // "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('@tailwindcss/line-clamp'),
//     // aspect-ratio plugin might be needed for Tailwind v2
//     // require('@tailwindcss/aspect-ratio'),
//   ],
// }
