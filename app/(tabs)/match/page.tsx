"use client"; // 클라이언트 측 훅 사용 명시

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash"; // 디바운싱 (npm install lodash @types/lodash)
import Image from "next/image"; // Next.js 이미지 최적화
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline"; // 아이콘 (npm install @heroicons/react)

// --- 타입 정의 ---
type CardSize = "L" | "M" | "S";

interface MetaData {
  soulLinkCount: number;
  memberCount: number;
  questionCount: number;
  answerCount: number;
}

interface CardData {
  id: number;
  title: string; // 상단 작은 제목
  popularity: "high" | "medium" | "low";
  imageUrl?: string; // L, M 카드용 이미지 URL (Optional)
  questionText: string; // 중앙 큰 질문 텍스트
  description: string; // 질문 아래 설명 텍스트
  meta: MetaData;
}

interface LayoutDefinitionItem {
  size: CardSize;
  contentId: number;
}

// 최종 렌더링에 사용될 아이템 타입 (데이터 포함)
interface LayoutItem extends LayoutDefinitionItem {
  data: CardData;
}

// --- 카드 스펙 기반 상수 ---
// 고정 높이와 기본 너비(flex-basis)를 정의합니다.
const CARD_SPECS: Record<CardSize, { height: string; baseWidth: string }> = {
  L: { height: "h-[300px]", baseWidth: "basis-[900px]" }, // 높이 300px, 기본 너비 900px
  M: { height: "h-[200px]", baseWidth: "basis-[600px]" }, // 높이 200px, 기본 너비 600px
  S: { height: "h-[100px]", baseWidth: "basis-[300px]" }, // 높이 100px, 기본 너비 300px
};

// --- 샘플 콘텐츠 데이터 ---
// layoutPatterns에 정의된 모든 contentId에 해당하는 데이터가 있어야 합니다.
const allContent: CardData[] = [
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
  // --- layoutPatterns 에 필요한 추가 샘플 데이터 정의 ---
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

// --- !!! 반응형 레이아웃 패턴 정의 (수동 Masonry + 기본 너비 고려) !!! ---
// 각 breakpoint에서 행의 '기본 너비 합'이 해당 화면 너비 범위에 적절한지 고려하여 설계합니다.
// 너비가 부족하면 shrink가 발생하므로, 이를 원치 않으면 해당 breakpoint에서 조합을 변경해야 합니다.
// 높이(L:300, M:200, S:100) 관계를 활용하여 수직 빈틈을 '시각적으로' 최소화하도록 노력합니다.
const layoutPatterns: Record<string, LayoutDefinitionItem[][]> = {
  default: [
    // ~639px: 세로 스택이 가장 적합
    [{ size: "L", contentId: 1 }],
    [{ size: "M", contentId: 2 }],
    [{ size: "S", contentId: 3 }],
    [{ size: "M", contentId: 4 }],
    [{ size: "L", contentId: 5 }],
    [{ size: "S", contentId: 6 }],
  ],
  sm: [
    // 640px–767px: 짧은 행 가능. 기본 너비 합 고려.
    // 예: M+M (기본 1200px) -> 640px보다 크므로 shrink 발생 가능성 높음. 이 breakpoint에서는 M 단독 행이 더 나을 수 있음.
    [{ size: "L", contentId: 1 }], // 기본 900px -> sm 범위에서 ok
    [
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ], // 기본 600+300=900px -> sm 범위에서 ok
    [
      { size: "M", contentId: 4 },
      { size: "S", contentId: 6 },
    ], // 기본 600+300=900px -> sm 범위에서 ok
    [{ size: "L", contentId: 5 }], // 기본 900px -> sm 범위에서 ok
    // ... (sm에 맞는 패턴 추가 설계)
  ],
  md: [
    // 768–1023px: 중간 길이 행. 기본 너비 합 고려.
    // 예: L+S (기본 1200px) -> 768px보다 크므로 shrink 발생 가능성 높음. md에서는 L 단독 또는 M+S 등이 더 적합할 수 있음.
    [{ size: "L", contentId: 1 }], // 기본 900px -> md 범위에서 ok
    [
      { size: "M", contentId: 2 },
      { size: "M", contentId: 4 },
    ], // 기본 1200px -> shrink 가능성, 괜찮다면 유지
    [
      { size: "S", contentId: 3 },
      { size: "L", contentId: 5 },
    ], // 기본 300+900=1200px -> shrink 가능성, 괜찮다면 유지
    [
      { size: "S", contentId: 6 },
      { size: "M", contentId: 9 },
      { size: "S", contentId: 8 },
    ], // 기본 300+600+300=1200px -> shrink 가능성
    // ... (md에 맞는 패턴 추가 설계 및 shrink 고려)
  ],
  lg: [
    // 1024px 이상: 가장 넓은 범위, 복잡한 조합 가능
    [
      { size: "L", contentId: 1 },
      { size: "M", contentId: 2 },
      { size: "S", contentId: 3 },
    ], // 기본 1800px -> lg 범위에서 ok
    [
      { size: "M", contentId: 4 },
      { size: "M", contentId: 9 },
      { size: "M", contentId: 12 },
    ], // 기본 1800px -> lg 범위에서 ok
    [
      { size: "S", contentId: 6 },
      { size: "S", contentId: 8 },
      { size: "L", contentId: 5 },
      { size: "S", contentId: 10 },
    ], // 기본 300+300+900+300=1800px -> lg 범위에서 ok
    [
      { size: "L", contentId: 7 },
      { size: "L", contentId: 11 },
    ], // 기본 1800px -> lg 범위에서 ok
    [
      { size: "S", contentId: 13 },
      { size: "M", contentId: 15 },
      { size: "L", contentId: 14 },
    ], // 예시: 300 + 600 + 900 = 1800px (ID 15는 예시 데이터 필요)
    // ... (다양한 조합 추가)
  ],
};

// --- Tailwind Breakpoint 값 ---
const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

// --- Helper Function: 너비에 맞는 레이아웃 패턴 가져오기 ---
const getLayoutPatternForWidth = (width: number): LayoutDefinitionItem[][] => {
  if (width >= breakpoints.lg) return layoutPatterns.lg;
  if (width >= breakpoints.md) return layoutPatterns.md;
  if (width >= breakpoints.sm) return layoutPatterns.sm;
  return layoutPatterns.default;
};

// --- Helper Function: 카드 컨테이너 스타일 클래스 정의 (flex-basis + grow:1) ---
const getCardContainerClasses = (size: CardSize): string => {
  const spec = CARD_SPECS[size];
  // flex-basis: 카드 기본 너비 설정
  // flex-grow: 1 -> 남는 공간 'n'을 모든 카드에 '동일하게' 분배 (가이드 근사)
  // flex-shrink: 1 -> 공간 부족 시 기본 너비보다 작아질 수 있음
  const flexClasses = `grow shrink ${spec.baseWidth}`; // Tailwind JIT가 basis-[...] 처리
  // 고정 높이 적용 (픽셀 단위)
  const heightClass = spec.height;
  // 기본 스타일
  const baseStyle =
    "bg-white dark:bg-neutral-900 overflow-hidden rounded-lg shadow-md dark:border dark:border-neutral-700 transition-width duration-150 ease-in-out";

  return `${flexClasses} ${heightClass} ${baseStyle}`;
};

// --- 카드 내부 콘텐츠 컴포넌트 ---
const CardContent: React.FC<{ item: LayoutItem }> = ({ item }) => {
  const { size, data } = item;
  const { title, imageUrl, questionText, description, meta } = data;

  // 카드 크기별 스타일 동적 적용
  const questionSizeClass =
    size === "L"
      ? "text-xl sm:text-2xl"
      : size === "M"
      ? "text-lg sm:text-xl"
      : "text-base sm:text-lg";
  // 이미지 컨테이너 너비 - L/M 카드에서 이미지 영역 비중 조절
  const imageContainerWidthClass =
    size === "L" ? "w-2/5 sm:w-1/3" : size === "M" ? "w-1/3 sm:w-1/4" : "";
  // 책 표지 비율 유지
  const imageAspectRatioClass = "aspect-[2/3]";

  return (
    <div
      className={`flex h-full w-full ${size !== "S" ? "flex-row" : "flex-col"}`}
    >
      {/* L, M 카드 이미지 */}
      {size !== "S" && imageUrl && (
        <div
          className={`relative ${imageContainerWidthClass} flex-shrink-0 ${imageAspectRatioClass} overflow-hidden rounded-l-lg`}
        >
          <Image
            src={imageUrl}
            alt={`${title} cover`}
            layout="fill"
            objectFit="cover"
            priority={size === "L"}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 25vw" // 이미지 로딩 최적화 힌트
          />
        </div>
      )}
      {/* 텍스트 & 메타데이터 영역 */}
      <div
        className={`flex flex-1 flex-col p-3 sm:p-4 ${
          size === "S" ? "justify-between" : ""
        } space-y-1 sm:space-y-2 overflow-hidden`}
      >
        {/* 텍스트 그룹 */}
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
        {/* 메타데이터 그룹 (하단 고정) */}
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

// --- 메인 페이지 컴포넌트 ---
export default function HomePage() {
  const [currentLayout, setCurrentLayout] = useState<LayoutItem[][]>([]);

  // 화면 크기 변경 감지 및 레이아웃 업데이트 로직
  const handleResize = useCallback(() => {
    const pattern = getLayoutPatternForWidth(window.innerWidth);
    const populatedLayout: LayoutItem[][] = pattern
      .map(
        (rowPattern) =>
          rowPattern
            .map((itemDef) => {
              const content = allContent.find(
                (c) => c.id === itemDef.contentId
              );
              // Fallback 데이터 구조 일치
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
            .filter((item) => item.data.id !== -1) // 유효하지 않은 데이터 필터링
      )
      .filter((row) => row.length > 0); // 빈 행 필터링
    setCurrentLayout(populatedLayout);
  }, []); // 의존성 배열 비움

  // 디바운스 적용된 리사이즈 핸들러 (useMemo 사용)
  const debouncedHandleResize = useMemo(
    () => debounce(handleResize, 150),
    [handleResize]
  );

  // 컴포넌트 마운트/언마운트 시 이벤트 리스너 관리
  useEffect(() => {
    handleResize(); // 초기 레이아웃 설정
    window.addEventListener("resize", debouncedHandleResize);
    // 클린업 함수: 언마운트 시 리스너 제거 및 디바운스 취소
    return () => {
      debouncedHandleResize.cancel();
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [handleResize, debouncedHandleResize]); // 안정적인 의존성 사용

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-black p-1 sm:p-2">
      {/* 세로 행 배치 */}
      <div className="flex flex-col gap-1 sm:gap-2">
        {/* 현재 레이아웃 패턴에 따라 행 렌더링 */}
        {currentLayout.map((row, rowIndex) => (
          // 각 행: 가로 배치, 줄바꿈 없음, 아이템 상단 정렬 (Masonry 효과)
          <div
            key={rowIndex}
            className="flex flex-row flex-nowrap items-start gap-1 sm:gap-2"
          >
            {/* 행 내 카드 렌더링 */}
            {row.map((item) => (
              // 카드 컨테이너: flex-basis + grow + 고정 높이
              <div
                key={item.data.id}
                className={getCardContainerClasses(item.size)}
              >
                {/* 카드 내부 콘텐츠 */}
                <CardContent item={item} />
              </div>
            ))}
          </div>
        ))}
        {/* 콘텐츠 없을 때 메시지 */}
        {currentLayout.length === 0 && !allContent.length && (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-10">
            표시할 콘텐츠가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

// --- 필요 설치 ---
// npm install lodash @types/lodash
// npm install @heroicons/react
// npm install -D @tailwindcss/line-clamp
// --- tailwind.config.js 설정 ---
// module.exports = {
//   content: [ ... ],
//   theme: { extend: {} },
//   plugins: [
//     require('@tailwindcss/line-clamp'),
//   ],
// }
