"use client";

import Image from "next/image";

// Define data shapes for props
interface Book {
  title: string;
  author: string;
  imageUrl: string;
}

// Define component props interface
interface BookInfoProps {
  book: Book;
}

// Define the BookInfo component
export default function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      <Image
        src={book.imageUrl}
        alt={`${book.title} cover`}
        width={64} // Reduced size
        height={96} // Reduced size
        className="rounded shadow-md"
      />
      {/* Book Info */}
      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-gray-300">{book.title}</p>
        <p className="text-xs text-gray-500">{book.author}</p>
      </div>
    </div>
  );
}
