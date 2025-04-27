"use client";

import React from "react";
import { Item, ItemAnswerProfile } from "@/components/item";
import { Button } from "@/components/button";
import { ItemAnswerBook } from "@/components/item";
import dataJson from "../../../data.json"; // Import the JSON data

// Define an interface for the profile data
interface Profile {
  id: string | number; // Assuming id can be string or number
  imageUrl: string;
  name: string;
  requestDate: string; // Assuming requestDate is a string, adjust if it's a Date object
}

// Define interface for AnswerBook data
interface AnswerBook {
  id: string | number;
  imageUrl: string;
  answerTitle: string;
  answerText: string;
  altText?: string;
}

// Define interface for AnswerProfile data
interface AnswerProfile {
  id: string | number;
  imageUrl: string;
  name: string;
  answerTitle: string;
  answerText: string;
  altText?: string;
}

// Define the props type for the component
// interface SoulLinkListProps {
//   data: Profile[];
// }

export default function SoulLinkList(/*{ data }: SoulLinkListProps*/) {
  // Extract profiles and books from JSON data
  const profiles = dataJson.profiles;
  const books = dataJson.books;

  // Create dummy data conforming to the Profile interface using JSON data
  const dummyData: Profile[] = [
    {
      id: 1,
      imageUrl: profiles[0]?.imageUrl || "/profiles/profile-fallback.png", // Use profile 1 image or fallback
      name: profiles[0]?.name || "김철수",
      requestDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    },
    {
      id: 2,
      imageUrl: profiles[1]?.imageUrl || "/profiles/profile-fallback.png", // Use profile 2 image or fallback
      name: profiles[1]?.name || "이영희",
      requestDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
      id: 3,
      imageUrl: profiles[2]?.imageUrl || "/profiles/profile-fallback.png", // Use profile 3 image or fallback
      name: profiles[2]?.name || "박민준",
      requestDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
  ];

  // Create dummy data for ItemAnswerBook using JSON data
  const dummyAnswerBookData: AnswerBook[] = [
    {
      id: 1,
      imageUrl: books[0]?.imageUrl || "/books/book-fallback.png", // Use book 1 image or fallback
      answerTitle: "나를 찾아 떠나는 여행",
      answerText:
        "인생의 의미를 탐구하는 깊이 있는 질문들에 대한 답변입니다. 이 책은 자아 성찰과 개인적 성장을 위한 여정을 안내합니다.",
      altText: books[0]?.title ? `${books[0].title} 표지` : "책 표지", // Use book title for alt text or default
    },
    {
      id: 2,
      imageUrl: books[1]?.imageUrl || "/books/book-fallback.png", // Use book 2 image or fallback
      answerTitle: "미래를 만드는 기술",
      answerText:
        "최신 기술 트렌드와 미래 사회 변화에 대한 예측을 담고 있습니다. 혁신적인 아이디어와 기술 발전의 중요성을 강조합니다.",
      altText: books[1]?.title ? `${books[1].title} 표지` : "책 표지", // Use book title for alt text or default
    },
    {
      id: 3,
      imageUrl: books[2]?.imageUrl || "/books/book-fallback.png", // Use book 3 image or fallback
      answerTitle: "호모 데우스: 미래의 역사",
      answerText:
        "인류가 기술을 통해 신적인 능력을 추구하는 것에 대한 유발 하라리의 예측입니다. 기대와 우려를 동시에 살펴봅니다.",
      altText: books[2]?.title ? `${books[2].title} 표지` : "책 표지", // Use book title for alt text or default
    },
  ];

  // Create dummy data for ItemAnswerProfile using JSON data
  const dummyAnswerProfileData: AnswerProfile[] = [
    {
      id: 1,
      imageUrl: profiles[3]?.imageUrl || "/profiles/profile-fallback.png", // Use profile 4 image or fallback
      name: profiles[3]?.name || "정다솜",
      answerTitle: "행복이란 무엇일까?",
      answerText:
        "일상 속 작은 순간들에서 발견하는 행복의 가치에 대해 이야기합니다. 긍정적인 마음가짐과 감사하는 태도의 중요성을 강조합니다.",
      altText: profiles[3]?.name
        ? `${profiles[3].name} 프로필 사진`
        : "프로필 사진", // Use profile name for alt text or default
    },
    {
      id: 2,
      imageUrl: profiles[4]?.imageUrl || "/profiles/profile-fallback.png", // Use profile 5 image or fallback
      name: profiles[4]?.name || "최현우",
      answerTitle: "도전과 성장의 관계",
      answerText:
        "어려움을 극복하고 성장하는 과정의 중요성에 대해 설명합니다. 실패를 두려워하지 않고 끊임없이 도전하는 자세를 격려합니다.",
      altText: profiles[4]?.name
        ? `${profiles[4].name} 프로필 사진`
        : "프로필 사진", // Use profile name for alt text or default
    },
  ];

  // Use the dummy data instead of props
  const data = dummyData;

  return (
    // Wrap the elements in a single fragment
    <div className="flex flex-col max-w-[680px] mx-auto">
      <h1 className="text-3xl font-bold my-12 text-white">Item Components</h1>
      <ul className="space-y-2">
        {data.map((profile: Profile) => (
          <li key={profile.id}>
            <Item
              imageUrl={profile.imageUrl}
              name={profile.name}
              requestDate={new Date(profile.requestDate)}
              actions={<Button>소울링크 띄우기</Button>}
            />
          </li>
        ))}
      </ul>

      <h1 className="text-3xl font-bold my-12 text-white">Item Components</h1>
      <ul className="space-y-2">
        {data.map((profile: Profile) => (
          <li key={profile.id}>
            <Item
              imageUrl={profile.imageUrl}
              name={profile.name}
              requestDate={new Date(profile.requestDate)}
              actions={<Button>수락</Button>}
            />
          </li>
        ))}
      </ul>

      <h1 className="text-3xl font-bold my-12 text-white">
        ItemAnswerBook Components
      </h1>
      <ul className="space-y-4">
        {dummyAnswerBookData.map((item: AnswerBook) => (
          <li key={item.id}>
            <ItemAnswerBook
              imageUrl={item.imageUrl}
              answerTitle={item.answerTitle}
              answerText={item.answerText}
              altText={item.altText ?? `${item.answerTitle} 표지`} // Ensure altText is always a string
            />
          </li>
        ))}
      </ul>

      <h1 className="text-3xl font-bold my-12 text-white">
        ItemAnswerProfile Components
      </h1>
      <ul className="space-y-6">
        {dummyAnswerProfileData.map((item: AnswerProfile) => (
          <li key={item.id}>
            <ItemAnswerProfile
              imageUrl={item.imageUrl}
              name={item.name}
              answerTitle={item.answerTitle}
              answerText={item.answerText}
              altText={item.altText ?? `${item.name} 프로필`} // Ensure altText is always a string
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
