import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- Interfaces (copied from page.tsx or defined locally if preferred) ---
interface UserProfile {
  profile_id: string;
  name: string;
  imageUrl: string;
  bio?: string;
}

interface ConnectionInfo {
  degree: number;
  path: UserProfile[];
}

interface CommonBookDetail {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface CommonBooksInfo {
  books: CommonBookDetail[];
}
// -----------------------------------------------------------------------

// --- Dummy Data for Own Profile Demo ---
const dummyFriendProfile: UserProfile = {
  profile_id: "dummy-friend",
  name: "가상 친구",
  imageUrl: "/profiles/profile-placeholder.png", // Replace with a real placeholder if you have one
};

const dummyConnectionInfo: ConnectionInfo = {
  degree: 1,
  path: [], // Path only includes intermediate users, so empty for degree 1
};
// -------------------------------------

interface UserRelationSectionProps {
  viewingUser: UserProfile;
  targetUser: UserProfile;
  connectionInfo?: ConnectionInfo; // Make optional
  commonBooksInfo?: CommonBooksInfo; // Make optional
}

const UserRelationSection: React.FC<UserRelationSectionProps> = ({
  viewingUser,
  targetUser,
  connectionInfo: providedConnectionInfo, // Rename prop to avoid conflict
  commonBooksInfo,
}) => {
  // --- Use Dummy Data if on own profile and no real connection data --- START
  let connectionInfo = providedConnectionInfo;
  const isOwnProfile = viewingUser.profile_id === targetUser.profile_id;

  if (isOwnProfile && !connectionInfo) {
    // Use dummy data only if on own profile and no connection info is provided
    connectionInfo = dummyConnectionInfo;
    // Adjust targetUser for the dummy display
    targetUser = dummyFriendProfile;
  }
  // --- Use Dummy Data if on own profile and no real connection data --- END

  const hasConnection = !!connectionInfo;
  const hasCommonBooks = !!commonBooksInfo && commonBooksInfo.books?.length > 0;

  // Render nothing if neither section has data (after potential dummy data check)
  if (!hasConnection && !hasCommonBooks) {
    return null;
  }

  return (
    // Main container for the combined section
    <div className="mt-12 p-6 border border-white/10 rounded-md bg-white/5 mb-16 shadow-lg">
      {/* --- Connection Path Sub-section --- */}
      {hasConnection && connectionInfo && (
        <div
          className={hasCommonBooks ? "pb-4 mb-4 border-b border-white/10" : ""}
        >
          {/* Modify title for dummy data case */}
          <h3 className="text-base text-white/85 mb-8">
            {viewingUser.name}님과 {targetUser.name}님은{" "}
            <strong className="text-[#6ABECF]">
              {connectionInfo.degree}촌
            </strong>{" "}
            입니다.
            {isOwnProfile && connectionInfo.degree === 1 && " (예시)"}
          </h3>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {/* Viewing User */}
            <div className="flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-24">
              <div className="relative w-16 h-16 mb-1">
                <Image
                  src={viewingUser.imageUrl}
                  alt={viewingUser.name}
                  fill={true}
                  className="rounded-full border-2 border-[#6ABECF] object-cover"
                />
              </div>
              <Link
                href={`/profile/${viewingUser.profile_id}`}
                className="mt-1 text-sm truncate text-white hover:underline"
              >
                {viewingUser.name} (나)
              </Link>
            </div>
            {/* Intermediate Users */}
            {connectionInfo.path.length > 0 &&
              connectionInfo.path.map((user) => (
                <React.Fragment key={user.profile_id}>
                  <div className="text-white/85 text-xl font-light flex-shrink-0 mx-1 sm:mx-2">
                    →
                  </div>
                  <div className="flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-24">
                    <div className="relative w-16 h-16 mb-1">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        fill={true}
                        className="rounded-full border-2 border-[#6ABECF] object-cover"
                      />
                    </div>
                    <Link
                      href={`/profile/${user.profile_id}`}
                      className="mt-1 text-sm truncate text-white hover:underline"
                    >
                      {user.name}
                    </Link>
                  </div>
                </React.Fragment>
              ))}

            {/* Always show arrow before the target user */}
            <div className="text-white/85 text-xl font-light flex-shrink-0 mx-1 sm:mx-2">
              →
            </div>

            {/* Target User - Could be real or dummy */}
            <div className="flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-24">
              <div className="relative w-16 h-16 mb-1">
                <Image
                  src={targetUser.imageUrl} // Uses potentially overridden targetUser
                  alt={targetUser.name} // Uses potentially overridden targetUser
                  fill={true}
                  className="rounded-full border-2 border-[#6ABECF] object-cover"
                />
              </div>
              <Link
                href={`/profile/${targetUser.profile_id}`}
                className="mt-1 text-sm truncate text-white hover:underline"
              >
                {targetUser.name}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- Common Books Sub-section --- */}
      {hasCommonBooks && commonBooksInfo && (
        <div>
          <h4 className="text-base text-white/85 mb-6">함께 읽은 책</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-3 gap-y-4">
            {commonBooksInfo.books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-1.5 flex-shrink-0 relative w-16 h-24">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill={true}
                    className="rounded shadow-md object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-semibold text-white/85 w-full">
                  <Link href="/garden/vegan" className="hover:underline">
                    {book.title}
                  </Link>
                </p>
                <p className="text-xs text-white/50 leading-tight line-clamp-1 w-full">
                  {book.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRelationSection;
