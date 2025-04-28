import React from "react";
import Link from "next/link";
import Image from "next/image";

// General-purpose book cover component
type BookCoverProps = {
  imageUrl: string;
  altText: string;
  width: number;
  height: number;
  className?: string;
};

const BookCover: React.FC<BookCoverProps> = ({
  imageUrl,
  altText,
  width,
  height,
  className = "",
}) => (
  <Image
    src={imageUrl}
    alt={altText}
    width={width}
    height={height}
    className={`object-cover ${className}`}
    priority
  />
);

// Small book component
export interface BookSmProps {
  title: string;
  imageUrl: string;
  altText?: string;
}

export const BookSm: React.FC<BookSmProps> = ({ title, imageUrl, altText }) => (
  <div>
    <BookCover
      imageUrl={imageUrl}
      altText={altText ?? `${title} book cover`}
      width={30}
      height={45}
      className="shadow-md"
    />
  </div>
);

// Medium book component with question
export interface BookMdQuestionProps {
  imageUrl: string;
  title: string;
  question: string;
  altText?: string;
}

export const BookMdQuestion: React.FC<BookMdQuestionProps> = ({
  imageUrl,
  title,
  question,
  altText,
}) => {
  const bookSlug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center space-x-4 border-b border-t border-white/15 py-6">
      <div className="flex-shrink-0">
        <BookCover
          imageUrl={imageUrl}
          altText={altText ?? `${title} cover`}
          width={55}
          height={90}
        />
      </div>
      <div className="flex flex-col flex-grow min-w-0">
        <Link
          href={`/book/${bookSlug}`}
          className="text-base text-white/60 hover:underline mb-1"
        >
          {title}
        </Link>
        <p className="text-lg mt-1 text-white/95 line-clamp-2">{question}</p>
      </div>
    </div>
  );
};

// Medium book component with answer
export interface BookMdAnswerProps {
  imageUrl: string;
  answerTitle: string;
  answerText: string;
  altText?: string;
}

export const BookMdAnswer: React.FC<BookMdAnswerProps> = ({
  imageUrl,
  answerTitle,
  answerText,
  altText,
}) => (
  <div className="flex space-x-4 items-center">
    <div className="flex-shrink-0">
      <BookCover
        imageUrl={imageUrl}
        altText={altText ?? `${answerTitle} cover`}
        width={55}
        height={90}
      />
    </div>
    <div className="flex flex-col flex-1 overflow-hidden mt-1">
      <Link
        href="/profile/answer/detail"
        className="text-xl font-semibold text-white/95 hover:underline"
      >
        {answerTitle}
      </Link>
      <p className="text-base text-white/60 mt-1.5 line-clamp-2">
        {answerText}
      </p>
    </div>
  </div>
);

// Medium book component with metadata
export interface BookMdMetaProps {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string; // expects YYYYMMDD
  altText?: string;
  link: string;
}

const formatDate = (dateStr: string): string =>
  dateStr.length === 8
    ? `${dateStr.slice(0, 4)}. ${dateStr.slice(4, 6)}. ${dateStr.slice(6, 8)}.`
    : dateStr;

export const BookMdMeta: React.FC<BookMdMetaProps> = ({
  imageUrl,
  title,
  author,
  publisher,
  publicationDate,
  altText,
  link,
}) => {
  const formattedDate = formatDate(publicationDate);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <BookCover
          imageUrl={imageUrl}
          altText={altText ?? `Cover of ${title}`}
          width={55}
          height={90}
        />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <Link
          href={link ?? "#"}
          className="text-lg font-semibold text-white/95 hover:underline mb-1"
        >
          {title}
        </Link>
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
};

// Large book component without title
export interface BookLgProps {
  imageUrl: string;
  title: string;
  altText?: string;
}

export const BookLg: React.FC<BookLgProps> = ({ imageUrl, title, altText }) => (
  <div className="flex flex-col items-center space-y-2">
    <BookCover
      imageUrl={imageUrl}
      altText={altText ?? `${title} book cover`}
      width={100}
      height={150}
      className="shadow-md"
    />
  </div>
);

// Large book component with border and title
export const BookLgBordered: React.FC<BookLgProps> = ({
  imageUrl,
  title,
  altText,
}) => (
  <div className="flex flex-col items-center space-y-2">
    <div className="p-1 bg-cyan-400 shadow-[0_0_10px_0_rgba(0,255,255,0.7)]">
      <BookCover
        imageUrl={imageUrl}
        altText={altText ?? `${title} book cover`}
        width={100}
        height={150}
      />
    </div>
    <span className="text-base text-white/95 text-center cursor-pointer hover:underline line-clamp-2">
      {title}
    </span>
  </div>
);

// Extra-large book component with title
export const BookXl: React.FC<BookLgProps> = ({ imageUrl, title, altText }) => (
  <div className="flex flex-col items-center space-y-4">
    <BookCover
      imageUrl={imageUrl}
      altText={altText ?? `${title} book cover`}
      width={150}
      height={240}
      className="shadow-md"
    />
    <span className="text-xl font-['NanumMyeongjo'] text-white/95">
      {title}
    </span>
  </div>
);
