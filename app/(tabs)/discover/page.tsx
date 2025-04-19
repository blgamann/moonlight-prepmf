"use client"; // Add this directive for useState

import { useState } from "react"; // Import useState
import UserInfoSection from "./UserInfoSection"; // Import the new component
import AnswerSection from "./AnswerSection"; // Import the new component
import UserRelationSection from "./UserRelationSection"; // Import the new combined section component

// --- Define Interfaces for Data Structures ---
interface UserProfile {
  profile_id: string;
  name: string;
  imageUrl: string;
  bio?: string; // Optional bio for target user data
}

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface Question {
  id: string;
  question_text: string;
}

interface Answer {
  id: string;
  title: string;
  answer_text: string;
}

interface MagazineArticle {
  book: Book;
  question: Question;
  answer: Answer;
}

interface UserMagazine {
  userData: UserProfile;
  booksReadCount: number;
  magazineData: MagazineArticle[];
}

interface ConnectionInfo {
  degree: number;
  path: UserProfile[];
}

// Type for the connectionPaths object
interface ConnectionPathsData {
  [viewingUserId: string]: {
    [targetUserId: string]: ConnectionInfo;
  };
}

// Interface for detailed common book info
interface CommonBookDetail {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

// Interface for Common Books Data (updated)
interface CommonBooksInfo {
  // count: number; // count can be derived from books.length
  books: CommonBookDetail[]; // Array of detailed book objects
}

// Type for the commonBooksData object (updated)
interface CommonBooksData {
  [viewingUserId: string]: {
    [targetUserId: string]: CommonBooksInfo;
  };
}

// ---------------------------------------------

// --- Data Setup for Multiple Users ---
const allUserMagazines: UserMagazine[] = [
  // User 1 Data
  {
    userData: {
      profile_id: "profile-1",
      name: "김민준",
      imageUrl: "/profiles/profile1.png",
      bio: "기술을 통해 사람들의 삶을 더 풍요롭게 만들고 싶습니다. 의미있는 연결을 통해 함께 성장하고 싶어요.",
    },
    booksReadCount: 2,
    magazineData: [
      {
        book: {
          id: "book-vegetarian",
          title: "채식주의자",
          author: "한강",
          imageUrl: "/books/book1.jpg",
        },
        question: {
          id: "q-veg-1",
          question_text:
            "영혜처럼 사회의 '정상성'에 의문을 품고 자신만의 길을 가고 싶었던 적이 있나요? 어떤 경험이었나요?",
        },
        answer: {
          id: "a-veg-1",
          title: "나만의 길, 작은 용기",
          answer_text:
            "대학교 때, 모두가 취업 준비에 몰두할 때 혼자서 인문학 스터디를 계속했던 기억이 나요. 당장은 불확실해 보였지만, 그때의 고민과 독서가 지금의 저를 만든 자양분이 되었다고 생각해요. 영혜처럼 거창하진 않아도, 남들이 '정상'이라고 생각하는 길에서 잠시 벗어나 자신만의 가치를 따랐던 작은 용기였죠.",
        },
      },
      {
        book: {
          id: "book-seonghak",
          title: "성학십도",
          author: "퇴계 이황",
          imageUrl: "/books/book2.jpg",
        },
        question: {
          id: "q-sh-1",
          question_text:
            "퇴계 이황이 제시한 성리학적 수양 방법 중 현대 사회에서도 여전히 유효하다고 생각하는 부분이 있나요? 혹은 자신만의 마음 다스리는 방법이 있다면 소개해주세요.",
        },
        answer: {
          id: "a-sh-1",
          title: "현대 사회의 '경(敬)' 실천",
          answer_text:
            "퇴계 이황 선생님의 '경(敬)' 사상은 지금도 중요하다고 생각해요. 늘 깨어있는 마음으로 자신을 성찰하고 순간에 집중하는 태도는 복잡한 현대 사회에서 마음의 중심을 잡는 데 큰 도움이 됩니다. 저는 매일 아침 10분 정도 명상을 하면서 하루를 시작하는데, 이게 저만의 '경'을 실천하는 방식인 것 같아요.",
        },
      },
    ],
  },
  // User 2 Data
  {
    userData: {
      profile_id: "profile-2",
      name: "이수현",
      imageUrl: "/profiles/profile2.png",
      bio: "다양한 관점을 탐구하고 이해하는 것을 즐깁니다. 책과 사람을 통해 세상을 배워가고 있어요.",
    },
    booksReadCount: 5,
    magazineData: [
      {
        book: {
          id: "book-homo-deus",
          title: "호모 데우스: 미래의 역사",
          author: "유발 하라리",
          imageUrl: "/books/book3.jpg",
        },
        question: {
          id: "q-hd-1",
          question_text:
            "유발 하라리가 예측하는 '호모 데우스'의 미래, 즉 인류가 기술을 통해 신적인 능력을 추구하는 것에 대해 어떻게 생각하시나요? 기대되는 점과 우려되는 점은 무엇인가요?",
        },
        answer: {
          id: "a-hd-1",
          title: "기술 발전의 빛과 그림자",
          answer_text:
            "기술로 질병과 노화를 극복하는 미래는 기대되지만, 그 혜택이 소수에게만 집중될까 봐 우려됩니다. 유전자를 편집해서 '맞춤 아기'를 만드는 세상이 온다면, 인간의 존엄성이나 다양성은 어떻게 될까요? 기술 발전의 방향에 대한 사회적 합의와 윤리적 고민이 반드시 필요하다고 생각합니다.",
        },
      },
      {
        book: {
          id: "book-vegetarian",
          title: "채식주의자",
          author: "한강",
          imageUrl: "/books/book1.jpg",
        },
        question: {
          id: "q-veg-2",
          question_text:
            "책에서 묘사된 인간의 폭력성에 대해 어떻게 생각하시나요? 일상 속에서 폭력성의 다른 형태를 목격하거나 경험한 적이 있다면 이야기해주세요.",
        },
        answer: {
          id: "a-veg-2",
          title: "가장 무서운 폭력, 무관심",
          answer_text:
            "가장 무서운 폭력은 무관심이라고 생각해요. 영혜의 가족들이 보인 반응처럼요. 직접적인 폭력만큼이나, 혹은 그보다 더 깊은 상처를 줄 수 있죠. 직장에서 동료가 부당한 일을 겪는 것을 알면서도 침묵했던 제 모습이 떠올라 부끄러웠습니다. 이후로는 작게나마 목소리를 내려고 노력하고 있어요.",
        },
      },
    ],
  },
];
// -------------------------------

// --- Mock Viewing User and Connection Data ---
// Assume the current viewing user is 정현우
const viewingUserProfile: UserProfile = {
  profile_id: "profile-5", // Use ID from data.json
  name: "정현우",
  imageUrl: "/profiles/profile5.png", // Use correct image path from data.json
};

// Apply the defined type to connectionPaths
const connectionPaths: ConnectionPathsData = {
  [viewingUserProfile.profile_id]: {
    "profile-1": {
      degree: 2,
      path: [
        {
          profile_id: "profile-intermediate-1",
          name: "박지훈",
          imageUrl: "/profiles/profile3.png",
        },
      ],
    },
    "profile-2": {
      degree: 3,
      path: [
        {
          profile_id: "profile-intermediate-1",
          name: "박지훈",
          imageUrl: "/profiles/profile3.png",
        },
        {
          profile_id: "profile-intermediate-2",
          name: "최유나",
          imageUrl: "/profiles/profile4.png",
        },
      ],
    },
  },
};

// --- Mock Common Books Data (Updated with full book details) ---
const commonBooksData: CommonBooksData = {
  [viewingUserProfile.profile_id]: {
    "profile-1": {
      // 정현우 - 김민준
      books: [
        {
          id: "book-vegetarian",
          title: "채식주의자",
          author: "한강",
          imageUrl: "/books/book1.jpg",
        },
        {
          id: "book-seonghak",
          title: "성학십도",
          author: "퇴계 이황",
          imageUrl: "/books/book2.jpg",
        },
      ],
    },
    "profile-2": {
      // 정현우 - 이수현 (Changed Sapiens to Vegetarian)
      books: [
        {
          id: "book-homo-deus",
          title: "호모 데우스: 미래의 역사",
          author: "유발 하라리",
          imageUrl: "/books/book3.jpg",
        },
        {
          id: "book-vegetarian",
          title: "채식주의자",
          author: "한강",
          imageUrl: "/books/book1.jpg",
        },
      ],
    },
  },
};
// -------------------------------------------

export default function DiscoverPage() {
  // State for current user index
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  // State for current article index within the current user's magazine
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  const totalUsers = allUserMagazines.length;
  const currentUserMagazine = allUserMagazines[currentUserIndex];
  const totalArticles = currentUserMagazine.magazineData.length;

  // Get current article data for the selected user
  const currentArticle = currentUserMagazine.magazineData[currentArticleIndex];
  const currentUserData = currentUserMagazine.userData;
  const currentBooksReadCount = currentUserMagazine.booksReadCount;

  // Get connection info for the currently displayed user
  const connectionInfo =
    connectionPaths[viewingUserProfile.profile_id]?.[
      currentUserData.profile_id
    ];

  // Get common books info for the currently displayed user
  const commonBooksInfo =
    commonBooksData[viewingUserProfile.profile_id]?.[
      currentUserData.profile_id
    ];

  // --- Navigation Handlers ---

  // Article Navigation
  const handlePreviousArticle = () => {
    setCurrentArticleIndex((prevIndex) =>
      prevIndex === 0 ? totalArticles - 1 : prevIndex - 1
    );
  };

  const handleNextArticle = () => {
    setCurrentArticleIndex((prevIndex) =>
      prevIndex === totalArticles - 1 ? 0 : prevIndex + 1
    );
  };

  // User Navigation
  const handlePreviousUser = () => {
    setCurrentUserIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? totalUsers - 1 : prevIndex - 1;
      setCurrentArticleIndex(0); // Reset article index when user changes
      return newIndex;
    });
  };

  const handleNextUser = () => {
    setCurrentUserIndex((prevIndex) => {
      const newIndex = prevIndex === totalUsers - 1 ? 0 : prevIndex + 1;
      setCurrentArticleIndex(0); // Reset article index when user changes
      return newIndex;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col pt-12 relative">
      {/* Main Content Area */}
      <div className="max-w-[680px] mx-auto w-full flex-grow">
        {/* Pass current user's data */}
        <UserInfoSection
          user={currentUserData}
          booksReadCount={currentBooksReadCount}
        />

        {/* Use the AnswerSection component with current user's article data */}
        <AnswerSection
          answer={currentArticle.answer}
          question={currentArticle.question}
          book={currentArticle.book}
        />

        {/* Article Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousArticle}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm disabled:opacity-50"
            disabled={totalArticles <= 1} // Disable if only one article
          >
            이전 글
          </button>
          <span className="text-sm text-gray-400">
            {totalArticles > 0 ? currentArticleIndex + 1 : 0} / {totalArticles}
          </span>
          <button
            onClick={handleNextArticle}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm disabled:opacity-50"
            disabled={totalArticles <= 1} // Disable if only one article
          >
            다음 글
          </button>
        </div>

        {/* Render Combined User Relation Section if either connection or common books info exists */}
        {(connectionInfo ||
          (commonBooksInfo && commonBooksInfo.books?.length > 0)) && (
          <UserRelationSection
            viewingUser={viewingUserProfile}
            targetUser={currentUserData}
            connectionInfo={connectionInfo} // Pass connection info (might be undefined)
            commonBooksInfo={commonBooksInfo} // Pass common books info (might be undefined or have empty books)
          />
        )}
      </div>

      {/* Re-add Sticky Footer for User Navigation */}
      <div className="sticky bottom-0 left-0 right-0 pb-4 pt-2 bg-black bg-opacity-80 backdrop-blur-sm z-40">
        <div className="max-w-[680px] mx-auto flex justify-between items-center px-4">
          <button
            onClick={handlePreviousUser}
            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm"
          >
            다른 사용자 (이전)
          </button>
          <span className="text-xs text-gray-400">
            사용자 {currentUserIndex + 1} / {totalUsers}
          </span>
          <button
            onClick={handleNextUser}
            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm"
          >
            다른 사용자 (다음)
          </button>
        </div>
      </div>
    </div>
  );
}
