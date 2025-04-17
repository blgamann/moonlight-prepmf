import Image from "next/image";
import Link from "next/link";

interface GardenCardProps {
  href: string;
  coverImage: string;
  bookTitle: string;
  author: string;
  title: string;
  description: string;
  meta: {
    publisher: string;
    publishedAt: string;
    genre: string[];
    pages: number;
    isbn: string;
  };
  stats: {
    soulLinks: number;
    members: number;
    questions: number;
    answers: number;
  };
  size?: "small" | "medium" | "large";
}

// Size configurations based on 3.5:1 aspect ratio
const sizeConfig = {
  small: {
    height: 100,
    imageWidth: 60,
    imageHeight: 80,
    titleSize: "text-base",
    authorSize: "text-xs",
    descSize: "text-xs",
    statsSize: "text-xs",
    padding: "p-4",
    gap: "gap-4",
    arrowSize: "text-base",
  },
  medium: {
    height: 200,
    imageWidth: 120,
    imageHeight: 160,
    titleSize: "text-xl",
    authorSize: "text-sm",
    descSize: "text-sm",
    statsSize: "text-sm",
    padding: "p-6",
    gap: "gap-6",
    arrowSize: "text-xl",
  },
  large: {
    height: 300,
    imageWidth: 180,
    imageHeight: 240,
    titleSize: "text-[1.75rem]",
    authorSize: "text-base",
    descSize: "text-base",
    statsSize: "text-[0.95rem]",
    padding: "p-8",
    gap: "gap-8",
    arrowSize: "text-2xl",
  },
};

export const dummyGardens: GardenCardProps[] = [
  {
    href: "/garden/vegetarian",
    coverImage: "/dummy/books/book1.jpeg",
    bookTitle: "채식주의자",
    author: "한강",
    title: "폭력과 욕망의 세계에서 우리는 어떻게 구원받을 수 있을까?",
    description:
      "인간의 폭력성과 욕망, 그리고 구원에 대해 이야기를 나눠보세요.",
    meta: {
      publisher: "창비",
      publishedAt: "2007-10-30",
      genre: ["소설", "한국문학", "현대문학"],
      pages: 247,
      isbn: "9788936433598",
    },
    stats: {
      soulLinks: 76,
      members: 327,
      questions: 13,
      answers: 501,
    },
    size: "small",
  },
  {
    href: "/garden/ant",
    coverImage: "/dummy/books/book2.jpg",
    bookTitle: "개미",
    author: "베르나르 베르베르",
    title: "문명의 진화는 우리를 어디로 이끄는가?",
    description: "진화론의 혁명적 의미는 무엇인지 이야기를 나눠보세요.",
    meta: {
      publisher: "열린책들",
      publishedAt: "2001-07-30",
      genre: ["소설", "프랑스문학", "과학소설"],
      pages: 440,
      isbn: "9788932902791",
    },
    stats: {
      soulLinks: 56,
      members: 287,
      questions: 11,
      answers: 432,
    },
    size: "medium",
  },
  {
    href: "/garden/convenience-store",
    coverImage: "/dummy/books/book3.jpeg",
    bookTitle: "불편한 편의점",
    author: "김호연",
    title: "평범한 일상 속에 숨겨진 특별함은 무엇일까?",
    description:
      "일상 속 작은 순간들이 가진 특별한 의미에 대해 이야기를 나눠보세요.",
    meta: {
      publisher: "나무옆의자",
      publishedAt: "2021-04-20",
      genre: ["소설", "한국문학", "현대소설"],
      pages: 268,
      isbn: "9791161571188",
    },
    stats: {
      soulLinks: 42,
      members: 198,
      questions: 8,
      answers: 245,
    },
    size: "large",
  },
  {
    href: "/garden/last-train",
    coverImage: "/dummy/books/book4.jpeg",
    bookTitle: "세상의 마지막 기차역",
    author: "무라세 다케시",
    title: "당신의 마지막 정거장에서 무엇을 선택하시겠습니까?",
    description:
      "삶과 죽음의 경계에서 마주하는 우리의 선택과 후회에 대해 이야기를 나눠보세요.",
    meta: {
      publisher: "모모",
      publishedAt: "2022-05-27",
      genre: ["소설", "일본문학", "판타지"],
      pages: 300,
      isbn: "9791190936729",
    },
    stats: {
      soulLinks: 38,
      members: 156,
      questions: 9,
      answers: 287,
    },
    size: "large",
  },
  {
    href: "/garden/pain",
    coverImage: "/dummy/books/book5.jpg",
    bookTitle: "아픔이 길이 되려면",
    author: "김승섭",
    title: "우리 사회의 불평등은 건강에 어떤 영향을 미치나요?",
    description:
      "차별과 불평등이 건강에 미치는 영향에 대해 이야기를 나눠보세요.",
    meta: {
      publisher: "동아시아",
      publishedAt: "2017-04-01",
      genre: ["인문", "사회과학", "의학"],
      pages: 368,
      isbn: "9788962621057",
    },
    stats: {
      soulLinks: 31,
      members: 142,
      questions: 7,
      answers: 198,
    },
    size: "large",
  },
  {
    href: "/garden/fairness",
    coverImage: "/dummy/books/book6.jpeg",
    bookTitle: "공정하다는 착각",
    author: "마이클 샌델",
    title: "실력주의는 정말 공정한 시스템일까요?",
    description: "현대 사회의 능력주의가 가진 맹점과 대안에 대해 토론해보세요.",
    meta: {
      publisher: "와이즈베리",
      publishedAt: "2020-12-01",
      genre: ["인문", "철학", "사회과학"],
      pages: 396,
      isbn: "9791190538510",
    },
    stats: {
      soulLinks: 45,
      members: 234,
      questions: 12,
      answers: 367,
    },
    size: "large",
  },
];

export default function GardenCard({
  href,
  coverImage,
  bookTitle,
  author,
  title,
  description,
  stats,
  size = "large",
}: GardenCardProps) {
  const config = sizeConfig[size];

  return (
    <Link
      href={href}
      className={`group relative flex ${config.gap} ${config.padding} rounded-3xl border border-white/10 bg-[rgba(20,20,20,0.6)] hover:bg-[rgba(30,30,30,0.7)] transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg hover:shadow-black/20 overflow-hidden`}
      style={{ height: config.height }}
    >
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: config.imageWidth, height: config.imageHeight }}
      >
        <Image
          src={coverImage}
          alt={bookTitle}
          fill
          sizes={`${config.imageWidth}px`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <p
            className={`text-[#36bccf] mb-2 ${config.authorSize} whitespace-nowrap overflow-hidden text-ellipsis`}
          >
            {author}의 「{bookTitle}」
          </p>
          <h2
            className={`text-white ${config.titleSize} font-bold leading-tight mb-3 line-clamp-2 break-keep`}
          >
            {title}
          </h2>
          <p
            className={`text-white/70 ${config.descSize} leading-normal mb-4 line-clamp-3`}
          >
            {description}
          </p>
        </div>
        <div
          className={`text-white/60 ${config.statsSize} whitespace-nowrap overflow-hidden text-ellipsis`}
        >
          소울링크 {stats.soulLinks}쌍 · 멤버 {stats.members}명 · 질문{" "}
          {stats.questions}개 · 답변 {stats.answers}개
        </div>
      </div>
      <div
        className={`absolute ${config.padding.replace(
          "p-",
          "top-"
        )} ${config.padding.replace(
          "p-",
          "right-"
        )} text-[#36bccf] opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${
          config.arrowSize
        }`}
      >
        →
      </div>
    </Link>
  );
}
