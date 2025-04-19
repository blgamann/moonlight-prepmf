import Image from "next/image";

// Define data shapes for props
interface Answer {
  title: string;
  answer_text: string;
  // other answer fields if needed...
}

interface Question {
  question_text: string;
  // other question fields if needed...
}

interface Book {
  title: string;
  author: string;
  imageUrl: string;
}

// Define component props interface
interface AnswerSectionProps {
  answer: Answer;
  question: Question;
  book: Book;
}

// Define the AnswerSection component
export default function AnswerSection({
  answer,
  question,
  book,
}: AnswerSectionProps) {
  return (
    <section className="mt-10">
      {/* Answer Title */}
      <h2 className="text-2xl font-semibold text-white mb-6">{answer.title}</h2>

      {/* Main Answer Text */}
      <p className="text-xl text-gray-200 mb-8 leading-relaxed">
        {answer.answer_text}
      </p>

      {/* Context Area (Book & Question) - Text Left, Image Right */}
      <div className="flex items-start space-x-6 border-t border-gray-700 pt-6">
        {/* Left: Context Text (Question only) */}
        <div className="flex flex-col flex-grow pt-1">
          {/* Related Question */}
          <blockquote className="border-l-4 border-gray-600 pl-3">
            <p className="text-base italic text-gray-300">
              {question.question_text}
            </p>
          </blockquote>
        </div>

        {/* Right: Book Cover and Info */}
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
      </div>
    </section>
  );
}
