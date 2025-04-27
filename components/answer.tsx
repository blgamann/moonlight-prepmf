import React from "react";
import { BookMdQuestion } from "./book";

interface AnswerSimpleProps {
  answer: {
    title: string;
    answer_text: string;
  };
  formattedDate: string;
}

interface AnswerProps {
  answer: {
    title: string;
    answer_text: string;
  };
  book: {
    imageUrl: string;
    title: string;
    altText?: string;
  };
  questionText: string;
  formattedDate: string;
}

function AnswerTitle({ title }: { title: string }) {
  return <h2 className="text-5xl font-semibold text-white/95">{title}</h2>;
}

function AnswerText({ text }: { text: string }) {
  return (
    <p className="text-lg text-white/95 mb-4 leading-relaxed whitespace-pre-line">
      {text}
    </p>
  );
}

// New component for the footer
function AnswerDate({ formattedDate }: { formattedDate: string }) {
  return (
    <div className="flex justify-end items-center">
      <p className="text-base text-white/60">{formattedDate}</p>
    </div>
  );
}

export function AnswerSimple({ answer, formattedDate }: AnswerSimpleProps) {
  return (
    <>
      <AnswerTitle title={answer.title} />
      <AnswerText text={answer.answer_text} />
      <AnswerDate formattedDate={formattedDate} />
    </>
  );
}

export function Answer({
  answer,
  book,
  questionText,
  formattedDate,
}: AnswerProps) {
  return (
    <div className="flex flex-col gap-4">
      <AnswerTitle title={answer.title} />
      <div className="flex flex-col h-2" />
      <BookMdQuestion
        imageUrl={book.imageUrl}
        title={book.title}
        question={questionText}
        altText={book.altText}
      />
      <div className="flex flex-col h-2" />
      <AnswerText text={answer.answer_text} />
      <AnswerDate formattedDate={formattedDate} />
    </div>
  );
}
