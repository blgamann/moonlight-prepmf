"use client";

import { IndexTopBack } from "@/components/index-bar";
import { useParams } from "next/navigation"; // Removed useRouter
import data from "@/data.json"; // Import the data
import { ProfileLg } from "@/components/profile";
import { Answer } from "@/components/answer";
import { BookLg } from "@/components/book";
import { Section } from "@/components/section";
import { Soulline } from "@/components/soulline";

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString.replace(/\./g, "-").replace(" ", "")); // Adjust format if needed
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}. ${month}. ${day}.`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string on error
  }
};

export default function AnswerDetail() {
  // Removed router variable
  const params = useParams();
  const answerId = (params?.answerId as string) || "a-veg-1"; // Get answerId from params, fallback to default

  // Find the answer, question, book, and profile data
  const answer = data.book_answers.find((ans) => ans.id === answerId);
  const question = data.book_questions.find(
    (q) => q.id === answer?.question_id
  );
  const book = data.books.find((b) => b.id === question?.book_id);
  const profile = data.profiles.find((p) => p.id === answer?.profile_id);

  if (!answer || !question || !book || !profile) {
    // Handle case where data is not found
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  // Placeholder values for pagination - adjust as needed
  const totalPages = 10; // Example value
  const currentPage = 1; // Example value

  return (
    <div>
      <IndexTopBack
        title={answer.title} // Use answer title
        book={{
          title: book.title,
          imageUrl: book.imageUrl,
        }}
        totalPages={totalPages}
        currentPage={currentPage}
        className="sticky top-0 z-10 bg-zinc-950"
      />
      <div className="flex flex-col max-w-[680px] mx-auto">
        <div className="flex flex-col h-24" />
        <ProfileLg
          imageUrl={profile.imageUrl}
          name={profile.name}
          bio={profile.bio}
          altText={`${profile.name}'s profile picture`}
        />
        <div className="flex flex-col h-36" />
        <Answer
          answer={{
            title: answer.title,
            answer_text: answer.answer_text,
          }}
          book={{
            imageUrl: book.imageUrl,
            title: book.title,
            altText: `${book.title} cover`,
          }}
          questionText={question.question_text}
          formattedDate={formatDate(answer.date)}
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
    </div>
  );
}
