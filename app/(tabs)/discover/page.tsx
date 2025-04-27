"use client";

import { ProfileLg } from "@/components/profile";
import { Answer } from "@/components/answer";
import { Soulline } from "@/components/soulline";

import data from "@/data.json";
import { Section } from "@/components/section";
import { BookLg } from "@/components/book";
import { IndexBottomButton, IndexTop } from "@/components/index-bar";

export default function DiscoverPage() {
  return (
    <div className="h-screen">
      <IndexTop
        profile={data.profiles[0]}
        className="sticky top-0 z-10 bg-zinc-950"
      />
      <div className="flex flex-col max-w-[680px] mx-auto">
        <div className="flex flex-col h-24" />

        <ProfileLg
          name={data.profiles[0].name}
          imageUrl={data.profiles[0].imageUrl}
          bio={data.profiles[0].bio}
        />

        <div className="flex flex-col h-36" />

        <Answer
          answer={data.book_answers[16]}
          book={data.books[0]}
          questionText={data.book_questions[0].question_text}
          formattedDate={data.book_answers[0].date}
        />

        <div className="flex flex-col h-36" />

        <Section title="소울라인">
          <Soulline profiles={data.profiles} />
        </Section>

        <div className="flex flex-col h-6" />

        <Section title="함께 읽은 책">
          <div className="flex flex-row gap-6">
            {data.books.map((book) => (
              <BookLg
                key={book.id}
                imageUrl={book.imageUrl}
                title={book.title}
              />
            ))}
          </div>
        </Section>

        <div className="flex flex-col h-12" />
      </div>
      <div className="sticky bottom-0 z-10 bg-zinc-950">
        <IndexBottomButton back={"이전 프로필"} forward={"다음 프로필"} />
      </div>
    </div>
  );
}
