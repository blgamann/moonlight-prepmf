"use client"; // Add this at the top for useState

import { useState } from "react"; // Import useState
import UserInfoSection from "../discover/UserInfoSection";
import data from "@/data.json";
import AnswerCardWithBook from "@/components/AnswerCardWithBook"; // Import the component
import Image from "next/image"; // Import Image

// Define types for better type safety
interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  tags: string[];
}

// Define types for better type safety
// interface BookQuestion {
//   id: string;
//   book_id: string;
//   question_text: string;
//   question_context: string;
// }

interface BookAnswer {
  id: string;
  question_id: string;
  title: string;
  answer_text: string;
  date: string;
  profile_id: string;
}

// interface Profile {
//   id: string;
//   name: string;
//   imageUrl: string;
//   bio: string;
//   // Assuming profiles might eventually hold answers directly or other relevant fields
// }

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("answer");

  // Find the specific user profile (e.g., profile-1)
  const user = data.profiles.find((profile) => profile.id === "profile-1");

  // Filter answers for the current user
  const userAnswers = data.book_answers.filter(
    (answer) => answer.profile_id === user?.id
  );

  // Function to get book details for an answer
  const getBookForAnswer = (answer: BookAnswer): Book | undefined => {
    const question = data.book_questions.find(
      (q) => q.id === answer.question_id
    );
    if (!question) return undefined;
    return data.books.find((book) => book.id === question.book_id);
  };

  // Get unique book IDs answered by the user
  const userAnsweredBookIds = [
    ...new Set(
      userAnswers.map((answer) => {
        const question = data.book_questions.find(
          (q) => q.id === answer.question_id
        );
        return question?.book_id;
      })
    ),
  ].filter((id): id is string => !!id); // Filter out undefined and ensure type is string[]

  // Get the actual book objects, limited to the first 3
  const readBooks = data.books
    .filter((book) => userAnsweredBookIds.includes(book.id))
    .slice(0, 3);

  // Handle case where user is not found (optional but good practice)
  if (!user) {
    return <div>User profile not found.</div>;
  }

  return (
    <div className="min-h-screen border-t-6 border-[#38d4e7]">
      <div className="max-w-[680px] mx-auto py-24">
        {" "}
        {/* Added text-white */}
        <UserInfoSection user={user} />
        {/* Tab Navigation */}
        {/* Conditional Rendering: List or Detail (Answers) View */}
        <div className="max-w-[680px] mx-auto p-6 mt-12">
          {/* Tabs (Updated Theme) */}
          {/* Use themed border */}
          <div className="flex border-b border-white/10">
            <button
              className={`py-2 px-4 text-base font-medium transition-colors ${
                activeTab === "answer"
                  ? // Use white for active tab
                    "border-b-2 border-white text-white/90"
                  : // Use themed text color for inactive tab
                    "text-[#999] hover:text-white/90"
              }`}
              onClick={() => setActiveTab("answer")}
            >
              답변
            </button>
            <button
              className={`py-2 px-4 text-base font-medium transition-colors ${
                activeTab === "books"
                  ? // Use white for active tab
                    "border-b-2 border-white text-white/90"
                  : // Use themed text color for inactive tab
                    "text-[#999] hover:text-white/90"
              }`}
              onClick={() => setActiveTab("books")}
            >
              읽은 책
            </button>
          </div>
          {/* Tab Content */}
          <div>
            {activeTab === "answer" && (
              <div>
                {userAnswers.map((answer) => {
                  const book = getBookForAnswer(answer);
                  return book ? (
                    <AnswerCardWithBook
                      key={answer.id} // Assuming each answer has a unique id
                      bookCoverUrl={book.imageUrl} // Pass the book's image URL
                      title={answer.title} // Pass the answer title
                      answerText={answer.answer_text} // Pass the answer text
                    />
                  ) : null; // Handle case where book is not found for an answer
                })}
              </div>
            )}
            {/* Placeholder for Books Tab Content */}
            {activeTab === "books" && (
              <div className="py-8">
                {/* Replicate MutualBooks structure and styling */}
                <div className="flex justify-start gap-8">
                  {readBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative w-[100px] h-[150px] rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <Image
                          src={book.imageUrl} // Use book's image URL
                          alt={book.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
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
                      {/* Optional: Book Title */}
                      {/* <span className="text-sm text-white/80 mt-1 text-center">{book.title}</span> */}
                    </div>
                  ))}
                </div>
                {/* Add message if no books are read/answered */}
                {readBooks.length === 0 && (
                  <p className="text-white/65">아직 읽고 답한 책이 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
