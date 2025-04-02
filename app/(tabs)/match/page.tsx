"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

import contents from "@/app/dummy/contents.json";

// =======================================================================
// 1. 타입 정의 (src/types/cardTypes.ts 또는 유사 파일로 분리 권장)
// =======================================================================

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

// Grid 아이템 정보를 담을 타입 (데이터 + 할당된 크기)
export interface GridItem {
  data: CardData;
  assignedSize: CardSize;
}

// =======================================================================
// 2. 상수 및 설정 (src/constants/gridConstants.ts 또는 유사 파일로 분리 권장)
// =======================================================================

/** 기본 카드 스타일 (Grid 아이템 공통) */
const BASE_CARD_STYLE =
  "bg-gradient-to-br from-[#111] to-[#181818] overflow-hidden rounded-lg shadow-lg border border-[#6dd1e4]/10 transition-all duration-150 ease-in-out hover:border-[#6dd1e4]/30 flex flex-col";

/** 무한 스크롤: 한 번에 불러올 아이템 개수 */
const ITEMS_PER_PAGE = 10;

/** 카드 크기 할당 패턴 (무한 스크롤 시 순환 적용) */
const CARD_SIZE_PATTERN: CardSize[] = [
  "L",
  "M",
  "S",
  "M",
  "S",
  "L",
  "M",
  "S",
  "M",
  "S",
  "M",
  "S",
  "L",
  "S",
  "M",
  "S",
  "L",
  "M",
  "S",
  "M",
];

/** 기본 행 높이 (S 카드 기준, Tailwind JIT 필요) */
const BASE_ROW_HEIGHT_PX = 120; // px 단위로 정의
const GRID_AUTO_ROWS_STYLE = `minmax(${BASE_ROW_HEIGHT_PX}px, auto)`; // grid-auto-rows 값

/** 화면 크기별 Grid 컬럼 설정 */
const GRID_COLS_CLASSES = "grid-cols-1 sm:grid-cols-4 lg:grid-cols-6"; // 반응형 클래스 통합

/**
 * 화면 크기 및 카드 크기별 Span 정의 (Tailwind 클래스)
 * 키: breakpoint_size (예: 'sm_L', 'lg_M')
 * 값: 해당 breakpoint에서 적용될 col-span / row-span 클래스
 */
const SPAN_CLASSES: Record<string, string> = {
  // --- 기본 (1 컬럼) ---
  default_L: "col-span-1 row-span-3", // L: 1x3 셀
  default_M: "col-span-1 row-span-2", // M: 1x2 셀
  default_S: "col-span-1 row-span-1", // S: 1x1 셀

  // --- sm 이상 (4 컬럼) ---
  sm_L: "sm:col-span-2 sm:row-span-2", // L: 2x2 셀
  sm_M: "sm:col-span-2 sm:row-span-1", // M: 2x1 셀
  sm_S: "sm:col-span-1 sm:row-span-1", // S: 1x1 셀

  // --- lg 이상 (6 컬럼) ---
  lg_L: "lg:col-span-3 lg:row-span-2", // L: 3x2 셀
  lg_M: "lg:col-span-2 lg:row-span-2", // M: 2x2 셀
  lg_S: "lg:col-span-2 lg:row-span-1", // S: 2x1 셀
};

type Breakpoint = "default" | "sm" | "lg";

/** 현재 화면 너비에 맞는 breakpoint 문자열 반환 */
const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") return "default";
  const width = window.innerWidth;
  if (width >= 1024) return "lg"; // Tailwind lg breakpoint (1024px)
  if (width >= 640) return "sm"; // Tailwind sm breakpoint (640px)
  return "default";
};

/**
 * 카드 크기와 현재 breakpoint에 맞는 Span 클래스 문자열을 반환합니다.
 * Tailwind의 반응형 동작 방식에 따라 필요한 모든 클래스를 조합합니다.
 * (예: lg breakpoint에서는 default, sm, lg 클래스가 모두 적용됨)
 */
const getSpanClasses = (size: CardSize, breakpoint: Breakpoint): string => {
  const classes = [SPAN_CLASSES[`default_${size}`]]; // 기본 클래스는 항상 포함

  if (breakpoint === "sm" || breakpoint === "lg") {
    classes.push(SPAN_CLASSES[`sm_${size}`]); // sm 이상일 때 sm 클래스 추가
  }
  if (breakpoint === "lg") {
    classes.push(SPAN_CLASSES[`lg_${size}`]); // lg 이상일 때 lg 클래스 추가
  }

  // 유효한 클래스만 필터링하고 공백으로 연결
  return classes.filter(Boolean).join(" ");
};

// =======================================================================
// 3. 데이터 관련 헬퍼 (src/utils/dataUtils.ts 또는 유사 파일로 분리 권장)
// =======================================================================

/** 전체 콘텐츠 데이터 (초기 로딩) */
const allContentData: CardData[] = contents as CardData[];

/** 콘텐츠 로딩 실패 시 사용할 Fallback 데이터 생성 */
const createFallbackData = (reason: string): CardData => ({
  id: -1 * Date.now(), // 임시 고유 ID (충돌 방지)
  title: `콘텐츠 로딩 실패`,
  popularity: "low",
  imageUrl: undefined,
  questionText: reason,
  description: "데이터를 불러오는 중 문제가 발생했습니다.",
  meta: { soulLinkCount: 0, memberCount: 0, questionCount: 0, answerCount: 0 },
});

// =======================================================================
// 4. 공통 UI 컴포넌트: CardMetaInfo (src/components/CardMetaInfo.tsx)
// =======================================================================

interface CardMetaInfoProps {
  meta: MetaData;
}

const CardMetaInfo: React.FC<CardMetaInfoProps> = memo(({ meta }) => (
  // 메타 정보 컨테이너: 카드 하단에 위치하며, 공간 부족 시 줄바꿈(flex-wrap)
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-white/10 mt-auto flex-shrink-0 p-3 sm:p-4">
    {/* 각 메타 정보 아이템 */}
    <span className="flex items-center text-xs text-white/60 whitespace-nowrap">
      <LinkIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 소울링크{" "}
      {meta.soulLinkCount.toLocaleString()}쌍
    </span>
    <span className="flex items-center text-xs text-white/60 whitespace-nowrap">
      <UserGroupIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 멤버{" "}
      {meta.memberCount.toLocaleString()}명
    </span>
    <span className="flex items-center text-xs text-white/60 whitespace-nowrap">
      <QuestionMarkCircleIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> 질문{" "}
      {meta.questionCount.toLocaleString()}개
    </span>
    <span className="flex items-center text-xs text-white/60 whitespace-nowrap">
      <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />{" "}
      답변 {meta.answerCount.toLocaleString()}개
    </span>
  </div>
));
CardMetaInfo.displayName = "CardMetaInfo";

// =======================================================================
// 5. 크기별 카드 컴포넌트 (각각 src/components/LargeCard.tsx 등으로 분리)
//    [리팩토링]: 이미지 영역 비율 처리 추가
// =======================================================================

interface CardComponentProps {
  data: CardData;
}

/** 일반적인 책 표지 비율 (너비:높이) */
const BOOK_COVER_ASPECT_RATIO = "aspect-[2/3]"; // 예: 2:3 비율

// --- LargeCard ---
const LargeCard: React.FC<CardComponentProps> = memo(({ data }) => {
  const { title, imageUrl, questionText, description, meta } = data;
  return (
    // 가로 분할 레이아웃 (이미지 + 텍스트)
    <div className="flex flex-row h-full w-full">
      {/* 이미지 영역 (존재할 경우) */}
      {imageUrl && (
        // [변경] 고정 너비 제거, aspect-ratio 추가
        <div
          className={`relative ${BOOK_COVER_ASPECT_RATIO} flex-shrink-0 h-full overflow-hidden rounded-l-lg bg-black/20`} // 배경색 추가 (contain 시 빈 공간 처리)
        >
          <Image
            src={imageUrl}
            alt={`${title} 표지 이미지`}
            fill // 부모 요소(div)를 채우도록 설정
            // [변경] object-contain으로 변경하여 이미지 전체가 보이도록 함 (잘림 방지)
            // 만약 이미지가 비율에 맞게 잘려도 된다면 object-cover 사용
            className="object-contain" // contain: 비율 유지하며 요소 안에 맞춤, cover: 비율 유지하며 요소 덮음 (잘릴 수 있음)
            // sizes: L 카드의 예상 너비에 맞춰 브라우저에 힌트 제공 (성능 최적화)
            // aspect-ratio 사용으로 너비가 가변적이므로, 더 정교한 계산이 필요할 수 있음 (우선 기존 값 유지)
            sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 17vw" // 예시 값 (컨테이너 높이와 비율 기반으로 추정)
            priority={data.id <= ITEMS_PER_PAGE} // 초기 로딩 성능 향상
            onError={(e) => {
              (e.target as HTMLImageElement).closest("div")?.remove(); // 이미지 로딩 실패 시 부모 div 제거
            }}
          />
        </div>
      )}
      {/* 텍스트 영역 */}
      {/* 이미지 유무에 따라 padding 조절 (이미지가 없으면 왼쪽 패딩 추가) */}
      <div
        className={`flex flex-1 flex-col justify-between space-y-1 sm:space-y-2 overflow-hidden ${
          imageUrl ? "p-3 sm:p-4" : "p-3 sm:p-4 pl-3 sm:pl-4"
        }`}
      >
        {/* 상단 텍스트 (제목, 질문, 설명) */}
        <div className="flex-grow min-h-0">
          <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
            {title}
          </p>
          <h2
            className="text-xl sm:text-2xl font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
            title={questionText} // 전체 텍스트 툴팁 제공
          >
            {questionText}
          </h2>
          <p
            className="text-sm text-white/70 line-clamp-3 sm:line-clamp-4" // 화면 크기에 따라 줄 수 조절
            title={description}
          >
            {description}
          </p>
        </div>
        {/* 하단 메타 정보 */}
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
LargeCard.displayName = "LargeCard";

// --- MediumCard ---
const MediumCard: React.FC<CardComponentProps> = memo(({ data }) => {
  const { title, imageUrl, questionText, description, meta } = data;
  return (
    // 가로 분할 레이아웃 (이미지 + 텍스트)
    <div className="flex flex-row h-full w-full">
      {/* 이미지 영역 (L카드와 동일한 비율 처리) */}
      {imageUrl && (
        // [변경] 고정 너비 제거, aspect-ratio 추가
        <div
          className={`relative ${BOOK_COVER_ASPECT_RATIO} flex-shrink-0 h-full overflow-hidden rounded-l-lg bg-black/20`} // 배경색 추가
        >
          <Image
            src={imageUrl}
            alt={`${title} 표지 이미지`}
            fill
            // [변경] object-contain으로 변경
            className="object-contain"
            // sizes: M 카드의 예상 너비에 맞춰 브라우저에 힌트 제공
            // L 카드와 유사하게 너비 가변적이므로 sizes 조정 필요할 수 있음
            sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 17vw" // 예시 값 (L과 비슷하거나 약간 작게 추정)
            priority={data.id <= ITEMS_PER_PAGE}
            onError={(e) => {
              (e.target as HTMLImageElement).closest("div")?.remove(); // 이미지 로딩 실패 시 부모 div 제거
            }}
          />
        </div>
      )}
      {/* 텍스트 영역 */}
      {/* 이미지 유무에 따라 padding 조절 */}
      <div
        className={`flex flex-1 flex-col justify-between space-y-1 sm:space-y-2 overflow-hidden ${
          imageUrl ? "p-3 sm:p-4" : "p-3 sm:p-4 pl-3 sm:pl-4"
        }`}
      >
        {/* 상단 텍스트 */}
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
            className="text-sm text-white/70 line-clamp-2 sm:line-clamp-3" // M카드는 L카드보다 설명 줄 수 줄임
            title={description}
          >
            {description}
          </p>
        </div>
        {/* 하단 메타 정보 */}
        <CardMetaInfo meta={meta} />
      </div>
    </div>
  );
});
MediumCard.displayName = "MediumCard";

// --- SmallCard --- (이미지가 없으므로 변경 없음)
const SmallCard: React.FC<CardComponentProps> = memo(({ data }) => {
  const { title, questionText, meta } = data;
  return (
    // 세로 배치 레이아웃 (텍스트 위주)
    <div className="flex flex-col h-full w-full justify-between">
      {/* 상단 텍스트 (제목, 질문) */}
      <div className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-hidden">
        <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
          {title}
        </p>
        <h2
          className="text-sm sm:text-base font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
          title={questionText}
        >
          {questionText}
        </h2>
        {/* S 카드에서는 필요 시 추가 정보 표시 가능 */}
        {/* <p className="text-xs text-white/70 line-clamp-1" title={description}>{description}</p> */}
      </div>
      {/* 하단 메타 정보 */}
      <CardMetaInfo meta={meta} />
    </div>
  );
});
SmallCard.displayName = "SmallCard";

// =======================================================================
// 6. 카드 컨텐츠 래퍼 (src/components/CardContent.tsx)
//    (변경 없음)
// =======================================================================

interface CardContentProps {
  item: GridItem; // GridItem 타입 사용
}

/**
 * GridItem 데이터를 받아 할당된 크기에 맞는 카드 컴포넌트를 렌더링합니다.
 * Fallback UI 처리도 담당합니다.
 */
const CardContent: React.FC<CardContentProps> = memo(({ item }) => {
  const { data, assignedSize } = item;

  // 데이터 로딩 실패 시 Fallback UI
  if (data.id < 0) {
    // id가 음수이면 fallback 데이터로 간주
    return (
      <div className="flex items-center justify-center h-full w-full p-4 text-center">
        <p className="text-sm text-red-400">{data.questionText}</p>{" "}
        {/* 실패 사유 표시 */}
      </div>
    );
  }

  // 할당된 크기에 따라 적절한 카드 컴포넌트 렌더링
  switch (assignedSize) {
    case "L":
      return <LargeCard data={data} />;
    case "M":
      return <MediumCard data={data} />;
    case "S":
      return <SmallCard data={data} />;
    default:
      // 알 수 없는 크기일 경우 경고 출력 및 기본(S) 렌더링
      console.warn("알 수 없는 카드 크기가 할당되었습니다:", assignedSize);
      return <SmallCard data={data} />;
  }
});
CardContent.displayName = "CardContent";

// =======================================================================
// 7. 개별 카드 컴포넌트 (Grid 아이템) (src/components/Card.tsx)
//    (변경 없음)
// =======================================================================

interface CardProps {
  item: GridItem;
  breakpoint: Breakpoint; // 현재 화면 breakpoint
}

/**
 * 개별 Grid 아이템을 나타내는 카드 컴포넌트입니다.
 * 기본 스타일과 현재 breakpoint 및 할당된 크기에 따른 동적 span 클래스를 적용합니다.
 */
const Card: React.FC<CardProps> = memo(({ item, breakpoint }) => {
  // 현재 breakpoint와 할당된 크기에 맞는 Span 클래스 계산
  const spanClasses = getSpanClasses(item.assignedSize, breakpoint);

  return (
    // 기본 카드 스타일과 동적으로 계산된 span 클래스 적용
    <div className={`${BASE_CARD_STYLE} ${spanClasses}`}>
      {/* 내부 콘텐츠 렌더링은 CardContent에 위임 */}
      <CardContent item={item} />
    </div>
  );
});
Card.displayName = "Card";

// =======================================================================
// 8. 메인 페이지 컴포넌트 (src/app/page.tsx 또는 HomePage.tsx)
//    (변경 없음)
// =======================================================================

export default function HomePage() {
  const [items, setItems] = useState<GridItem[]>([]); // Grid 아이템 목록 상태
  const [totalLoadedCount, setTotalLoadedCount] = useState(0); // 로드된 아이템 총 개수 (패턴 인덱싱용)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 로드할 데이터 존재 여부
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<Breakpoint>("default"); // 현재 반응형 breakpoint

  const observerRef = useRef<IntersectionObserver | null>(null); // Intersection Observer 인스턴스 ref
  const loaderRef = useRef<HTMLDivElement | null>(null); // Observer가 감지할 로더 요소 ref

  // --- Hooks ---

  // 화면 크기 변경 감지 및 breakpoint 업데이트
  useEffect(() => {
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };
    handleResize(); // 초기 breakpoint 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // 클린업
  }, []);

  // 데이터 로드 함수 (무한 스크롤)
  const loadMoreItems = useCallback(async () => {
    // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 중단
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // 실제 API 호출 시 여기에 fetch 로직 추가
    await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 시뮬레이션

    const startIndex = totalLoadedCount;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newDataSlice = allContentData.slice(startIndex, endIndex);

    if (newDataSlice.length > 0) {
      // 새로 로드된 데이터에 크기 할당
      const newGridItems: GridItem[] = newDataSlice.map((data, index) => {
        const overallIndex = startIndex + index; // 전체 데이터에서의 인덱스
        const patternIndex = overallIndex % CARD_SIZE_PATTERN.length; // 패턴 순환 인덱스
        return {
          data: data,
          assignedSize: CARD_SIZE_PATTERN[patternIndex], // 패턴에 따라 크기 할당
        };
      });

      setItems((prevItems) => [...prevItems, ...newGridItems]); // 기존 목록에 새 아이템 추가
      setTotalLoadedCount(endIndex); // 로드된 총 개수 업데이트
    }

    // 모든 데이터를 로드했는지 확인
    if (endIndex >= allContentData.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, totalLoadedCount]); // 의존성 배열 명시

  // Intersection Observer 설정 및 관리
  useEffect(() => {
    // Observer 콜백: 로더 요소가 화면에 보이고, 추가 데이터가 있으며, 로딩 중이 아닐 때 loadMoreItems 호출
    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMoreItems();
      }
    };

    // Observer 인스턴스 생성
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.8, // 로더 요소가 80% 보일 때 트리거
    });

    const currentLoaderElement = loaderRef.current;
    if (currentLoaderElement) {
      observerRef.current.observe(currentLoaderElement); // 로더 요소 관찰 시작
    }

    // 클린업 함수: 컴포넌트 언마운트 시 관찰 중지
    return () => {
      if (observerRef.current && currentLoaderElement) {
        observerRef.current.unobserve(currentLoaderElement);
      }
    };
  }, [loadMoreItems, hasMore, isLoading]); // 의존성 배열 명시

  // 초기 데이터 로드 (컴포넌트 마운트 시 한 번 실행)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // 초기 로딩 시뮬레이션

      const initialData = allContentData.slice(0, ITEMS_PER_PAGE);

      if (initialData.length > 0) {
        const initialGridItems: GridItem[] = initialData.map((data, index) => {
          const patternIndex = index % CARD_SIZE_PATTERN.length;
          return {
            data: data,
            assignedSize: CARD_SIZE_PATTERN[patternIndex],
          };
        });
        setItems(initialGridItems);
        setTotalLoadedCount(initialData.length); // 초기 로드된 개수 설정
      }

      if (
        initialData.length < ITEMS_PER_PAGE ||
        allContentData.length <= ITEMS_PER_PAGE
      ) {
        setHasMore(false); // 데이터가 페이지 크기보다 적으면 더 이상 로드할 것 없음
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, []); // 초기 로드이므로 의존성 없음

  // --- 렌더링 ---

  // 동적 Grid 컨테이너 클래스 생성
  const gridContainerClasses = `grid ${GRID_COLS_CLASSES} gap-1 sm:gap-2 grid-flow-row-dense`;

  return (
    <div className="w-full min-h-screen bg-black p-1 sm:p-2">
      {/* CSS Grid 컨테이너 */}
      <div
        className={gridContainerClasses}
        style={{ gridAutoRows: GRID_AUTO_ROWS_STYLE }} // 기본 행 높이 설정 (Masonry 레이아웃 핵심)
      >
        {items.map((item) => (
          <Card
            // key는 고유해야 함. Fallback 데이터의 경우 임시 ID 사용
            key={
              item.data.id < 0
                ? `fallback-${item.data.id}`
                : `card-${item.data.id}`
            }
            item={item}
            breakpoint={currentBreakpoint} // 현재 breakpoint 전달하여 올바른 span 클래스 적용
          />
        ))}
      </div>

      {/* 로딩 상태 표시 및 Intersection Observer 트리거 요소 */}
      <div
        ref={loaderRef}
        className="h-20 flex justify-center items-center text-white/60"
        aria-live="polite" // 로딩 상태 변경 알림
      >
        {isLoading && <p>로딩 중...</p>}
        {!isLoading && !hasMore && items.length > 0 && (
          <p>모든 콘텐츠를 불러왔습니다.</p>
        )}
      </div>

      {/* 초기 데이터 로딩 전 또는 데이터가 없을 때의 메시지 */}
      {!isLoading && items.length === 0 && !hasMore && (
        <div className="text-center text-white/60 py-10">
          표시할 콘텐츠가 없습니다.
          {/* `contents.json` 관련 메시지는 실제 데이터 소스에 따라 수정 */}
          {/* (예: "데이터를 불러오는 데 실패했습니다.") */}
        </div>
      )}
    </div>
  );
}
