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
  const sentPendingRequests = requests.filter(
    (req) => req.senderProfileId === currentUserId && req.status === "pending"
  );
  const receivedPendingRequests = requests.filter(
    (req) => req.receiverProfileId === currentUserId && req.status === "pending"
  );
  /*
  const thinkingRequests = requests.filter(
    (req) =>
      req.receiverProfileId === currentUserId && req.status === "thinking"
  );
  */

  // Find mutually interested profiles (both sent a pending request to each other)
  const mutuallyInterestedProfileIds = sentPendingRequests
    .map((sentReq) => sentReq.receiverProfileId)
    .filter((receiverId) =>
      receivedPendingRequests.some(
        (receivedReq) => receivedReq.senderProfileId === receiverId
      )
    );

  // Placeholder action handlers
  /*
  const handleCancelRequest = (requestId: string) => {
    console.log(`Canceling request: ${requestId}`);
    setRequests(requests.filter((req) => req.id !== requestId));
  };
  */

  const handleAcceptRequest = (requestId: string) => {
    console.log(`Accepting request: ${requestId}`);
    // In real app, update status to 'linked' or create reciprocal request
    setRequests(requests.filter((req) => req.id !== requestId)); // Remove from pending list
  };

  // Placeholder for sending Soul Link (mutual interest)
  const handleSendSoulLink = (profileId: string) => {
    console.log(`Sending Soul Link to profile: ${profileId}`);
    // Find the two requests involved (A->B and B->A)
    const requestFromCurrentUser = requests.find(
      (req) =>
        req.senderProfileId === currentUserId &&
        req.receiverProfileId === profileId &&
        req.status === "pending"
    );
    const requestToCurrentUser = requests.find(
      (req) =>
        req.senderProfileId === profileId &&
        req.receiverProfileId === currentUserId &&
        req.status === "pending"
    );

    // In a real app, you'd update both requests to 'linked' or create a new 'link' record.
    // For this example, just remove both pending requests.
    const requestsToRemove = [
      requestFromCurrentUser?.id,
      requestToCurrentUser?.id,
    ].filter((id) => !!id) as string[];
    setRequests(requests.filter((req) => !requestsToRemove.includes(req.id)));
  };

  const renderProfileItem = (
    profile: Profile,
    requestDate: string,
    actions?: React.ReactNode
  ) => {
    const daysPassed = requestDate ? calculateDaysPassed(requestDate) : 0; // Calculate only if dateString is not empty
    const timeElapsedText = daysPassed > 0 ? `${daysPassed}일 경과` : ""; // Only show if > 0 days passed

    return (
      <li
        key={profile.id}
        className="flex items-center justify-between p-4 bg-white/5 rounded-md border border-white/10"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 relative flex-shrink-0">
            <Image
              src={profile.imageUrl}
              alt={profile.name}
              fill={true}
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-base text-white/90">
              {profile.name}님과의 소울링크
            </p>
            {/* Only show time elapsed if daysPassed > 0 and requestDate was provided */}
            {requestDate && daysPassed > 0 && (
              <p className="text-sm text-white/65 mt-1">{timeElapsedText}</p>
            )}
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
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:cursor-pointer ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 flex flex-col pt-12">
      <div className="max-w-[680px] mx-auto w-full flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white/90 mb-6">
            소울링크
          </h1>

          {/* Top Grid - Maybe filter this later to show only LINKED profiles? */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 mb-12">
            {allProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                  <Image
                    src={profile.imageUrl}
                    alt={profile.name}
                    fill={true}
                    className="rounded-full border-2 border-[#38d4e7] object-cover"
                  />
                </div>
                <Link href="/soullink/someone" legacyBehavior>
                  <a className="text-base text-white/85 hover:underline cursor-pointer">
                    {profile.name}
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mutual Interest Section */}
        {mutuallyInterestedProfileIds.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white/90">
              소울링크 보내기
            </h2>
            <ul className="space-y-3">
              {mutuallyInterestedProfileIds.map((profileId) => {
                const profile = getProfileById(profileId);
                // Find one of the requests to get the date (e.g., the one sent by the current user)
                const relevantRequest = sentPendingRequests.find(
                  (req) => req.receiverProfileId === profileId
                );
                const requestDate = relevantRequest
                  ? relevantRequest.requestDate
                  : getDateNDaysAgo(0); // Fallback date

                return profile
                  ? renderProfileItem(
                      profile,
                      requestDate, // Use the date from one of the requests
                      <ActionButton
                        onClick={() => handleSendSoulLink(profile.id)}
                        className="bg-[#6ABECF] hover:bg-[#7AC5D9] text-white"
                      >
                        소울링크 보내기
                      </ActionButton>
                    )
                  : null;
              })}
            </ul>
          </div>
        )}

        {/* Received Requests Section */}
        {receivedPendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl text-white/90 font-semibold mb-4">
              서로 관심 표현
            </h2>
            <ul className="space-y-3">
              {receivedPendingRequests.map((req) => {
                const profile = getProfileById(req.senderProfileId);
                // Exclude profiles already shown in the mutual interest section
                if (
                  profile &&
                  mutuallyInterestedProfileIds.includes(profile.id)
                ) {
                  return null;
                }
                return profile
                  ? renderProfileItem(
                      profile,
                      "", // Pass empty string to hide time elapsed
                      <>
                        <ActionButton
                          onClick={() => handleAcceptRequest(req.id)}
                          className="bg-[#4A9DAF] hover:bg-[#5FA8B9] text-white"
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

        {/* Sent Requests Section */}
        {sentPendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl text-white/90 font-semibold mb-4">
              보낸 요청
            </h2>
            <ul className="space-y-3">
              {sentPendingRequests.map((req) => {
                const profile = getProfileById(req.receiverProfileId);
                // Exclude profiles already shown in the mutual interest section
                if (
                  profile &&
                  mutuallyInterestedProfileIds.includes(profile.id)
                ) {
                  return null;
                }
                return profile
                  ? renderProfileItem(profile, req.requestDate)
                  : null;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoulLinkPage;
