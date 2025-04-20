"use client";

import { useState } from "react"; // Import useState
import Image from "next/image";
import Link from "next/link"; // Added import
import data from "@/data.json"; // Adjust path if needed

interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
}

// --- Dummy Data Section ---
interface SoulLinkRequest {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  status: "pending" | "thinking";
  requestDate: string; // Added request date
}

const currentUserId = "profile-1"; // Assume current user

// Helper function to get date string for N days ago
const getDateNDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
};

const dummyRequests: SoulLinkRequest[] = [
  {
    id: "req-1",
    senderProfileId: "profile-1",
    receiverProfileId: "profile-2",
    status: "pending",
    requestDate: getDateNDaysAgo(3),
  }, // 3일 전
  {
    id: "req-2",
    senderProfileId: "profile-3",
    receiverProfileId: "profile-1",
    status: "pending",
    requestDate: getDateNDaysAgo(13),
  }, // 13일 전
  {
    id: "req-3",
    senderProfileId: "profile-4",
    receiverProfileId: "profile-1",
    status: "thinking",
    requestDate: getDateNDaysAgo(5),
  }, // 5일 전
  {
    id: "req-4",
    senderProfileId: "profile-1",
    receiverProfileId: "profile-5",
    status: "pending",
    requestDate: getDateNDaysAgo(1),
  }, // 1일 전
];
// --- End Dummy Data ---

// Utility function to calculate days passed
const calculateDaysPassed = (dateString: string): number => {
  // Split the 'YYYY-MM-DD' string
  const parts = dateString.split("-");
  if (parts.length !== 3) {
    console.error("Invalid date string format:", dateString);
    return NaN; // Return NaN or handle error appropriately
  }
  // Note: Month is 0-indexed in Date constructor (0 = January)
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  // Create Date object using parsed components
  const requestDate = new Date(Date.UTC(year, month, day)); // Use UTC to avoid timezone issues

  const today = new Date();
  // Set today's time to 00:00:00 UTC for accurate date difference
  today.setUTCHours(0, 0, 0, 0);

  // Check if the date creation was successful
  if (isNaN(requestDate.getTime())) {
    console.error("Failed to create Date object from:", dateString);
    return NaN;
  }

  const differenceInTime = today.getTime() - requestDate.getTime();
  // Calculate difference in days, ensuring positive result
  const differenceInDays = Math.max(
    0,
    Math.floor(differenceInTime / (1000 * 3600 * 24))
  );
  return differenceInDays;
};

const SoulLinkPage = () => {
  const allProfiles: Profile[] = data.profiles;
  // State for dummy requests (to allow removing items)
  const [requests, setRequests] = useState<SoulLinkRequest[]>(dummyRequests);

  // Find profile details by ID
  const getProfileById = (id: string): Profile | undefined => {
    return allProfiles.find((p) => p.id === id);
  };

  // Filter requests based on current user
  const sentRequests = requests.filter(
    (req) => req.senderProfileId === currentUserId && req.status === "pending"
  );
  const receivedRequests = requests.filter(
    (req) => req.receiverProfileId === currentUserId && req.status === "pending"
  );
  const thinkingRequests = requests.filter(
    (req) =>
      req.receiverProfileId === currentUserId && req.status === "thinking"
  );

  // Placeholder action handlers
  const handleCancelRequest = (requestId: string) => {
    console.log(`Canceling request: ${requestId}`);
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log(`Accepting request: ${requestId}`);
    // In real app, update status to 'linked' or create reciprocal request
    setRequests(requests.filter((req) => req.id !== requestId)); // Remove from pending list
  };

  const handleDeferRequest = (requestId: string) => {
    console.log(`Deferring request: ${requestId}`);
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "thinking" } : req
      )
    );
  };

  const renderProfileItem = (
    profile: Profile,
    requestDate: string,
    actions?: React.ReactNode
  ) => {
    const daysPassed = calculateDaysPassed(requestDate);
    const timeElapsedText = daysPassed === 0 ? "오늘" : `${daysPassed}일 경과`;

    return (
      <li
        key={profile.id}
        className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 relative flex-shrink-0">
            <Image
              src={profile.imageUrl}
              alt={profile.name}
              layout="fill"
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-base font-medium text-gray-100">
              {profile.name}님과의 소울링크
            </p>
            <p className="text-sm text-gray-400 mt-1">{timeElapsedText}</p>
          </div>
        </div>
        {actions && (
          <div className="flex space-x-2 items-center">{actions}</div>
        )}
      </li>
    );
  };

  const ActionButton = ({
    onClick,
    children,
    className,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col pt-12">
      <div className="max-w-[680px] mx-auto w-full flex-grow">
        <h1 className="text-2xl font-semibold mb-6 text-gray-200">소울 링크</h1>

        {/* Top Grid - Maybe filter this later to show only LINKED profiles? */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-12">
          {allProfiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                <Image
                  src={profile.imageUrl}
                  alt={profile.name}
                  layout="fill"
                  className="rounded-full object-cover border-2 border-gray-700"
                  unoptimized
                />
              </div>
              <Link href="/soullink/someone" legacyBehavior>
                <a className="text-base text-gray-200 hover:underline cursor-pointer">
                  {profile.name}
                </a>
              </Link>
            </div>
          ))}
        </div>

        {/* Sent Requests Section */}
        {sentRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              보낸 요청
            </h2>
            <ul className="space-y-3">
              {sentRequests.map((req) => {
                const profile = getProfileById(req.receiverProfileId);
                return profile
                  ? renderProfileItem(
                      profile,
                      req.requestDate,
                      <ActionButton
                        onClick={() => handleCancelRequest(req.id)}
                        className="border border-red-500 text-red-400 hover:bg-red-900 hover:text-red-300"
                      >
                        내리기
                      </ActionButton>
                    )
                  : null;
              })}
            </ul>
          </div>
        )}

        {/* Received Requests Section */}
        {receivedRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              받은 요청
            </h2>
            <ul className="space-y-3">
              {receivedRequests.map((req) => {
                const profile = getProfileById(req.senderProfileId);
                return profile
                  ? renderProfileItem(
                      profile,
                      req.requestDate,
                      <>
                        <ActionButton
                          onClick={() => handleAcceptRequest(req.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-blue-100"
                        >
                          소울링크 띄우기
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDeferRequest(req.id)}
                          className="bg-gray-600 hover:bg-gray-500 text-gray-100"
                        >
                          아직이요, 좀 더 시간을 가져볼게요
                        </ActionButton>
                      </>
                    )
                  : null;
              })}
            </ul>
          </div>
        )}

        {/* Thinking Requests Section */}
        {thinkingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              생각 중인 요청
            </h2>
            <ul className="space-y-3">
              {thinkingRequests.map((req) => {
                const profile = getProfileById(req.senderProfileId);
                return profile
                  ? renderProfileItem(
                      profile,
                      req.requestDate,
                      <>
                        <ActionButton
                          onClick={() => handleAcceptRequest(req.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-blue-100"
                        >
                          소울링크 띄우기
                        </ActionButton>
                      </>
                    )
                  : null;
              })}
            </ul>
          </div>
        )}

        {/* Add some bottom padding */}
        <div className="pb-16"></div>
      </div>
    </div>
  );
};

export default SoulLinkPage;
