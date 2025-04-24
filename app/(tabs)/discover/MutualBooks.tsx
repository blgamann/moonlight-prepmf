"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Book {
  title: string;
  imageUrl: string;
}

interface MutualBooksProps {
  books: Book[];
}

export default function MutualBooks({ books }: MutualBooksProps) {
  const router = useRouter();

  const handleBookClick = () => {
    router.push("/garden/vegan");
  };

  return (
    <div className="w-full max-w-[680px] mx-auto border-t border-white/30 py-8">
      <div className="flex items-center gap-1.5 mb-8">
        <h2 className="text-xl text-white/90 font-['NanumMyeongjo']">
          함께 읽은 책
        </h2>
        {/* Optional: Add an info icon like in SoulLine if needed */}
      </div>

      <div className="flex justify-start gap-8">
        {/* Map through books and display covers */}
        {books.map((book, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleBookClick}
          >
            <div className="relative w-[100px] h-[150px] rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
              {/* Placeholder Image - Replace with actual Image component and src */}
              <Image
                src={book.imageUrl} // Replace with actual image path
                alt={book.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                // Add placeholder style if needed
                // style={{ filter: 'blur(5px)' }}
              />
              {/* Reflection Effect */}
              <div
                className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/50 to-transparent"
                style={{ transform: "scaleY(-1)", bottom: "-25%" }}
              >
                <Image
                  src={book.imageUrl}
                  alt={`${book.title} reflection`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md opacity-30"
                />
              </div>
            </div>
            {/* Optional: Display book title below the cover */}
            {/* <span className="text-sm text-white/80 mt-1">{book.title}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
