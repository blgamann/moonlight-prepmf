"use client";

import React from "react";
// Import both components: AnswerSimple (default) and Answer (named)
import { AnswerSimple, Answer } from "@/components/answer";
import data from "../../../data.json";

const AnswerPage = () => {
  // Using the same answer IDs for demonstration
  const answerIdsToShow = [
    "a-sh-15",
    "a-sh-16",
    "a-sh-17",
    "a-sh-18",
    "a-sh-19",
  ];

  // Filter answers
  const answersToShow = data.book_answers.filter((answer) =>
    answerIdsToShow.includes(answer.id)
  );

  // Find corresponding books using question_id -> book_id link
  const answersWithBooksAndQuestions = answersToShow
    .map((answerData) => {
      // Find the question associated with the answer
      const question = data.book_questions.find(
        (q) => q.id === answerData.question_id
      );
      // Find the book associated with the question
      const book = question
        ? data.books.find((b) => b.id === question.book_id)
        : undefined;
      return {
        ...answerData,
        // Prepare book prop only if book is found
        book: book
          ? {
              imageUrl: book.imageUrl,
              title: book.title,
              altText: `${book.title} cover`,
            }
          : undefined,
        questionText: question ? question.question_text : "Question not found",
      };
    })
    .filter((item) => item.book !== undefined); // Filter out answers where book wasn't found

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}. ${month}. ${day}.`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-12 bg-zinc-950 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-12">Answer Components</h1>

      {/* Section for AnswerSimple */}
      <section>
        <h2 className="text-2xl font-semibold mb-24">AnswerSimple</h2>
        <div className="space-y-36 max-w-[680px] mx-auto">
          {answersToShow.length > 0 ? (
            answersToShow.map((answerData) => (
              <div key={`${answerData.id}-simple`}>
                <AnswerSimple
                  answer={{
                    title: answerData.title,
                    answer_text: answerData.answer_text,
                  }}
                  formattedDate={formatDate(answerData.date)}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-white/70 text-xl">
              Could not find specified answers for AnswerSimple.
            </p>
          )}
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* Section for the new Answer component */}
      <section>
        <h2 className="text-2xl font-semibold mb-24">
          Answer (with BookMdQuestion)
        </h2>
        <div className="space-y-36 max-w-[680px] mx-auto">
          {answersWithBooksAndQuestions.length > 0 ? (
            answersWithBooksAndQuestions.map(
              (answerData) =>
                answerData.book && (
                  <div key={`${answerData.id}-full`}>
                    <Answer
                      answer={{
                        title: answerData.title,
                        answer_text: answerData.answer_text,
                      }}
                      book={answerData.book}
                      questionText={answerData.questionText}
                      formattedDate={formatDate(answerData.date)}
                    />
                  </div>
                )
            )
          ) : (
            <p className="text-center text-white/70 text-xl">
              Could not find specified answers with associated book data for
              Answer.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnswerPage;
