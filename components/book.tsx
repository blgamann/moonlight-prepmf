import React from "react";

// Props for BookSm
export interface BookSmProps {
  title: string;
  imageUrl: string;
  altText?: string;
}

// Props for BookLg
interface BookLgProps {
  imageUrl: string;
  title: string;
  altText?: string;
}

// Props for BookMd
interface BookMdProps {
  imageUrl: string;
  answerTitle: string;
  answerText: string;
  altText?: string;
}

// Props for BookMdQuestion
interface BookMdQuestionProps {
  imageUrl: string;
  title: string;
  question: string;
  altText?: string;
}

// Props for BookMdMeta
interface BookMdMetaProps {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string; // Or Date object
  altText?: string;
}

// 1. BookSm: Displays only the book cover
export function BookSm({ title, imageUrl, altText }: BookSmProps) {
  return (
    <div className="">
      <img
        src={imageUrl}
        alt={altText ?? `${title} book cover`}
        width={24}
        height={50}
        className="object-cover shadow-md"
        style={{ width: "24px", height: "50px" }}
      />
    </div>
  );
}

// 2. Updated BookMdQuestion: Displays cover, title (linked), and a question based on snippet
export function BookMdQuestion({
  imageUrl,
  title,
  question,
  altText,
}: BookMdQuestionProps) {
  const bookSlug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center space-x-4 border-b border-t border-white/15 py-6">
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={altText ?? `${title} cover`}
          width={55}
          height={90}
          className="object-cover"
          style={{ width: "55px", height: "90px" }}
        />
      </div>
      <div className="flex flex-col flex-grow min-w-0">
        <a
          href={`/book/${bookSlug}`}
          className="text-base text-white/60 hover:underline mb-1"
        >
          {title}
        </a>
        <p className="text-lg mt-1 text-white/95 line-clamp-2">{question}</p>
      </div>
    </div>
  );
}

export function BookMdAnswer({
  imageUrl,
  answerTitle,
  answerText,
  altText,
}: BookMdProps) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={altText ?? `${answerTitle} cover`}
          width={55}
          height={90}
          className="object-cover"
          style={{ width: "55px", height: "90px" }}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden mt-1">
        <a
          href="/profile/answer/detail"
          className="text-xl font-semibold text-white/95 cursor-pointer hover:underline"
        >
          {answerTitle}
        </a>
        <p className="text-base text-white/60 mt-1.5 line-clamp-2">
          {answerText}
        </p>
      </div>
    </div>
  );
}

// 3. Updated BookMdMeta based on search result snippet
export function BookMdMeta({
  imageUrl,
  title,
  author,
  publisher,
  publicationDate, // Expects YYYYMMDD format for formatting logic
  altText,
}: BookMdMetaProps) {
  // Format date YYYYMMDD to YYYY. MM. DD.
  const formatDate = (dateStr: string) => {
    if (dateStr && dateStr.length === 8) {
      return `${dateStr.substring(0, 4)}. ${dateStr.substring(
        4,
        6
      )}. ${dateStr.substring(6, 8)}.`;
    }
    return dateStr; // Fallback if format is unexpected
  };

  const formattedDate = formatDate(publicationDate);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={altText ?? `Cover of ${title}`}
          width={55}
          height={90}
          className="object-cover"
          style={{ width: "55px", height: "90px" }}
        />
      </div>
      {/* Adjusted text container height to match image */}
      <div className="flex-grow flex flex-col justify-center">
        <a
          href={`/book`}
          className="text-lg font-semibold text-white/95 hover:underline mb-1"
        >
          {title}
        </a>
        <p className="text-sm mt-1">
          <span className="text-white/40">저자</span>{" "}
          <span className="text-white/60">{author}</span>
        </p>
        <p className="text-sm mt-1">
          <span className="text-white/40">출판</span>{" "}
          <span className="text-white/60">
            {publisher} · {formattedDate}
          </span>
        </p>
      </div>
    </div>
  );
}

// 4. BookLg: Displays book cover and title
export function BookLg({ imageUrl, title, altText }: BookLgProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={imageUrl}
        alt={altText ?? `${title} book cover`}
        width={100}
        height={150}
        className="object-cover shadow-md"
        style={{ width: "100px", height: "150px" }}
      />
      {/* <span className="text-base text-white/95 text-center cursor-pointer hover:underline line-clamp-2">
        {title}
      </span> */}
    </div>
  );
}

// 4. BookLg: Displays book cover and title
export function BookLgBordered({ imageUrl, title, altText }: BookLgProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Apply border directly around the Image with explicit width/height */}
      <div className="p-1 bg-cyan-400 shadow-[0_0_10px_0_rgba(0,255,255,0.7)]">
        <img
          src={imageUrl}
          alt={altText ?? `${title} book cover`}
          width={100}
          height={150}
          className="object-cover"
          style={{ width: "100px", height: "150px" }}
        />
      </div>
      <span className="text-base text-white/95 text-center cursor-pointer hover:underline line-clamp-2">
        {title}
      </span>
    </div>
  );
}

export function BookXl({ imageUrl, title, altText }: BookLgProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <img
        src={imageUrl}
        alt={altText ?? `${title} book cover`}
        width={150}
        height={240}
        className="object-cover shadow-md"
        style={{ width: "150px", height: "240px" }}
      />
      <span className="text-xl font-['Nanum_Gothic'] text-white/95">
        {title}
      </span>
    </div>
  );
}
