"use client";

import {
  BookSm,
  BookMdQuestion,
  BookMdMeta,
  BookLg,
  BookLgBordered,
  BookXl,
  BookMdAnswer,
} from "@/components/book";
import data from "../../../data.json";

export default function BookTestPage() {
  const { books, book_questions, book_answers } = data;

  // Sample data extraction (add checks if data might be missing)
  const book1 = books.find((b) => b.id === "book-vegetarian"); // 채식주의자
  const book2 = books.find((b) => b.id === "book-seonghak"); // 성학십도
  const book3 = books.find((b) => b.id === "book-homo-deus"); // 호모 데우스

  const question1 = book_questions.find((q) => q.id === "q-veg-1"); // 채식주의자 질문
  const question2 = book_questions.find((q) => q.id === "q-hd-1"); // 호모 데우스 질문 (상대적으로 김)
  const question3 = book_questions.find((q) => q.id === "q-sh-1"); // 성학십도 질문
  const answer1 = book_answers.find((a) => a.id === "a-sh-1"); // 성학십도 답변 (book2)
  const answer2 = book_answers.find((a) => a.id === "a-veg-1"); // 채식주의자 답변 (book1)
  const answer3 = book_answers.find((a) => a.id === "a-hd-1"); // 호모 데우스 답변 (book3)

  // Basic check for essential data
  if (
    !book1 ||
    !book2 ||
    !book3 ||
    !question1 ||
    !question2 ||
    !question3 ||
    !answer1 ||
    !answer2 ||
    !answer3
  ) {
    return <div>Error loading book data.</div>;
  }

  return (
    <div className="container p-8 space-y-12 bg-zinc-950 text-gray-100 min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">Book Components</h1>

      {/* BookSm Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookSm</h2>
        <div className="flex space-x-4 p-4 rounded">
          <BookSm
            imageUrl={book1.imageUrl}
            title={book1.title}
            altText={`${book1.title} cover`}
          />
          <BookSm
            imageUrl={book2.imageUrl}
            title={book2.title}
            altText={`${book2.title} cover`}
          />
          <BookSm
            imageUrl={book3.imageUrl}
            title={book3.title}
            altText={`${book3.title} cover`}
          />
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookMdAnswer Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookMdAnswer</h2>
        <div className="space-y-6 p-4 rounded">
          <BookMdAnswer
            imageUrl={book1.imageUrl}
            answerTitle={answer2.title}
            altText={`${answer2.title} cover`}
            answerText={answer2.answer_text}
          />
          <BookMdAnswer
            imageUrl={book2.imageUrl}
            answerTitle={answer1.title}
            altText={`${answer1.title} cover`}
            answerText={answer1.answer_text}
          />
          <BookMdAnswer
            imageUrl={book3.imageUrl}
            answerTitle={answer3.title}
            altText={`${answer3.title} cover`}
            answerText={answer3.answer_text}
          />
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookMdQuestion Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookMdQuestion</h2>
        <div className="space-y-6">
          <div className="p-4 rounded">
            <BookMdQuestion
              imageUrl={book1.imageUrl}
              title={book1.title}
              question={question1.question_text}
              altText={`${book1.title} cover with question`}
            />
          </div>
          <div className="p-4 rounded">
            <BookMdQuestion
              imageUrl={book2.imageUrl}
              title={book2.title}
              question={question3.question_text}
              altText={`${book2.title} cover with question`}
            />
          </div>
          <div className="p-4 rounded">
            {/* Example with potentially longer question */}
            <BookMdQuestion
              imageUrl={book3.imageUrl}
              title={book3.title}
              question={question2.question_context} // Using longer context for testing
              altText={`${book3.title} cover with longer question`}
            />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookMdMeta Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookMdMeta</h2>
        <div className="space-y-4">
          <BookMdMeta
            imageUrl={book1.imageUrl}
            title={book1.title}
            author={book1.author}
            publisher="창비" // Placeholder - Add to data.json ideally
            publicationDate="2007. 10. 30." // Placeholder
            altText={`${book1.title} metadata`}
          />
          <BookMdMeta
            imageUrl={book2.imageUrl}
            title={book2.title}
            author={book2.author}
            publisher="휴머니스트" // Placeholder
            publicationDate="2001. 09. 20." // Placeholder
            altText={`${book2.title} metadata`}
          />
          <BookMdMeta
            imageUrl={book3.imageUrl}
            title={book3.title} // Homo Deus has a longer title
            author={book3.author}
            publisher="김영사" // Placeholder
            publicationDate="2017. 05. 19." // Placeholder
            altText={`${book3.title} metadata`}
          />
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookLg Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookLg</h2>
        {/* Grid layout already handles multiple items well */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4 rounded">
          <div className="flex justify-center">
            <BookLg
              imageUrl={book1.imageUrl}
              title={book1.title}
              altText={`${book1.title} summary`}
            />
          </div>
          <div className="flex justify-center">
            <BookLg
              imageUrl={book2.imageUrl}
              title={book2.title}
              altText={`${book2.title} summary`}
            />
          </div>
          <div className="flex justify-center">
            {/* Example with longer title */}
            <BookLg
              imageUrl={book3.imageUrl}
              title={book3.title}
              altText={`${book3.title} summary`}
            />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookLgBordered Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookLgBordered</h2>
        {/* Grid layout already handles multiple items well */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4 rounded">
          <div className="flex justify-center">
            <BookLgBordered
              imageUrl={book1.imageUrl}
              title={book1.title}
              altText={`${book1.title} summary bordered`}
            />
          </div>
          <div className="flex justify-center">
            <BookLgBordered
              imageUrl={book2.imageUrl}
              title={book2.title}
              altText={`${book2.title} summary bordered`}
            />
          </div>
          <div className="flex justify-center">
            <BookLgBordered
              imageUrl={book3.imageUrl}
              title={book3.title}
              altText={`${book3.title} summary bordered`}
            />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* BookXl Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BookXl</h2>
        <div className="flex space-x-8 p-4 rounded">
          <div className="flex justify-center">
            <BookXl
              imageUrl={book1.imageUrl}
              title={book1.title}
              altText={`${book1.title} cover large`}
            />
          </div>
          <div className="flex justify-center">
            <BookXl
              imageUrl={book2.imageUrl}
              title={book2.title}
              altText={`${book2.title} cover large`}
            />
          </div>
          <div className="flex justify-center">
            <BookXl
              imageUrl={book3.imageUrl}
              title={book3.title}
              altText={`${book3.title} cover large`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
