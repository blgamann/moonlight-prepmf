"use client";

import Image from "next/image";
import data from "../../../../../data.json"; // Import data
import AnswerSection from "../../../discover/AnswerSection"; // Import AnswerSection
import MinimalUserInfoSection from "../../../discover/MinimalUserInfoSection"; // Import UserInfoSection
import UserRelationSection from "../../../discover/UserRelationSection"; // Import UserRelationSection
import { useState } from "react"; // Import useState
import Link from "next/link"; // Add Link import

// --- Types (Ensure these match your actual data structure) ---

type Profile = {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string; // Optional bio added for UserInfoSection/UserRelationSection compatibility
};

type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

// Define the structure of an answer, including the profile
type Answer = {
  id: string;
  profile: Profile; // Use the Profile type here
  title: string;
  text: string;
  date: string;
};

// --- Helper Components & Functions ---

// Function to format date - REMOVED as it's unused
// const formatDate = (dateString: string) => {
//   if (!dateString) return "";
//   return dateString.replace(/-/g, ". ") + ".";
// };

// --- Placeholder Data (Adjust as needed) ---

// Cast the imported data to ensure type safety
const typedData = data as { books: Book[]; profiles: Profile[] };

const answers: Answer[] = [
  {
    id: "ans1",
    profile: typedData.profiles[1], // Assuming profiles[1] has id, name, imageUrl
    title: "나만의 길, 작은 용기",
    text: "대학교 때, 모두가 취업 준비에 몰두할 때 혼자서 인문학 스터디를 계속했던 기억이 나요. 당장은 불확실해 보였지만, 그때의 고민과 독서가 지금의 저를 만든 자양분이 되었다고 생각해요. 영혜처럼 거창하진 않아도, 남들이 '정상'이라고 생각하는 길에서 잠시 벗어나 자신만의 가치를 따랐던 작은 용기였죠.",
    date: "2023-10-26",
  },
  {
    id: "ans2",
    profile: typedData.profiles[2], // Assuming profiles[2] has id, name, imageUrl
    title: "소신을 지키는 용기",
    text: "저는 회사에서 모두가 'A'가 정답이라고 할 때, 'B'의 가능성을 계속 주장했던 적이 있어요. 처음에는 이상하게 보거나 반대하는 사람들도 있었지만, 결국 B안이 더 좋은 결과를 가져왔을 때 큰 보람을 느꼈습니다. 다수의 의견과 다르더라도 소신을 지키는 것이 중요하다고 생각하게 된 계기였어요.",
    date: "2023-10-25",
  },
  {
    id: "ans3",
    profile: typedData.profiles[3], // Assuming profiles[3] has id, name, imageUrl
    title: "비주류 예술가의 길",
    text: "예술 분야에서 비슷한 경험을 했어요. 남들이 상업적인 성공을 좇을 때, 저는 비주류 장르를 고집했거든요. 경제적으로는 어려웠지만, 제 작품 세계를 깊게 파고들 수 있었고 소수의 팬들과 진정한 교감을 나눌 수 있었습니다. 영혜처럼 사회의 '정상성'과는 다른 길이었지만, 저에게는 의미있는 여정이었습니다.",
    date: "2023-10-24",
  },
];

// Placeholder for the "viewing" user (logged-in user)
// Adapting profile[0] to UserProfile structure expected by UserRelationSection
const viewingUser = {
  profile_id: typedData.profiles[0]?.id || "viewer",
  name: typedData.profiles[0]?.name || "Viewer",
  imageUrl: typedData.profiles[0]?.imageUrl || "/default-avatar.png", // Provide a default
  bio: typedData.profiles[0]?.bio,
};

// --- Page Component ---

export default function VeganAnswerPage() {
  const book: Book = typedData.books[0];
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionText =
    "영혜처럼 사회의 '정상성'에 의문을 품고 자신만의 길을 가고 싶었던 적이 있나요? 어떤 경험이 었나요?";

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % answers.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + answers.length) % answers.length
    );
  };

  // Get the current answer based on the index
  const currentAnswer = answers[currentIndex];
  const currentUserProfile = currentAnswer.profile;

  // Adapt data for UserInfoSection
  const userInfoProps = {
    user: {
      name: currentUserProfile.name,
      imageUrl: currentUserProfile.imageUrl,
      bio: currentUserProfile.bio || "", // Use bio if available
    },
    booksReadCount: 0, // Placeholder count
  };

  // Adapt data for UserRelationSection
  const targetUserForRelation = {
    profile_id: currentUserProfile.id,
    name: currentUserProfile.name,
    imageUrl: currentUserProfile.imageUrl,
    bio: currentUserProfile.bio,
  };

  // --- Mock Data for UI Development ---
  const mockConnectionInfo = {
    degree: 2,
    path: [
      {
        profile_id: typedData.profiles[4]?.id || "mock_intermediate",
        name: typedData.profiles[4]?.name || "Mock User",
        imageUrl: typedData.profiles[4]?.imageUrl || "/default-avatar.png",
        bio: typedData.profiles[4]?.bio,
      },
    ],
  };

  const mockCommonBooksInfo = {
    books: [
      {
        id: typedData.books[1]?.id || "mock_book",
        title: typedData.books[1]?.title || "Mock Book Title",
        author: typedData.books[1]?.author || "Mock Author",
        imageUrl: typedData.books[1]?.imageUrl || "/default-book.png",
      },
    ],
  };
  // -------------------------------------

  // Adapt data for AnswerSection
  const answerSectionProps = {
    answer: {
      title: currentAnswer.title || "",
      answer_text: currentAnswer.text,
    },
  };

  return (
    // Add relative positioning for sticky footer context
    <div className="w-full min-h-screen bg-black text-white px-4 py-6 pt-16 space-y-6 relative">
      {" "}
      {/* Add padding-bottom to prevent overlap */}
      {/* Header Section: Question + Book Info */}
      <div className="max-w-[680px] mx-auto border-b border-gray-700 pb-6">
        {/* Add Back Button/Link */}
        <div className="mb-6">
          <Link
            href="/garden/vegan"
            className="text-sm text-gray-400 hover:text-white"
          >
            &larr; 질문 목록으로 돌아가기
          </Link>
        </div>
        <div className="w-full flex justify-between items-stretch gap-4">
          {/* Left: Question Text & Button */}
          <div className="flex-1 pr-4 flex flex-col items-stretch">
            <h2 className="text-2xl font-semibold text-white leading-snug mb-4">
              {questionText}
            </h2>
            <Link
              href="/garden/vegan/write-answer?from=answers"
              passHref
              className="mt-auto"
            >
              <button className="text-base text-blue-400 hover:underline focus:outline-none hover:cursor-pointer">
                답변하기
              </button>
            </Link>
          </div>

          {/* Right: Book Info (Small Cover + Title/Author) */}
          <div className="flex-shrink-0 w-[80px] text-center">
            <div className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-sm border border-gray-700">
              <Image
                src={book.imageUrl}
                alt={`${book.title} 책 표지`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-gray-300 truncate">
              {book.title}
            </p>
            <p className="text-xs text-gray-500 truncate">{book.author}</p>
          </div>
        </div>
      </div>
      {/* Dynamic Answer Section */}
      <div className="max-w-[680px] mx-auto mt-8">
        {/* User Info Section */}
        <div className="mb-[-18px]">
          <MinimalUserInfoSection {...userInfoProps} />
        </div>

        <div className="mb-12">
          {/* Answer Section */}
          <AnswerSection {...answerSectionProps} />
        </div>

        {/* User Relation Section (Optional based on data) */}
        <UserRelationSection
          viewingUser={viewingUser}
          targetUser={targetUserForRelation}
          connectionInfo={mockConnectionInfo} // Pass mock data
          commonBooksInfo={mockCommonBooksInfo} // Pass mock data
        />
      </div>
      {/* Sticky Footer for Answer Navigation */}
      <div className="sticky bottom-0 left-0 right-0 py-4 bg-black bg-opacity-80 backdrop-blur-sm z-40 border-t border-gray-700">
        <div className="max-w-[680px] mx-auto flex justify-between items-center px-4">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm disabled:opacity-50"
          >
            이전 답변
          </button>
          <span className="text-base text-gray-400">
            {currentIndex + 1} / {answers.length}
          </span>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm disabled:opacity-50"
          >
            다음 답변
          </button>
        </div>
      </div>
    </div>
  );
}
