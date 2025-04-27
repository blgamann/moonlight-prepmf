"use client";

import {
  IndexBottom,
  IndexBottomButton,
  IndexTop,
  IndexTopBack,
} from "@/components/index-bar";
// Assuming BookSmProps and ProfileSmProps align with data.json structure
// If not, imports for BookSmProps/ProfileSmProps might be needed from ../../components/book and ../../components/profile
// Or adjust the sample data structure accordingly.
import data from "../../../data.json"; // Import the data

// Sample data extraction (replace with actual data fetching/selection logic if needed)
const sampleBook = data.books[0]; // 채식주의자
const sampleProfile = data.profiles[0]; // 김민준
const anotherProfile = data.profiles[3]; // Alexander Maximilian Bartholomew III

export default function IndexBarPage() {
  // Example back URL (replace with actual logic if needed)
  const back = "채식주의자";
  const totalPages = 5;
  const currentPage = 2;

  return (
    <div className="flex flex-col space-y-24 min-h-screen">
      <IndexTop profile={sampleProfile} />

      <IndexTopBack
        title={"작가의 편지"} // Use book title for the main title
        back={back}
      />

      <IndexTopBack
        title={sampleBook.title} // Use book title for the main title
        back={back}
        book={{
          // Pass required props for BookSm (excluding id, author)
          title: sampleBook.title,
          imageUrl: sampleBook.imageUrl,
        }}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <IndexTopBack
        title="This is a very very very very very very very very very very very very long title to test truncation"
        back={back}
        book={{
          title: sampleBook.title,
          imageUrl: sampleBook.imageUrl,
        }}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <IndexTopBack
        title={`${sampleProfile.name}의 프로필`} // Use profile name for the title
        back={back}
        profile={{
          // Pass required props for ProfileSm (excluding id, bio)
          name: sampleProfile.name,
          imageUrl: sampleProfile.imageUrl,
        }}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <IndexTopBack
        title={`${anotherProfile.name}'s Profile`} // Use profile name for the title
        back={back}
        profile={{
          name: anotherProfile.name,
          imageUrl: anotherProfile.imageUrl,
        }}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <IndexBottom back={"이전 답변"} forward={"다음 답변"} />
      <IndexBottom back={"이전 프로필"} forward={"다음 프로필"} />

      <IndexBottomButton back={"이전 답변"} forward={"다음 답변"} />
      <IndexBottomButton back={"이전 프로필"} forward={"다음 프로필"} />
    </div>
  );
}
