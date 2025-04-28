"use client";

import { IndexBack } from "@/components/index-bar";
import { Heading } from "@/components/heading";
import { BadgeSoulinkCount, BadgeAnswerCount } from "@/components/badge";
import { ItemAnswerProfile } from "@/components/item";

import data from "@/data.json";

// Helper function to get profile by ID
const getProfileById = (profileId: string) => {
  return data.profiles.find((p) => p.id === profileId);
};

export default function AnswerListPage() {
  // const bookId = "book-vegetarian"; // Assuming we list answers for this book
  // TODO: Ideally, get the specific question ID from the route/params
  const questionId = "q-sh-1"; // Hardcoding the first question for now

  const relevantAnswers = data.book_answers.filter(
    (answer) => answer.question_id === questionId
  );

  const questionText =
    data.book_questions.find((q) => q.id === questionId)?.question_text || "";
  const answerCount = relevantAnswers.length;
  // TODO: Calculate actual soulink count based on resonances or other logic
  const soulinkCount = data.resonances.filter((r) =>
    relevantAnswers.some((a) => a.id === r.answer_id)
  ).length;

  return (
    <div className="flex flex-col pt-24 gap-8 max-w-[680px] mx-auto">
      <IndexBack back={"채식주의자"} />
      <Heading>{questionText}</Heading>
      <div className="flex gap-4 mt-4">
        <BadgeAnswerCount count={answerCount} />
        <BadgeSoulinkCount count={soulinkCount} />
      </div>
      <div className="flex flex-col border-t border-white/15 pt-8 gap-6 mb-16">
        {relevantAnswers.map((answer) => {
          const profile = getProfileById(answer.profile_id);
          if (!profile) return null; // Skip if profile not found

          return (
            <ItemAnswerProfile
              key={answer.id}
              imageUrl={profile.imageUrl}
              name={profile.name}
              altText={`${profile.name}'s profile picture`}
              answerTitle={answer.title}
              answerText={answer.answer_text}
              link={"/garden/vegan/answer-detail"}
            />
          );
        })}
      </div>
    </div>
  );
}
