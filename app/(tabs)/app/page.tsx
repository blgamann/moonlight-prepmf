// src/app/page.tsx (또는 해당 파일 경로)

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useResizeObserver } from "@react-hookz/web"; // 너비 감지를 위한 라이브러리 (설치 필요: npm install @react-hookz/web)

// 더미 데이터 경로 확인 필요
import contents from "@/app/dummy/contents.json";

// =======================================================================
// 1. 타입 정의
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
  popularity: "high" | "medium" | "low"; // 인기도 사용
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
// 2. 상수 및 설정
// =======================================================================

/** 기본 카드 스타일 */
const BASE_CARD_STYLE =
  "bg-gradient-to-br from-[#111] to-[#181818] overflow-hidden rounded-lg shadow-lg border border-[#6dd1e4]/10 transition-all duration-150 ease-in-out hover:border-[#6dd1e4]/30 flex flex-col shrink-0"; // shrink-0 추가

/** 카드 크기별 고정 세로 높이 (px) */
const CARD_FIXED_HEIGHTS: Record<CardSize, number> = {
  L: 300,
  M: 200,
  S: 100,
};

/** 카드 크기별 기본 너비 (px) */
const CARD_BASE_WIDTHS: Record<CardSize, number> = {
  L: 900,
  M: 600,
  S: 300,
};

/** 카드 간 가로 간격 (px) */
const GAP_X = 8; // Tailwind gap-2 에 해당

/** 무한 스크롤: 한 번에 불러올 아이템 개수 */
const ITEMS_PER_PAGE = 10;

// =======================================================================
// 3. 데이터 관련 헬퍼
// =======================================================================

/** 전체 콘텐츠 데이터 (초기 로딩) */
const allContentData: CardData[] = contents as CardData[];

/** 인기도에 따라 카드 크기를 할당하는 함수 */
const assignSizeBasedOnPopularity = (item: CardData): CardSize => {
  switch (item.popularity) {
    case "high":
      return "L";
    case "medium":
      return "M";
    case "low":
      return "S";
    default:
      return "S"; // 기본값
  }
};

// 콘텐츠 로딩 실패 시 사용할 Fallback 데이터 생성 (필요시 사용)
const createFallbackData = (reason: string): CardData => ({
  id: -1 * Date.now(), // 임시 고유 ID
  title: `콘텐츠 로딩 실패`,
  popularity: "low",
  imageUrl: undefined,
  questionText: reason,
  description: "데이터를 불러오는 중 문제가 발생했습니다.",
  meta: { soulLinkCount: 0, memberCount: 0, questionCount: 0, answerCount: 0 },
});

// =======================================================================
// 4. 공통 UI 컴포넌트: CardMetaInfo
// =======================================================================
interface CardMetaInfoProps {
  meta: MetaData;
}
const CardMetaInfo: React.FC<CardMetaInfoProps> = memo(({ meta }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-white/10 mt-auto flex-shrink-0 p-3 sm:p-4">
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
// 5. 카드 컨텐츠 래퍼: CardContent
// =======================================================================
interface CardContentProps {
  item: GridItem; // GridItem 타입 사용
}

const CardContent: React.FC<CardContentProps> = memo(({ item }) => {
  const { data, assignedSize } = item;
  const { title, imageUrl, questionText, description, meta } = data;

  // 데이터 로딩 실패 시 Fallback UI
  if (data.id < 0) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4 text-center">
        <p className="text-sm text-red-400">{data.questionText}</p>
      </div>
    );
  }

  // L, M 카드 공통 이미지 렌더링 로직
  const renderImage = () =>
    imageUrl && (
      <div
        className={`relative aspect-[2/3] flex-shrink-0 h-full overflow-hidden rounded-l-lg bg-black/20 mr-4`} // 비율 및 간격
      >
        <Image
          src={imageUrl}
          alt={`${title} 표지 이미지`}
          fill
          className="object-contain" // contain으로 변경하여 비율 유지
          sizes="(max-width: 767px) 30vw, 15vw" // sizes 최적화 필요
          priority={data.id <= ITEMS_PER_PAGE} // 첫 페이지 아이템 우선 로드
          onError={(e) => {
            // 이미지 로드 실패 시 이미지 영역 제거
            (e.target as HTMLImageElement).closest("div")?.remove();
          }}
        />
      </div>
    );

  // 카드 크기별 내부 레이아웃
  switch (assignedSize) {
    case "L":
      return (
        <div className="flex flex-row h-full w-full p-4">
          {" "}
          {/* 패딩 적용 */}
          {renderImage()}
          <div
            className={`flex flex-1 flex-col justify-between space-y-1 sm:space-y-2 overflow-hidden`}
          >
            {/* 상단 텍스트 */}
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
            {/* 하단 메타 정보 */}
            <CardMetaInfo meta={meta} />
          </div>
        </div>
      );
    case "M":
      return (
        <div className="flex flex-row h-full w-full p-4">
          {" "}
          {/* 패딩 적용 */}
          {renderImage()}
          <div
            className={`flex flex-1 flex-col justify-between space-y-1 sm:space-y-2 overflow-hidden`}
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
                className="text-sm text-white/70 line-clamp-2 sm:line-clamp-3"
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
    case "S":
      return (
        <div className="flex flex-col h-full w-full justify-between p-4">
          {" "}
          {/* 패딩 적용 */}
          {/* 상단 텍스트 */}
          <div className="space-y-1 sm:space-y-2 overflow-hidden">
            <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
              {title}
            </p>
            <h2
              className="text-sm sm:text-base font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
              title={questionText}
            >
              {questionText}
            </h2>
          </div>
          {/* 하단 메타 정보 */}
          <CardMetaInfo meta={meta} />
        </div>
      );
    default:
      // 이론적으로는 발생하지 않지만, 안전을 위해 Fallback
      console.warn(
        "알 수 없는 카드 크기가 CardContent에 전달되었습니다:",
        assignedSize
      );
      // Fallback UI 또는 S 카드 렌더링
      return (
        <div className="flex flex-col h-full w-full justify-between p-4">
          <div className="space-y-1 sm:space-y-2 overflow-hidden">
            <p className="text-xs sm:text-sm font-medium text-[#6dd1e4] mb-1 truncate">
              {title}
            </p>
            <h2
              className="text-sm sm:text-base font-bold text-white/90 leading-tight mb-1 sm:mb-2 line-clamp-2"
              title={questionText}
            >
              {questionText}
            </h2>
          </div>
          <CardMetaInfo meta={meta} />
        </div>
      );
  }
});
CardContent.displayName = "CardContent";

// =======================================================================
// 6. 개별 카드 컴포넌트: Card
// =======================================================================
interface CardProps {
  item: GridItem;
  baseWidth: number;
  n: number; // 해당 행에서 계산된 n 값
}

const Card: React.FC<CardProps> = memo(({ item, baseWidth, n }) => {
  const height = CARD_FIXED_HEIGHTS[item.assignedSize];
  // calc() 를 사용하여 최종 너비 계산
  const widthStyle = `calc(${baseWidth}px + ${n}px)`;

  return (
    <div
      className={`${BASE_CARD_STYLE}`}
      style={{
        width: widthStyle,
        height: `${height}px`,
      }}
    >
      {/* 내부 콘텐츠 렌더링은 CardContent에 위임 */}
      <CardContent item={item} />
    </div>
  );
});
Card.displayName = "Card";

// =======================================================================
// 7. 행(Row) 컴포넌트
// =======================================================================
interface RowProps {
  items: GridItem[];
  containerWidth: number; // 행이 그려질 컨테이너의 실제 너비
  gap: number; // 카드 간 간격
}

const Row: React.FC<RowProps> = memo(({ items, containerWidth, gap }) => {
  // 행 아이템이 없으면 렌더링 안 함
  if (!items || items.length === 0) return null;

  // 현재 행의 카드들의 기본 너비 합 계산
  const sumOfBaseWidths = items.reduce(
    (sum, item) => sum + CARD_BASE_WIDTHS[item.assignedSize],
    0
  );

  // 행 전체에서 카드 간 간격의 총합 계산
  const totalGapWidth = (items.length - 1) * gap;

  // 남는 공간 계산 (컨테이너 너비 - 기본 너비 합 - 총 간격)
  const remainingSpace = containerWidth - sumOfBaseWidths - totalGapWidth;

  // 각 카드에 분배될 n 값 계산
  const n = items.length > 0 ? remainingSpace / items.length : 0;

  // 디버깅용 로그 (실제 운영 시 제거)
  // console.log(`Row Items: ${items.map(i => i.assignedSize).join(',')}, Container: ${containerWidth.toFixed(0)}, BaseSum: ${sumOfBaseWidths}, GapSum: ${totalGapWidth}, Remain: ${remainingSpace.toFixed(2)}, n: ${n.toFixed(2)}`);

  return (
    // Flexbox 행 컨테이너
    <div className="flex w-full" style={{ gap: `${gap}px` }}>
      {items.map((item) => (
        <Card
          key={item.data.id} // 데이터의 고유 ID 사용
          item={item}
          baseWidth={CARD_BASE_WIDTHS[item.assignedSize]}
          n={n} // 계산된 n 값 전달
        />
      ))}
    </div>
  );
});
Row.displayName = "Row";

// =======================================================================
// 8. 메인 레이아웃 컴포넌트: HorizontalMasonryPage
// =======================================================================

// Breakpoint 정의
type Breakpoint = "default" | "sm" | "md" | "lg";

// 현재 너비에 맞는 Breakpoint 문자열 반환
const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "default";
};

// Breakpoint별 추천 조합 패턴 정의 (요구사항 가이드 참고, 선호도 순서)
const ROW_PATTERNS: Record<Breakpoint, CardSize[][]> = {
  default: [["L"], ["M"], ["S"]], // 너비 좁을 때 단일 카드 선호
  sm: [["L", "S"], ["M", "M"], ["S", "S", "S", "S"], ["L"], ["M"], ["S"]], // 1200px 근처 목표 + 단일 카드 fallback
  md: [
    ["L", "M", "S"],
    ["L", "L"],
    ["M", "M", "M"],
    ["L", "S", "S"],
    ["M", "S", "S", "S"],
    ["L", "M"],
    ["L"],
    ["M"],
    ["S"],
  ], // 1800, 1500px 근처 목표 + fallback
  lg: [
    ["L", "M", "S"],
    ["M", "M", "M"],
    ["L", "L"],
    ["L", "S", "S"],
    ["L", "L", "S"],
    ["L", "M", "M"],
    ["L", "L", "L"],
    ["L", "M"],
    ["L"],
    ["M"],
    ["S"],
  ], // 다양한 조합 + fallback
};

export default function HorizontalMasonryPage() {
  const [allItems, setAllItems] = useState<GridItem[]>([]); // 로드된 모든 아이템 (크기 할당됨)
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // 현재 페이지 번호 (무한 스크롤용)

  const containerRef = useRef<HTMLDivElement | null>(null); // 레이아웃 컨테이너 Ref
  const [containerWidth, setContainerWidth] = useState(0); // 컨테이너 너비 상태
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("default"); // 현재 breakpoint 상태

  const loaderRef = useRef<HTMLDivElement | null>(null); // 무한 스크롤 감지 요소 Ref
  const observerRef = useRef<IntersectionObserver | null>(null); // Intersection Observer 인스턴스 Ref

  // --- 컨테이너 너비 감지 및 Breakpoint 설정 ---
  useResizeObserver(containerRef, (entry) => {
    const newWidth = entry.contentRect.width;
    // 너비가 0보다 크고 실제 변경되었을 때만 상태 업데이트
    if (newWidth > 0 && newWidth !== containerWidth) {
      setContainerWidth(newWidth);
      setBreakpoint(getCurrentBreakpoint(newWidth));
    }
  });

  // --- 데이터 로드 함수 (무한 스크롤) ---
  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // 실제 API 호출 대신 더미 데이터 슬라이싱
    await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션

    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newDataSlice = allContentData.slice(startIndex, endIndex);

    if (newDataSlice.length > 0) {
      // 새로 로드된 데이터에 크기 할당 (인기도 기반)
      const newGridItems: GridItem[] = newDataSlice.map((data) => ({
        data: data,
        assignedSize: assignSizeBasedOnPopularity(data),
      }));

      setAllItems((prevItems) => [...prevItems, ...newGridItems]);
      setPage((prevPage) => prevPage + 1); // 다음 페이지로
    }

    // 모든 데이터를 로드했는지 확인
    if (endIndex >= allContentData.length) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [isLoading, hasMore, page]); // 의존성 배열 명시

  // --- Intersection Observer 설정 (무한 스크롤) ---
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // 로더 요소가 보이고, 더 로드할 데이터가 있으며, 로딩 중이 아닐 때 실행
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

  // --- 초기 데이터 로드 ---
  useEffect(() => {
    loadMoreItems(); // 컴포넌트 마운트 시 첫 페이지 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회만 실행

  // --- 행 그룹핑 로직 (개선됨: 패턴 매칭 + Greedy Fallback) ---
  const groupedRows = useMemo(() => {
    const rows: GridItem[][] = [];
    // 컨테이너 너비가 유효하지 않거나 아이템이 없으면 빈 배열 반환
    if (containerWidth <= 0 || allItems.length === 0) return rows;

    // 현재 breakpoint에 맞는 패턴 목록 가져오기
    const currentPatterns = ROW_PATTERNS[breakpoint] || ROW_PATTERNS.default;
    let currentItemIndex = 0; // 처리할 아이템의 시작 인덱스

    // 모든 아이템을 처리할 때까지 반복
    while (currentItemIndex < allItems.length) {
      let bestMatchRow: GridItem[] | null = null; // 찾은 최적 패턴 매칭 행
      let bestMatchItemsConsumed = 0; // 최적 매칭 시 소비된 아이템 수
      let minWaste = Infinity; // 남는 공간(waste)의 최소 절대값 (작을수록 좋음)

      // 1. 정의된 패턴 매칭 시도 (선호도 순서대로)
      for (const pattern of currentPatterns) {
        // 현재 위치에서 패턴 길이만큼 아이템이 충분히 남았는지 확인
        if (currentItemIndex + pattern.length <= allItems.length) {
          let patternMatch = true; // 현재 패턴과 아이템 크기가 일치하는지 여부
          let patternBaseWidth = 0; // 패턴의 기본 너비 합
          const potentialRow: GridItem[] = []; // 현재 패턴으로 구성될 수 있는 행

          // 패턴의 각 카드 크기와 실제 아이템의 크기 비교
          for (let i = 0; i < pattern.length; i++) {
            const item = allItems[currentItemIndex + i];
            if (item.assignedSize !== pattern[i]) {
              patternMatch = false; // 크기가 다르면 매칭 실패
              break;
            }
            potentialRow.push(item); // 행에 아이템 추가
            patternBaseWidth += CARD_BASE_WIDTHS[item.assignedSize]; // 기본 너비 누적
          }

          // 패턴 매칭 성공 시 적합성 평가
          if (patternMatch) {
            const totalGapWidth = (pattern.length - 1) * GAP_X; // 패턴의 총 간격 너비
            // 남는 공간 계산 (음수 가능)
            const remainingSpace =
              containerWidth - patternBaseWidth - totalGapWidth;
            // 남는 공간의 절대값 (waste)
            const currentWaste = Math.abs(remainingSpace);

            // 현재까지 찾은 최적 조합보다 더 좋으면(waste가 작으면) 업데이트
            // 추가 조건: 너무 많이 남거나 모자라는 경우 제외 (예: 기본 너비 합이 컨테이너 너비의 50%~150% 범위)
            const lowerBound = containerWidth * 0.5; // 최소 너비 비율 (조정 가능)
            const upperBound = containerWidth * 1.5; // 최대 너비 비율 (조정 가능)

            if (
              currentWaste < minWaste &&
              patternBaseWidth >= lowerBound &&
              patternBaseWidth <= upperBound
            ) {
              minWaste = currentWaste; // 최소 waste 업데이트
              bestMatchRow = potentialRow; // 최적 행 조합 업데이트
              bestMatchItemsConsumed = pattern.length; // 소비 아이템 수 업데이트
            }
            // 중요: 여기서 break하지 않고 모든 패턴을 검사하여 최적의 것을 찾음
          }
        }
      } // End of pattern matching loop

      // 2. 패턴 매칭 결과 사용 또는 Greedy 방식으로 처리
      if (bestMatchRow && bestMatchItemsConsumed > 0) {
        // 최적 패턴 조합을 찾았으면 사용
        rows.push(bestMatchRow);
        currentItemIndex += bestMatchItemsConsumed; // 다음 아이템 인덱스로 이동
      } else {
        // 적합한 패턴을 찾지 못했거나 남은 아이템이 부족하면 Greedy 방식 적용
        const currentRow: GridItem[] = [];
        let currentRowBaseWidth = 0;

        // 남은 아이템 중 하나씩 추가하며 너비 체크 (최소 1개는 추가)
        while (currentItemIndex < allItems.length) {
          const item = allItems[currentItemIndex];
          const itemBaseWidth = CARD_BASE_WIDTHS[item.assignedSize];
          // 현재 행에 아이템이 있으면 갭 추가, 없으면 0
          const currentGap = currentRow.length > 0 ? GAP_X : 0;
          // 새 아이템 추가 시 예상되는 너비
          const expectedWidthWithNewItem =
            currentRowBaseWidth + currentGap + itemBaseWidth;

          // 첫 아이템이거나, 추가해도 컨테이너 너비를 넘지 않으면 추가
          if (
            currentRow.length === 0 ||
            expectedWidthWithNewItem <= containerWidth
          ) {
            currentRow.push(item);
            currentRowBaseWidth += itemBaseWidth + currentGap; // 누적 너비 업데이트
            currentItemIndex++; // 다음 아이템으로 이동
          } else {
            // 추가하면 너비를 넘으므로 현재 행 완료
            break;
          }
        }
        // 만들어진 행 추가 (최소 1개 이상일 때)
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        // 예외 처리: 만약 Greedy로도 아이템을 추가하지 못했다면 (예: 첫 아이템부터 너무 클 때)
        // 무한 루프 방지를 위해 최소 1개 아이템으로 행을 만들고 강제로 다음 인덱스로 이동
        else if (currentItemIndex < allItems.length) {
          console.warn(
            "Greedy 방식 행 구성 실패, 아이템 1개로 강제 행 구성:",
            allItems[currentItemIndex].assignedSize
          );
          rows.push([allItems[currentItemIndex]]); // 최소 1개 아이템으로 행 구성
          currentItemIndex++; // 다음 아이템 인덱스로 이동
        }
      }
    } // end while (모든 아이템 처리 완료)

    return rows;
  }, [allItems, containerWidth, breakpoint]); // breakpoint 의존성 추가

  // --- 렌더링 ---
  return (
    <div
      ref={containerRef} // 너비 측정을 위해 ref 연결
      className="w-full min-h-screen bg-black p-1 sm:p-2 px-4 sm:px-8 my-6 space-y-2 sm:space-y-4" // 좌우 패딩, 행 간 간격(space-y)
    >
      {/* 계산된 행들을 렌더링 */}
      {groupedRows.map((rowItems, rowIndex) => (
        <Row
          // 행 내용(아이템 ID 조합)에 따라 고유 키 생성 -> 효율적 리렌더링
          key={`row-${rowIndex}-${rowItems.map((i) => i.data.id).join("-")}`}
          items={rowItems}
          containerWidth={containerWidth} // 계산된 컨테이너 너비 전달
          gap={GAP_X} // 카드 간 간격 전달
        />
      ))}

      {/* 로딩 상태 표시 및 Intersection Observer 트리거 요소 */}
      <div
        ref={loaderRef}
        className="h-20 flex justify-center items-center text-white/60"
        aria-live="polite" // 스크린 리더에게 로딩 상태 변경 알림
      >
        {isLoading && <p>로딩 중...</p>}
        {!isLoading && !hasMore && allItems.length > 0 && (
          <p>모든 콘텐츠를 불러왔습니다.</p>
        )}
      </div>

      {/* 초기 데이터 로딩 전 또는 데이터 없을 때 메시지 */}
      {!isLoading && allItems.length === 0 && !hasMore && (
        <div className="text-center text-white/60 py-10">
          표시할 콘텐츠가 없습니다.
        </div>
      )}
    </div>
  );
}
